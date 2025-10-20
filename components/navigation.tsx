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

export function Navigation() {
    return (
        <NavigationMenu className="flex justify-center m-auto">
            <NavigationMenuList className="flex-wrap">
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/">Home</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/users">Users</Link>
                </NavigationMenuLink>
            </NavigationMenuList>
        </NavigationMenu>
    )
}