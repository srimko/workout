import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { AppHeader } from "@/components/app-header"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/lib/providers/ThemeProvider"
import { createClient } from "@/utils/supabase/server"
import "./globals.css"

import { Award, Dumbbell, GitCompare, Library, User } from "lucide-react"
import Link from "next/link"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Muscu Tracker",
  description: "Application de suivi d'entraînement musculation",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Muscu Tracker",
  },
  formatDetection: {
    telephone: false,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Récupérer le profileId ici
  let profileId = null
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_id", user.id)
      .single()

    if (profile) {
      profileId = profile.id
    }
  }

  const items = [
    {
      title: "Home",
      url: "/",
      icon: Dumbbell,
    },
    {
      title: "Historique",
      url: "/historique",
      icon: Library,
    },
    {
      title: "Comparaison",
      url: "/comparaison",
      icon: GitCompare,
    },
    {
      title: "Standards",
      url: "/standards",
      icon: Award,
    },
    {
      title: "Profile",
      url: profileId ? `/users/${profileId}` : "/",
      icon: User,
    },
  ]

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen pb-[120px]">
            {user && <AppHeader />}
            <main className="flex-1 p-4 pb-20">{children}</main>
          </div>

          {/* Bottom Navigation Bar */}
          <nav className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-background border-t border-border/50 backdrop-blur-sm safe-area-inset-bottom">
            <div className="flex justify-between">
              {items.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.title}
                    href={item.url}
                    className="flex flex-col items-center gap-1 hover:text-primary transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{item.title}</span>
                  </Link>
                )
              })}
            </div>
          </nav>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
