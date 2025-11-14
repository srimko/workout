"use client"

import { useEffect } from "react"

export function ServiceWorkerRegister() {
  useEffect(() => {
    // Check if service workers are supported
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Register service worker
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope)

          // Check for updates periodically
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // New service worker available, you might want to notify the user
                  console.log("New service worker available! Please refresh.")
                  // Optionally show a toast notification here
                }
              })
            }
          })

          // Check for updates every hour
          setInterval(
            () => {
              registration.update()
            },
            60 * 60 * 1000,
          )
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error)
        })
    }
  }, [])

  return null
}
