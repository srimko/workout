"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"

export function AppHeader() {
  return (
    <header className="flex items-center gap-2 border-b px-4 py-3">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1 text-center">
        <h1 className="text-xl font-semibold">Workout App</h1>
      </div>
      <div className="w-7" />
    </header>
  )
}
