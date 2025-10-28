"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="container flex h-14 items-center"
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          height: "3.5rem",
          alignItems: "center",
          padding: "0 1rem",
        }}
      >
        <div className="mr-4 flex md:flex-1" style={{ marginRight: "1rem", display: "flex", flex: "1" }}>
          <Link
            href="/"
            className="mr-6 flex items-center space-x-2"
            style={{ marginRight: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <span
              className="font-script font-bold text-purple-600 text-3xl"
              style={{
                fontFamily: "var(--font-great-vibes), cursive",
                fontWeight: "bold",
                color: "#9333ea",
                fontSize: "1.875rem",
              }}
            >
              Memorial QR
            </span>
          </Link>
          <nav
            className="hidden md:flex items-center space-x-6 text-sm font-medium"
            style={{
              display: "none",
              alignItems: "center",
              gap: "1.5rem",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            <Link
              href="/browse-memorials"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              style={{ color: "#6b7280", textDecoration: "none" }}
            >
              Browse Memorials
            </Link>
            <Link
              href="/programs"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              style={{ color: "#6b7280", textDecoration: "none" }}
            >
              Programs
            </Link>
            <Link
              href="/how-it-works"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              style={{ color: "#6b7280", textDecoration: "none" }}
            >
              How It Works
            </Link>
            <Link
              href="/our-story"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              style={{ color: "#6b7280", textDecoration: "none" }}
            >
              Our Story
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              style={{ color: "#6b7280", textDecoration: "none" }}
            >
              Contact
            </Link>
          </nav>
          <style jsx>{`
            @media (min-width: 768px) {
              nav {
                display: flex !important;
              }
            }
          `}</style>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              style={{
                marginRight: "0.5rem",
                padding: 0,
                fontSize: "1rem",
              }}
            >
              <Menu className="h-5 w-5" />
              <span
                className="sr-only"
                style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}
              >
                Toggle Menu
              </span>
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
                <Link href="/auth/login" className="text-foreground/60">
                  Sign In
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div
          className="flex items-center gap-2 md:ml-auto"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginLeft: "auto",
          }}
        >
          <Button
            variant="ghost"
            asChild
            className="hidden md:flex"
            style={{
              display: "none",
            }}
          >
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <style jsx>{`
            @media (min-width: 768px) {
              button {
                display: flex !important;
              }
            }
          `}</style>
          <Button asChild>
            <Link href="/pricing">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
