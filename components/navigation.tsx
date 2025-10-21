'use client';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export function Navigation() {
    const router = useRouter()

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <NavigationMenu className="flex justify-center m-auto">
            <NavigationMenuList className="flex-wrap">
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/">Home</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/users">Users</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/exercices">Exercices</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <button onClick={handleLogout}>Logout</button>
                </NavigationMenuLink>
            </NavigationMenuList>
        </NavigationMenu>
    )
}