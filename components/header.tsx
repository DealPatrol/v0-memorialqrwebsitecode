"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="font-script text-xl sm:text-2xl md:text-3xl font-bold text-primary">Memorial QR</span>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm font-medium">
          <Link
            href="/browse-memorials"
            className="transition-colors hover:text-foreground text-muted-foreground whitespace-nowrap"
          >
            Browse Memorials
          </Link>
          <Link href="/programs" className="transition-colors hover:text-foreground text-muted-foreground">
            Programs
          </Link>
          <Link
            href="/how-it-works"
            className="transition-colors hover:text-foreground text-muted-foreground whitespace-nowrap"
          >
            How It Works
          </Link>
          <Link
            href="/our-story"
            className="transition-colors hover:text-foreground text-muted-foreground whitespace-nowrap"
          >
            Our Story
          </Link>
          <Link href="/contact" className="transition-colors hover:text-foreground text-muted-foreground">
            Contact
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/checkout">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
