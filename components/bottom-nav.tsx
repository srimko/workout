"use client"

import { Award, Dumbbell, GitCompare, Library, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

interface BottomNavProps {
  profileId: string | null
}

export function BottomNav({ profileId }: BottomNavProps) {
  const pathname = usePathname()

  const items: NavItem[] = [
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

  const isActive = (itemUrl: string) => {
    if (itemUrl === "/") {
      return pathname === "/" || pathname === "/home"
    }
    return pathname.startsWith(itemUrl)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-background border-t border-border/50 backdrop-blur-sm safe-area-inset-bottom">
      <div className="flex justify-between">
        {items.map((item) => {
          const Icon = item.icon
          const active = isActive(item.url)

          return (
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                active ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary",
              )}
            >
              <Icon className={cn("h-5 w-5", active && "stroke-[2.5px]")} />
              <span className="text-xs">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
