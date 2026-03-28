"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, User, PawPrint, ShoppingBag, BookOpen, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import React, { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a"> & { title: string }>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"

export function Header() {
  const [user, setUser] = useState<{ id: string; email?: string; name?: string } | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const supabase = await createClient()
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (authUser) {
        setUser(authUser)

        const { data: profile } = await supabase.from("profiles").select("name").eq("id", authUser.id).single()

        if (profile?.name) {
          setUserName(profile.name)
        } else {
          // Fallback to email name if no profile name
          setUserName(authUser.email?.split("@")[0] || "User")
        }
      }
    }

    getUser()
  }, [])

  const handleLogout = async () => {
    const supabase = await createClient()
    await supabase.auth.signOut()
    setUser(null)
    setUserName(null)
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="flex items-center flex-1">
          <Link href="/" className="mr-8 flex items-center">
            <span className="font-script text-3xl font-bold text-primary">Memorial QR</span>
          </Link>
          <NavigationMenu className="hidden md:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Memorials</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <ListItem href="/human-memorials" title="Human Memorials">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span>Honor loved ones with dignified tributes</span>
                      </div>
                    </ListItem>
                    <ListItem href="/pet-memorials" title="Pet Memorials">
                      <div className="flex items-center gap-2">
                        <PawPrint className="h-4 w-4 text-amber-600" />
                        <span>Celebrate beloved furry friends</span>
                      </div>
                    </ListItem>
                    <ListItem href="/browse-memorials" title="Browse Memorials">
                      View example memorials from our community
                    </ListItem>
                    <ListItem href="/programs" title="Products & Tags">
                      QR plaques, headstone tags, and collar tags
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/store" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Store
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/how-it-works" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    How It Works
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/blog" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Blog
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/contact" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    Contact
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <Link href="/" className="mb-6 flex items-center">
              <span className="font-script text-2xl font-bold text-primary">Memorial QR</span>
            </Link>
            <nav className="flex flex-col gap-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Memorials</div>
              <Link
                href="/human-memorials"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground pl-2"
              >
                <User className="h-4 w-4" />
                Human Memorials
              </Link>
              <Link
                href="/pet-memorials"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground pl-2"
              >
                <PawPrint className="h-4 w-4" />
                Pet Memorials
              </Link>
              <Link href="/browse-memorials" className="text-muted-foreground hover:text-foreground pl-2">
                Browse Memorials
              </Link>
              <Link href="/programs" className="text-muted-foreground hover:text-foreground pl-2">
                Products & Tags
              </Link>
              <div className="border-t my-2" />
              <Link href="/store" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ShoppingBag className="h-4 w-4" />
                Store
              </Link>
              <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground">
                How It Works
              </Link>
              <Link href="/blog" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <BookOpen className="h-4 w-4" />
                Blog
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                Contact
              </Link>
              {!user && (
                <Link href="/auth/login" className="text-muted-foreground hover:text-foreground">
                  Sign In
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {user && userName ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">{userName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{userName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account">Account Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/store">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Store
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
