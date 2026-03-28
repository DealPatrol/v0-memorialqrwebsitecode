"use client"

import Link from "next/link"
import { QrCode, Heart, PawPrint, HelpCircle, ShoppingBag } from "lucide-react"

const quickLinks = [
  { href: "#product-selector", label: "Shop", icon: ShoppingBag },
  { href: "/human-memorials", label: "Human", icon: Heart },
  { href: "/pet-memorials", label: "Pets", icon: PawPrint },
  { href: "/how-it-works", label: "How It Works", icon: QrCode },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
]

export function QuickLinksBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 z-50 md:hidden">
      <nav className="flex justify-around items-center h-16 px-2">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex flex-col items-center justify-center gap-1 px-3 py-2 text-zinc-400 hover:text-white transition-colors"
          >
            <link.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
