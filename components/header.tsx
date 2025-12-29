"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Menu, User, PawPrint, ShoppingBag, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import React from "react"

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
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="mr-4 hidden md:flex md:flex-1">
          <Link href="/" className="mr-8 flex items-center">
            <span className="font-script text-3xl font-bold text-primary">Memorial QR</span>
          </Link>
          <NavigationMenu>
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
                <Link href="/store" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Store
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/how-it-works" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    How It Works
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/blog" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Blog
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    Contact
                  </NavigationMenuLink>
                </Link>
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
              <Link href="/auth/login" className="text-muted-foreground hover:text-foreground">
                Sign In
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Mobile Logo */}
        <div className="flex flex-1 md:hidden">
          <Link href="/" className="flex items-center">
            <span className="font-script text-xl font-bold text-primary">Memorial QR</span>
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/store">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Store
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
