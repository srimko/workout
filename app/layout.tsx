import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { Toaster } from "@/components/ui/sonner"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister"
import { createClient } from "@/utils/supabase/server"
import { ThemeProvider } from "@/lib/providers/ThemeProvider"
import "./globals.css"

import Link from "next/link"
import { Dumbbell, User, Library, LogOut, GitCompare, Award } from "lucide-react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

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
    title: "Exercises",
    url: "/exercises",
    icon: Library,
  },
]
// {
//   title: "Management",
//   items: [
//     {
//       title: "Profile",
//       url: profileId ? `/users/${profileId}` : "/",
//       icon: User,
//     },
//   ],
// },

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
          <ServiceWorkerRegister />
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              {user && <AppHeader />}
              <div className="p-4 flex-1 min-h-0">{children}</div>
            </SidebarInset>
          </SidebarProvider>
          <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-background border-t border-border/50 backdrop-blur-sm safe-area-inset-bottom flex justify-between">
            {items.map((item) => {
              // const isActive = pathname === item.url
              const Icon = item.icon

              return (
                <Link key={item.title} href={item.url} className="flex flex-col items-center">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.title}</span>
                </Link>
              )
            })}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
