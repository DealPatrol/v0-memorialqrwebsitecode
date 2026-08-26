"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { PRODUCTS, formatPrice, type Product } from "@/lib/products"
import { ShoppingCart, Check, Package, Smartphone, Heart, Plus, Minus, X, CreditCard, PawPrint } from "lucide-react"

interface CartItem {
  product: Product
  quantity: number
}

export function StoreClient() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { product, quantity: 1 }]
    })
    setIsCartOpen(true)
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.product.priceInCents * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const grandTotal = cartTotal

  const handleCheckout = async () => {
    if (cart.length === 0) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      })

      const { url, error } = await response.json()
      if (error) throw new Error(error)

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      alert("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const plaques = PRODUCTS.filter((p) => p.category === "plaque")
  const accessories = PRODUCTS.filter((p) => p.category === "accessory")
  const petProducts = PRODUCTS.filter((p) => p.category === "pet")

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Memorial QR Store</h1>
            <p className="text-lg md:text-xl text-slate-300 mb-6">
              Choose a memorial product. Once it arrives, scan the QR code to create their digital memorial.
            </p>

            {/* How it works - simple */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mt-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold">
                  1
                </div>
                <span>Buy a plaque</span>
              </div>
              <div className="hidden md:block text-slate-500">→</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold">
                  2
                </div>
                <span>Receive it</span>
              </div>
              <div className="hidden md:block text-slate-500">→</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold">
                  3
                </div>
                <span>Scan to create memorial</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Cart Button (Mobile) */}
      {cartCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-4 right-4 z-40 md:hidden bg-slate-900 text-white p-4 rounded-full shadow-lg"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        </button>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Your Cart ({cartCount})</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="p-4 space-y-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.product.image || "/placeholder.svg?height=80&width=80"}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                        <p className="text-slate-600">${formatPrice(item.product.priceInCents)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="w-8 h-8 rounded border flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="w-8 h-8 rounded border flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button onClick={() => removeFromCart(item.product.id)} className="ml-auto text-red-500 p-1">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sticky bottom-0 bg-white border-t p-4 space-y-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${formatPrice(grandTotal)}</span>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full h-12 text-lg bg-slate-900 hover:bg-slate-800"
                  >
                    {isLoading ? (
                      "Processing..."
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Checkout
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-slate-500 text-center">Free shipping on all orders</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Memorial Plaques Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Memorial Plaques</h2>
              <p className="text-slate-600 mt-1">Permanent plaques with scannable QR codes</p>
            </div>
            {cartCount > 0 && (
              <Button
                variant="outline"
                onClick={() => setIsCartOpen(true)}
                className="hidden md:flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Cart ({cartCount})
              </Button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {plaques.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Accessories Section */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Accessories</h2>
            <p className="text-slate-600 mt-1">Additional memorial items</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {accessories.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <PawPrint className="w-5 h-5 text-amber-600" />
                <Badge className="bg-amber-600">Pet Memorials</Badge>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Honor Your Beloved Pet</h2>
              <p className="text-slate-600 mt-1">Create a lasting tribute to your furry family member</p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex bg-transparent">
              <Link href="/pet-memorials">View All Pet Products</Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {petProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} isPet />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild>
              <Link href="/pet-memorials">View All Pet Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">How It Works</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="font-bold mb-2">1. Order Your Plaque</h3>
                <p className="text-slate-600 text-sm">Choose from our selection of beautiful memorial plaques.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="font-bold mb-2">2. Scan When Received</h3>
                <p className="text-slate-600 text-sm">
                  Scan the QR code on your plaque to set up the digital memorial.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="font-bold mb-2">3. Share Memories</h3>
                <p className="text-slate-600 text-sm">
                  Add photos, stories, and videos. Share with family and friends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">&copy; 2025 Memorial QR. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function ProductCard({
  product,
  onAddToCart,
  isPet = false,
}: {
  product: Product
  onAddToCart: (product: Product) => void
  isPet?: boolean
}) {
  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="relative w-full h-full">
          <Image
            src={product.image || "/placeholder.svg?height=400&width=400"}
            alt={product.name}
            fill
            className="object-contain drop-shadow-lg"
          />
        </div>
        {isPet ? (
          <Badge className="absolute top-3 left-3 bg-amber-600 shadow-md">
            <PawPrint className="w-3 h-3 mr-1" />
            Pet
          </Badge>
        ) : product.category === "plaque" ? (
          <Badge className="absolute top-3 left-3 bg-slate-900 shadow-md">Premium Plaque</Badge>
        ) : null}
      </div>
      <CardContent className="p-6">
        <h3 className="font-bold text-xl mb-2 text-balance">{product.name}</h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>

        <ul className="space-y-2 mb-5">
          {product.features.slice(0, 3).map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <div className="text-xs text-slate-500 mb-1">Starting at</div>
            <span className="text-3xl font-bold text-slate-900">${formatPrice(product.priceInCents)}</span>
          </div>
          <Button
            onClick={() => onAddToCart(product)}
            size="lg"
            className={
              isPet
                ? "bg-amber-600 hover:bg-amber-700 shadow-md hover:shadow-lg transition-all"
                : "bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-lg transition-all"
            }
          >
            <Plus className="w-4 h-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
