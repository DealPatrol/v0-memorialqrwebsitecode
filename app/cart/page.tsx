"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, ShoppingCart, Plus, Minus, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Define cart item type
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  plan: string
}

// Available products
const availableProducts = [
  {
    id: "premium-qr",
    name: "Premium Memorial QR",
    price: 49.99,
    image: "/images/qr-code-gravestone.png",
    plan: "premium",
    description: "Perfect for a simple memorial tribute.",
  },
  {
    id: "deluxe-qr",
    name: "Deluxe Memorial QR",
    price: 79.99,
    image: "/images/qr-code-gravestone.png",
    plan: "deluxe",
    description: "Our most popular comprehensive memorial package.",
  },
  {
    id: "legacy-qr",
    name: "Legacy Memorial QR",
    price: 99.99,
    image: "/images/qr-code-gravestone.png",
    plan: "legacy",
    description: "The ultimate memorial experience for your loved one.",
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("memorialQrCart")
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Error parsing cart data:", e)
      }
    }
    setIsLoading(false)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("memorialQrCart", JSON.stringify(cartItems))
    }
  }, [cartItems, isLoading])

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = cartItems.length > 0 ? 4.99 : 0
  const total = subtotal + shipping

  // Add item to cart
  const addToCart = (product: (typeof availableProducts)[0]) => {
    setCartItems((prev) => {
      // Check if item already exists in cart
      const existingItemIndex = prev.findIndex((item) => item.id === product.id)

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prev]
        updatedItems[existingItemIndex].quantity += 1
        return updatedItems
      } else {
        // Add new item if it doesn't exist
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            plan: product.plan,
          },
        ]
      }
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  // Update item quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  // Remove item from cart
  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))

    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    })
  }

  // Clear entire cart
  const clearCart = () => {
    setCartItems([])

    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif flex items-center">
            Memorial QR
            <span className="text-yellow-400 ml-1">★</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Cart Items */}
          <div className="md:w-2/3">
            <Card>
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Your Cart
                  </CardTitle>
                  {cartItems.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearCart}>
                      Clear Cart
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-6">Browse our products and add items to your cart.</p>

                    <div className="grid md:grid-cols-3 gap-6 mt-8">
                      {availableProducts.map((product) => (
                        <Card key={product.id} className="overflow-hidden">
                          <div className="relative h-48 bg-gray-100">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-contain p-4"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                            <div className="font-bold">${product.price.toFixed(2)}</div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <Button className="w-full" onClick={() => addToCart(product)}>
                              Add to Cart
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center border-b pb-6 last:border-0 last:pb-0">
                        <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="ml-4 flex-grow">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">
                            Plan: {item.plan.charAt(0).toUpperCase() + item.plan.slice(1)}
                          </p>
                          <div className="text-gray-900 font-bold mt-1">${item.price.toFixed(2)}</div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center border rounded-md mr-4">
                            <button
                              className="p-2"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4">{item.quantity}</span>
                            <button className="p-2" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button className="text-red-500 hover:text-red-700" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="md:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Memorial QR. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/privacy" className="hover:text-gray-700">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-700">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-gray-700">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
