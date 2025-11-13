"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Profile } from "@/lib/types"
import { createClient } from "@/utils/supabase/client"

export default function UsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data } = await supabase.from("profiles").select("*")
        setProfiles(data || [])
      } catch (error) {
        console.error("Error fetching profiles:", error)
      }
    }

    fetchProfiles()
  }, [])

  return (
    <section className="py-32">
      <div className="px-0 md:px-2">
        <div className="flex flex-col">
          {profiles.map((profile) => (
            <div className="flex justify-between gap-4 px-4 py-5 md:grid-cols-4" key={profile.id}>
              <div className="flex items-center md:order-none">
                <Avatar className="mr-2">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold">{profile.display_name}</h3>
                  <p className="text-muted-foreground text-sm">{profile.birthday}</p>
                </div>
              </div>
              <Link href={`/users/${profile.id}`} className="flex items-center gap-2">
                <span>View profile</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
