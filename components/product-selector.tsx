"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Minus, Plus, QrCode, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { STORE_PRODUCTS } from "@/lib/store-products"
import type { StoreProductId } from "@/lib/store-products"

export function ProductSelector() {
  const router = useRouter()
  const [quantities, setQuantities] = useState<Partial<Record<StoreProductId, number>>>({})

  const addToCart = (productId: StoreProductId) => {
    setQuantities((current) => ({ ...current, [productId]: (current[productId] ?? 0) + 1 }))
  }

  const removeFromCart = (productId: StoreProductId) => {
    setQuantities((current) => {
      const next = { ...current }
      const quantity = next[productId] ?? 0
      if (quantity <= 1) {
        delete next[productId]
      } else {
        next[productId] = quantity - 1
      }
      return next
    })
  }

  const selectedProducts = STORE_PRODUCTS.filter((product) => (quantities[product.id] ?? 0) > 0)
  const cartTotal = selectedProducts.reduce(
    (total, product) => total + product.price * (quantities[product.id] ?? 0),
    0,
  )

  const handleCheckout = () => {
    const checkoutItems = selectedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantities[product.id] ?? 0,
      description: product.description,
    }))

    localStorage.setItem("checkoutItems", JSON.stringify(checkoutItems))
    router.push("/checkout/simple")
  }

  return (
    <div id="product-selector" className="max-w-6xl mx-auto">
      <Card className="bg-zinc-900/95 backdrop-blur-md border-zinc-800 shadow-2xl">
        <CardContent className="p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-3">Choose a Memorial Keepsake</h2>
          <p className="text-gray-300 text-center max-w-3xl mx-auto mb-8">
            All six products use a unique QR print file and include a link to the online memorial profile.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STORE_PRODUCTS.map((product) => {
              const quantity = quantities[product.id] ?? 0

              return (
                <Card key={product.id} className="bg-zinc-800 border-zinc-700 group hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex h-full flex-col">
                    <div className="aspect-[3/2] mb-4 rounded-lg bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-blue-200" aria-hidden="true" />
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-300 mb-1">
                      {product.provider}
                    </p>
                    <h3 className="font-semibold text-base mb-2 text-white">{product.name}</h3>
                    <p className="text-xs text-gray-400 mb-3 flex-1">{product.description}</p>

                    <div className="mb-4">
                      <span className="text-xl font-bold text-blue-400">${product.price.toFixed(2)} CAD</span>
                    </div>

                    {quantity > 0 ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromCart(product.id)}
                          className="flex-1 bg-zinc-900 border-zinc-600"
                          aria-label={`Remove one ${product.name}`}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold text-white">{quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addToCart(product.id)}
                          className="flex-1 bg-zinc-900 border-zinc-600"
                          aria-label={`Add another ${product.name}`}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={() => addToCart(product.id)} className="w-full" variant="default">
                        Add to Cart
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {selectedProducts.length > 0 && (
            <div className="mt-8 pt-6 border-t border-zinc-800">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">Products Total</p>
                  <p className="text-3xl font-bold text-white">${cartTotal.toFixed(2)} CAD</p>
                  <p className="text-xs text-gray-400 mt-1">+ $4.99/month per memorial for hosting</p>
                </div>

                <Button size="lg" onClick={handleCheckout} className="gap-2 px-8 py-6 text-lg">
                  <ShoppingCart className="w-5 h-5" />
                  Checkout
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
