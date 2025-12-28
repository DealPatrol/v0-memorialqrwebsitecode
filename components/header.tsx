import Link from "next/link"
import { CartButton } from "./cart-button"

export function Header() {
  return (
    <header className="bg-rose-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-2">Memorial QR</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-rose-200 transition-colors">
              Home
            </Link>
            <Link href="/how-it-works" className="hover:text-rose-200 transition-colors">
              How It Works
            </Link>
            <Link href="/pricing" className="hover:text-rose-200 transition-colors">
              Pricing
            </Link>
            <Link href="/memorials" className="hover:text-rose-200 transition-colors">
              Memorials
            </Link>
            <Link href="/contact" className="hover:text-rose-200 transition-colors">
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <CartButton />
          <Link
            href="/login"
            className="hidden md:inline-block px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-500 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="hidden md:inline-block px-4 py-2 rounded-md bg-yellow-400 text-rose-800 hover:bg-yellow-300 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  )
}
