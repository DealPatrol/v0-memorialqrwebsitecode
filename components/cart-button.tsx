"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"

export function CartButton() {
  const [itemCount, setItemCount] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Load cart from localStorage
    const savedCart = localStorage.getItem("memorialQrCart")
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart)
        const count = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
        setItemCount(count)
      } catch (e) {
        console.error("Error parsing cart data:", e)
      }
    }

    // Set up storage event listener to update cart count when changed in another tab
    const handleStorageChange = () => {
      const updatedCart = localStorage.getItem("memorialQrCart")
      if (updatedCart) {
        try {
          const cartItems = JSON.parse(updatedCart)
          const count = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
          setItemCount(count)
        } catch (e) {
          console.error("Error parsing cart data:", e)
        }
      } else {
        setItemCount(0)
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Custom event for same-tab updates
    window.addEventListener("cartUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cartUpdated", handleStorageChange)
    }
  }, [])

  // Only show count if we're on the client and have items
  const showCount = isClient && itemCount > 0

  return (
    <Link href="/cart">
      <div className="relative text-white hover:text-rose-200 transition-colors">
        <ShoppingCart className="h-6 w-6" />
        {showCount && (
          <span className="absolute -top-2 -right-2 bg-yellow-400 text-rose-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {itemCount}
          </span>
        )}
      </div>
    </Link>
  )
}
