"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-script text-2xl font-bold sm:inline-block text-purple-600">Memorial QR</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/browse-memorials" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Browse Memorials
            </Link>
            <Link href="/programs" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Programs
            </Link>
            <Link href="/how-it-works" className="transition-colors hover:text-foreground/80 text-foreground/60">
              How It Works
            </Link>
            <Link href="/our-story" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Our Story
            </Link>
            <Link href="/contact" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Contact
            </Link>
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center">
              <span className="font-script text-2xl font-bold text-purple-600">Memorial QR</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                <Link href="/browse-memorials" className="text-foreground/60">
                  Browse Memorials
                </Link>
                <Link href="/programs" className="text-foreground/60">
                  Programs
                </Link>
                <Link href="/how-it-works" className="text-foreground/60">
                  How It Works
                </Link>
                <Link href="/our-story" className="text-foreground/60">
                  Our Story
                </Link>
                <Link href="/contact" className="text-foreground/60">
                  Contact
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="flex items-center md:hidden">
              <span className="font-script text-xl font-bold text-purple-600">Memorial QR</span>
            </Link>
          </div>
          <nav className="flex items-center">
            <Button asChild>
              <Link href="/pricing">Get Started</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
