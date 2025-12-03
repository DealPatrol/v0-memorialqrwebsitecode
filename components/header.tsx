"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="mr-4 hidden md:flex md:flex-1">
          <Link href="/" className="mr-8 flex items-center">
            <span className="font-script text-3xl font-bold text-primary">Memorial QR</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/browse-memorials" className="transition-colors hover:text-foreground text-muted-foreground">
              Sample Memorials
            </Link>
            <Link href="/programs" className="transition-colors hover:text-foreground text-muted-foreground">
              Products
            </Link>
            <Link href="/how-it-works" className="transition-colors hover:text-foreground text-muted-foreground">
              How It Works
            </Link>
            <Link href="/our-story" className="transition-colors hover:text-foreground text-muted-foreground">
              Our Story
            </Link>
            <Link href="/contact" className="transition-colors hover:text-foreground text-muted-foreground">
              Contact
            </Link>
          </nav>
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
              <Link href="/browse-memorials" className="text-muted-foreground hover:text-foreground">
                Sample Memorials
              </Link>
              <Link href="/programs" className="text-muted-foreground hover:text-foreground">
                Products
              </Link>
              <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground">
                How It Works
              </Link>
              <Link href="/our-story" className="text-muted-foreground hover:text-foreground">
                Our Story
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
          <Button size="sm" asChild>
            <Link href="/pricing">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
