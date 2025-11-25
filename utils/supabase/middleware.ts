import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const updateSession = async (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        )
      },
    },
  })

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 🔍 DEBUG : Afficher les infos du token
  // const {
  //   data: { session },
  // } = await supabase.auth.getSession()
  // if (session) {
  //   const expiresAt = new Date(session.expires_at! * 1000)
  //   const expiresIn = session.expires_in // En secondes

  //   console.log("🔑 Token d'accès :")
  //   console.log("  - Expire dans:", expiresIn, "secondes")
  //   console.log("  - Expire le:", expiresAt.toLocaleString())
  //   console.log("  - Créé le:", new Date(Date.now() - (3600 - expiresIn!) * 1000).toLocaleString())
  // }

  // Routes publiques (pas besoin d'auth)
  const publicRoutes = ["/login", "/signup"]
  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // Vérifier si l'utilisateur est admin
  const isAdmin = user?.email === process.env.ADMIN_EMAIL
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")

  // Si pas d'user et route protégée → redirect vers /login
  if (!user && !isPublicRoute) {
    const redirectUrl = new URL("/login", request.url)
    // Sauvegarder la page d'origine pour redirect après login
    redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Protection des routes admin : bloquer l'accès aux non-admins
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Redirection automatique des admins de / vers /admin
  // TODO : Faire une redirection de toutes les routes vers /admin/dashboard
  if (isAdmin && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  // Si user connecté et sur /login → redirect vers /
  if (user && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return supabaseResponse
}
