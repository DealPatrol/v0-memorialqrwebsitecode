"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Tag, Shield, Truck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCartStore } from "@/lib/cart-store"

const PROMO_CODES = {
  SAVE10: { discount: 10, description: "10% off your order" },
  MEMORIAL15: { discount: 15, description: "15% off memorial products" },
  FIRST20: { discount: 20, description: "20% off first order" },
  WELCOME25: { discount: 25, description: "25% off welcome discount" },
  FAMILY30: { discount: 30, description: "30% off family memorial" },
}

export default function CartPage() {
  const { toast } = useToast()
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; description: string } | null>(null)

  const handleUpdateQuantity = (id: string, size: string, color: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(id, size, color, newQuantity)
  }

  const handleRemoveItem = (id: string, size: string, color: string, name: string) => {
    removeItem(id, size, color)
    toast({
      title: "Item Removed",
      description: `${name} has been removed from your cart.`,
    })
  }

  const applyPromoCode = () => {
    const upperCode = promoCode.toUpperCase()
    const promoData = PROMO_CODES[upperCode as keyof typeof PROMO_CODES]

    if (promoData) {
      setAppliedPromo({
        code: upperCode,
        discount: promoData.discount,
        description: promoData.description,
      })
      toast({
        title: "Promo Code Applied! 🎉",
        description: `${promoData.description} - You saved ${promoData.discount}%!`,
      })
      setPromoCode("")
    } else {
      toast({
        title: "Invalid Promo Code",
        description: "Please check your promo code and try again. Try SAVE10, MEMORIAL15, or FIRST20.",
        variant: "destructive",
      })
    }
  }

  const removePromoCode = () => {
    setAppliedPromo(null)
    toast({
      title: "Promo Code Removed",
      description: "Promo code has been removed from your order.",
    })
  }

  const subtotal = getTotalPrice()
  const savings = items.reduce((sum, item) => {
    const itemSavings = item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0
    return sum + itemSavings
  }, 0)
  const promoDiscount = appliedPromo ? (subtotal * appliedPromo.discount) / 100 : 0
  const shipping = subtotal > 100 ? 0 : 15
  const tax = (subtotal - promoDiscount) * 0.08 // 8% tax
  const total = subtotal - promoDiscount + shipping + tax

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-100">
        <Header />

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <ShoppingCart className="w-24 h-24 text-slate-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Your Cart is Empty</h1>
              <p className="text-slate-600 mb-8">Ready to create a beautiful memorial for your loved one?</p>
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Link href="/products">View Memorial Plaque</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-100">
      <Header />

      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-slate-100 to-purple-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Shopping Cart</h1>
            <p className="text-slate-600">Review your memorial plaque order before checkout</p>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Cart Items ({items.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 p-4 border rounded-lg">
                        <div className="w-24 h-24 relative overflow-hidden rounded-lg bg-white">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{item.name}</h3>

                          <div className="text-sm text-slate-600 space-y-1 mb-3">
                            <div>Size: {item.size}</div>
                            <div>Color: {item.color}</div>
                            {item.digitalMemorialIncluded && (
                              <div className="flex items-center gap-1 text-green-600">
                                <Shield className="w-4 h-4" />
                                Digital Memorial Included
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-purple-600">${item.price}</span>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <span className="text-sm text-slate-500 line-through">${item.originalPrice}</span>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateQuantity(item.id, item.size, item.color, item.quantity - 1)
                                  }
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateQuantity(item.id, item.size, item.color, item.quantity + 1)
                                  }
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id, item.size, item.color, item.name)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Promo Code */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="w-5 h-5" />
                      Promo Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!appliedPromo ? (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter promo code (try SAVE10, MEMORIAL15, FIRST20)"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="flex-1"
                            onKeyPress={(e) => e.key === "Enter" && applyPromoCode()}
                          />
                          <Button onClick={applyPromoCode} variant="outline">
                            Apply
                          </Button>
                        </div>
                        <div className="text-sm text-slate-600">
                          <p className="font-medium mb-1">Available codes:</p>
                          <ul className="space-y-1">
                            <li>
                              • <code className="bg-slate-100 px-1 rounded">SAVE10</code> - 10% off your order
                            </li>
                            <li>
                              • <code className="bg-slate-100 px-1 rounded">MEMORIAL15</code> - 15% off memorial
                              products
                            </li>
                            <li>
                              • <code className="bg-slate-100 px-1 rounded">FIRST20</code> - 20% off first order
                            </li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-green-700 font-semibold">{appliedPromo.code} Applied! 🎉</span>
                            <p className="text-sm text-green-600">{appliedPromo.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-700 font-bold">-{appliedPromo.discount}%</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={removePromoCode}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>

                      {savings > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Product Savings:</span>
                          <span>-${savings.toFixed(2)}</span>
                        </div>
                      )}

                      {appliedPromo && (
                        <div className="flex justify-between text-green-600">
                          <span>Promo ({appliedPromo.code}):</span>
                          <span>-${promoDiscount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span className={shipping === 0 ? "text-green-600" : ""}>
                          {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>

                      <Separator />

                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>

                      {(savings > 0 || appliedPromo) && (
                        <div className="text-center text-green-600 font-medium">
                          You saved ${(savings + promoDiscount).toFixed(2)}! 🎉
                        </div>
                      )}
                    </div>

                    <Button asChild size="lg" className="w-full bg-purple-600 hover:bg-purple-700">
                      <Link href="/checkout">
                        Proceed to Checkout
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>

                    <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
                      <Link href="/products">Continue Shopping</Link>
                    </Button>

                    {/* Trust Indicators */}
                    <div className="pt-4 border-t space-y-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span>Secure SSL Encryption</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Truck className="w-4 h-4 text-green-600" />
                        <span>Free shipping on orders over $100</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span>5-year quality guarantee</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Memorial QR</h3>
              <p className="text-slate-400 text-sm">Honoring memories with digital memorials that last forever.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/products" className="hover:text-white">
                    Memorial Plaque
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/browse-memorials" className="hover:text-white">
                    Sample Memorials
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-white">
                    Shipping Info
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/privacy-policy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-white">
                    Returns
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 Memorial QR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
