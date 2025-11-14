"use client"

import { LogOut } from "lucide-react"
import Link from "next/link"
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
    <header className="flex justify-between items-center border-b px-4 py-3">
      <div className="flex-1 text-center">
        <Link href="/">
          <h1 className="text-xl font-semibold">Workout App</h1>
        </Link>
      </div>
      <button type="button" onClick={handleLogout} className="hover:text-primary transition-colors">
        <LogOut className="h-5 w-5" />
      </button>
    </header>
  )
}
