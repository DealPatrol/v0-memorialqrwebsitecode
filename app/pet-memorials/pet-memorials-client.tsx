"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { PRODUCTS, SUBSCRIPTION_PRICE_CENTS, formatPrice, type Product } from "@/lib/products"
import { Heart, PawPrint, Frame, ShoppingCart, Plus, Minus, X, CreditCard, Check } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CartItem {
  product: Product
  quantity: number
}

export function PetMemorialsClient() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const petProducts = PRODUCTS.filter((p) => p.category === "pet")

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
      const { sessionId, error } = await response.json()
      if (error) throw new Error(error)
      const stripe = await stripePromise
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full mb-6">
              <PawPrint className="w-4 h-4" />
              <span className="text-sm font-medium">Pet Memorials</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">Honor Your Beloved Pet</h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8">
              They gave us unconditional love. Create a lasting digital tribute to celebrate their life, share memories,
              and keep their spirit alive forever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700" asChild>
                <a href="#products">
                  <PawPrint className="w-5 h-5 mr-2" />
                  Shop Pet Memorials
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/store">View All Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pet Products */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <Badge className="bg-amber-100 text-amber-800 mb-4">Most Popular</Badge>
              <h2 className="text-3xl font-bold mb-4">Custom Pet Sketch Poster</h2>
              <p className="text-slate-600 mb-6">
                Send us your favorite photo of your pet, and our artists will transform it into a beautiful hand-drawn
                style sketch. A small QR code in the bottom right corner links to their full digital memorial with
                photos, stories, and memories.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Photo-to-sketch artistic conversion</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>QR code discretely placed in corner</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Premium matte paper (8x10, 11x14, 16x20)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Frame-ready or framed options</span>
                </li>
              </ul>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold">$59.99</span>
                <Button
                  className="bg-amber-600 hover:bg-amber-700"
                  onClick={() => {
                    const product = petProducts.find((p) => p.id === "pet-sketch-poster")
                    if (product) addToCart(product)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/golden-retriever-dog-portrait-sketch-artistic-draw.jpg"
                alt="Custom Pet Sketch Poster Example"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative aspect-square rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/pet-memorial-picture-frame-with-qr-code-cat-photo-.jpg"
                alt="Pet Memorial QR Frame Example"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <Badge className="bg-amber-100 text-amber-800 mb-4">Best Seller</Badge>
              <h2 className="text-3xl font-bold mb-4">Pet Memorial QR Frame</h2>
              <p className="text-slate-600 mb-6">
                A beautiful solid wood picture frame with a laser-engraved QR code built right into the frame. Display
                their favorite photo while anyone can scan to see their full memorial with videos, more photos, and
                heartfelt stories.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Holds 4x6 or 5x7 photos</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>QR code engraved in frame border</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Solid wood construction</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Tabletop easel or wall mount</span>
                </li>
              </ul>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold">$44.99</span>
                <Button
                  className="bg-amber-600 hover:bg-amber-700"
                  onClick={() => {
                    const product = petProducts.find((p) => p.id === "pet-qr-frame")
                    if (product) addToCart(product)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Pet Products Grid */}
      <section id="products" className="py-12 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">All Pet Memorial Products</h2>
              <p className="text-slate-600 mt-1">Find the perfect way to honor your pet</p>
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {petProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white"
              >
                <div className="relative aspect-[4/3] bg-gradient-to-br from-amber-50 to-orange-100 p-6">
                  <div className="relative w-full h-full">
                    <Image
                      src={product.image || "/placeholder.svg?height=400&width=400"}
                      alt={product.name}
                      fill
                      className="object-contain drop-shadow-lg"
                    />
                  </div>
                  <Badge className="absolute top-3 left-3 bg-amber-600 shadow-md">
                    <PawPrint className="w-3 h-3 mr-1" />
                    Pet
                  </Badge>
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
                      onClick={() => addToCart(product)}
                      size="lg"
                      className="bg-amber-600 hover:bg-amber-700 shadow-md hover:shadow-lg transition-all"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Pet Memorials */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Create a Pet Memorial?</h2>
            <p className="text-slate-600">
              Our pets are family. They deserve to be remembered and celebrated just like any loved one.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Preserve Their Memory</h3>
              <p className="text-slate-600">
                Store unlimited photos, videos, and stories. Share the silly moments, the cuddles, and all the love.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Frame className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Beautiful Display</h3>
              <p className="text-slate-600">
                Our products are designed to be displayed proudly. A constant reminder of the joy they brought.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PawPrint className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Share with Others</h3>
              <p className="text-slate-600">
                Let friends and family visit their memorial anytime. They can add their own memories too.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Info */}
      <section className="py-12 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-lg">
              Pet memorial website hosting is just{" "}
              <span className="font-bold">${formatPrice(SUBSCRIPTION_PRICE_CENTS)}/month</span>
            </p>
            <p className="text-slate-600 mt-2">Unlimited photos, videos, and stories. Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* Floating Cart Button (Mobile) */}
      {cartCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-4 right-4 z-40 md:hidden bg-amber-600 text-white p-4 rounded-full shadow-lg"
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
                          src={item.product.image || "/placeholder.svg"}
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

                <div className="mx-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Memorial website hosting is ${formatPrice(SUBSCRIPTION_PRICE_CENTS)}/month,
                    billed after you create your pet's memorial.
                  </p>
                </div>

                <div className="sticky bottom-0 bg-white border-t p-4 space-y-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total (one-time)</span>
                    <span>${formatPrice(cartTotal)}</span>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full h-12 text-lg bg-amber-600 hover:bg-amber-700"
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
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">&copy; 2025 Memorial QR. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
