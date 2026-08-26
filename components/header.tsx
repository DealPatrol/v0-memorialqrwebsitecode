"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Heart } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="professional-container flex h-20 items-center justify-between">
        {/* Desktop Navigation */}
        <div className="mr-4 hidden md:flex md:flex-1 md:items-center">
          <Link href="/" className="mr-12 flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-800">
              <Heart className="h-5 w-5 text-white" fill="white" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-foreground">Memorial QR</span>
          </Link>
          <nav className="flex items-center gap-8 text-[15px] font-medium">
            <Link
              href="/store"
              className="transition-colors hover:text-foreground text-muted-foreground tracking-tight"
            >
              Store
            </Link>
            <Link
              href="/pet-memorials"
              className="transition-colors hover:text-foreground text-muted-foreground tracking-tight"
            >
              Pet Memorials
            </Link>
            <Link
              href="/browse-memorials"
              className="transition-colors hover:text-foreground text-muted-foreground tracking-tight"
            >
              Examples
            </Link>
            <Link
              href="/how-it-works"
              className="transition-colors hover:text-foreground text-muted-foreground tracking-tight"
            >
              How It Works
            </Link>
            <Link href="/blog" className="transition-colors hover:text-foreground text-muted-foreground tracking-tight">
              Blog
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
              <Link href="/store" className="text-muted-foreground hover:text-foreground">
                Store
              </Link>
              <Link href="/pet-memorials" className="text-muted-foreground hover:text-foreground">
                Pet Memorials
              </Link>
              <Link href="/browse-memorials" className="text-muted-foreground hover:text-foreground">
                Examples
              </Link>
              <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground">
                How It Works
              </Link>
              <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                Blog
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                Contact
              </Link>
              <Link href="/auth/signin" className="text-muted-foreground hover:text-foreground">
                Sign In
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Mobile Logo */}
        <div className="flex flex-1 md:hidden">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-800">
              <Heart className="h-4 w-4 text-white" fill="white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">Memorial QR</span>
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="hidden sm:flex font-medium">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button size="sm" asChild className="font-medium">
            <Link href="/store">Shop Now</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
