// Service Worker for Muscu Tracker PWA
const CACHE_NAME = "muscu-tracker-v1"
const RUNTIME_CACHE = "muscu-tracker-runtime"
const IMAGE_CACHE = "muscu-tracker-images"

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  "/",
  "/offline",
]

// Install event - precache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS)
    })
  )
  // Force the waiting service worker to become the active service worker
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME &&
                   cacheName !== RUNTIME_CACHE &&
                   cacheName !== IMAGE_CACHE
          })
          .map((cacheName) => caches.delete(cacheName))
      )
    })
  )
  // Take control of all pages immediately
  return self.clients.claim()
})

// Fetch event - handle requests with appropriate caching strategy
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Skip Chrome extensions and other non-http(s) requests
  if (!url.protocol.startsWith("http")) {
    return
  }

  // Strategy 1: Cache-first for exercise images
  if (url.pathname.startsWith("/exercises/")) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }
        return caches.open(IMAGE_CACHE).then((cache) => {
          return fetch(request).then((response) => {
            // Cache the fetched image for future use
            cache.put(request, response.clone())
            return response
          })
        })
      }).catch(() => {
        // Return a fallback if offline and not cached
        return new Response("Image not available offline", { status: 503 })
      })
    )
    return
  }

  // Strategy 2: Cache-first for static assets (icons, fonts)
  if (url.pathname.startsWith("/icons/") ||
      url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf)$/)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return cachedResponse || fetch(request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response.clone())
            return response
          })
        })
      })
    )
    return
  }

  // Strategy 3: Network-first for API calls (Supabase, etc.)
  if (url.hostname.includes("supabase") ||
      url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Optionally cache successful API responses
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // If network fails, try to return cached version
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || new Response(
              JSON.stringify({ error: "Offline" }),
              {
                status: 503,
                headers: { "Content-Type": "application/json" }
              }
            )
          })
        })
    )
    return
  }

  // Strategy 4: Network-first with cache fallback for navigation
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone()
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })
          return response
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match("/offline")
          })
        })
    )
    return
  }

  // Default: Network-first for everything else
  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone()
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseClone)
        })
        return response
      })
      .catch(() => {
        return caches.match(request)
      })
  )
})

// Push notification handling
self.addEventListener("push", (event) => {
  if (!event.data) {
    return
  }

  const data = event.data.json()
  const options = {
    body: data.body || "Nouvelle notification de Muscu Tracker",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.primaryKey || 1,
      url: data.url || "/",
    },
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "Muscu Tracker", options)
  )
})

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const urlToOpen = event.notification.data?.url || "/"

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open with the app
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus()
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})
