"use client"

import Link from "next/link"
import { LogOut } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export function AppHeader() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }
  return (
    <header className="flex justify-between border-b px-4 py-3">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1 text-center">
        <Link href="/">
          <h1 className="text-xl font-semibold">Workout App</h1>
        </Link>
      </div>
      <button type="button" onClick={handleLogout}>
        <LogOut className="h-4 w-4" />
      </button>
    </header>
  )
}
