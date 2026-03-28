"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

const standardPlaques = [
  { id: "gold-plaque", name: "Gold", price: 29.99, description: "Gold Memorial Plaque" },
  { id: "silver-plaque", name: "Silver", price: 29.99, description: "Silver Memorial Plaque" },
  { id: "black-plaque", name: "Black", price: 29.99, description: "Black Memorial Plaque" },
]

const otherOptions = [
  {
    id: "wooden-keychain",
    name: "Wooden QR Keychain/Necklace",
    price: 14.99,
    image: "/images/17c80bbb-d33f-4068-8656.jpeg",
    description: "Portable memorial with laser-engraved QR code",
  },
  {
    id: "slate-coaster",
    name: "Memorial Slate Coaster",
    price: 46.99,
    image: "/images/f8c3da8d-d112-4a57-b614.jpeg",
    description: "Natural slate coaster with engraved QR code",
  },
  {
    id: "photo-frame",
    name: "QR Memorial Photo Frame",
    price: 49.99,
    image: "/images/0d120a50-1c8d-4a75-a564.jpeg",
    description: "Display their photo with integrated QR code",
  },
]

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  type: "plaque" | "addon"
}

export function ProductSelector() {
  const router = useRouter()
  const [selectedPlaque, setSelectedPlaque] = useState<string>("")
  const [plaqueQuantity, setPlaqueQuantity] = useState<number>(1)
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (productId: string) => {
    const product = otherOptions.find((p) => p.id === productId)
    if (!product) return

    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId)
      if (existing) {
        return prev.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1, type: "addon" }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId)
      if (existing && existing.quantity > 1) {
        return prev.map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
      }
      return prev.filter((item) => item.id !== productId)
    })
  }

  const getCartTotal = () => {
    const plaqueTotal = selectedPlaque ? 29.99 * plaqueQuantity : 0
    const addonTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    return plaqueTotal + addonTotal
  }

  const handleCheckout = () => {
    const checkoutItems = []

    if (selectedPlaque) {
      const plaque = standardPlaques.find((p) => p.id === selectedPlaque)
      if (plaque) {
        checkoutItems.push({
          id: plaque.id,
          name: plaque.name,
          price: plaque.price,
          quantity: plaqueQuantity,
          description: plaque.description,
        })
      }
    }

    cart.forEach((item) => {
      const product = otherOptions.find((p) => p.id === item.id)
      if (product) {
        checkoutItems.push({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          description: product.description,
        })
      }
    })

    localStorage.setItem("checkoutItems", JSON.stringify(checkoutItems))
    router.push("/checkout/simple")
  }

  const getCartItemQuantity = (productId: string) => {
    return cart.find((item) => item.id === productId)?.quantity || 0
  }

  return (
    <div id="product-selector" className="max-w-6xl mx-auto">
      <Card className="bg-zinc-900/95 backdrop-blur-md border-zinc-800 shadow-2xl">
        <CardContent className="p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Standard Memorial Plaques</h2>

          <div className="flex flex-col lg:flex-row items-center gap-8 mb-12">
            <div className="flex-1 w-full lg:max-w-md">
              <Image
                src="/images/4cb32232-4993-48cf-bb96.jpeg"
                alt="Memorial Plaques - Gold, Silver, Black"
                width={600}
                height={800}
                className="w-full h-auto object-contain rounded-lg"
                priority
              />
            </div>

            <div className="flex-1 w-full space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Select Plaque Color</label>
                <Select value={selectedPlaque} onValueChange={setSelectedPlaque}>
                  <SelectTrigger className="w-full text-lg h-14 bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Choose your plaque" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="black-plaque" className="text-lg py-3 text-white">
                      Black $29.99
                    </SelectItem>
                    <SelectItem value="gold-plaque" className="text-lg py-3 text-white">
                      Gold $29.99
                    </SelectItem>
                    <SelectItem value="silver-plaque" className="text-lg py-3 text-white">
                      Silver $29.99
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedPlaque && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">How many plaques?</label>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setPlaqueQuantity(Math.max(1, plaqueQuantity - 1))}
                      className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                    >
                      <Minus className="w-5 h-5" />
                    </Button>

                    <span className="text-4xl font-bold w-24 text-center text-white">{plaqueQuantity}</span>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setPlaqueQuantity(plaqueQuantity + 1)}
                      className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="mt-4 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
                    <p className="text-2xl font-bold text-blue-400">${(29.99 * plaqueQuantity).toFixed(2)}</p>
                    <p className="text-sm text-gray-300 mt-1">+ $4.99/month per memorial</p>
                  </div>
                </div>
              )}

              {selectedPlaque && (
                <Button
                  size="lg"
                  onClick={handleCheckout}
                  className="w-full gap-2 py-6 text-lg bg-blue-600 hover:bg-blue-700"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Checkout Plaques
                </Button>
              )}
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-8 mt-8">
            <h3 className="text-2xl font-bold text-white text-center mb-6">Additional Products</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherOptions.map((product) => (
                <Card key={product.id} className="bg-zinc-800 border-zinc-700 group hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-zinc-900">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <h4 className="font-semibold text-base mb-2 text-white">{product.name}</h4>
                    <p className="text-xs text-gray-400 mb-3">{product.description}</p>

                    <div className="mb-4">
                      <span className="text-xl font-bold text-blue-400">${product.price.toFixed(2)}</span>
                    </div>

                    {getCartItemQuantity(product.id) > 0 ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromCart(product.id)}
                          className="flex-1 bg-zinc-900 border-zinc-600"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold text-white">
                          {getCartItemQuantity(product.id)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addToCart(product.id)}
                          className="flex-1 bg-zinc-900 border-zinc-600"
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
              ))}
            </div>
          </div>

          {cart.length > 0 && (
            <div className="mt-8 pt-6 border-t border-zinc-800">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">Additional Products Total</p>
                  <p className="text-3xl font-bold text-white">
                    ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                  </p>
                </div>

                <Button size="lg" onClick={handleCheckout} className="gap-2 px-8 py-6 text-lg">
                  <ShoppingCart className="w-5 h-5" />
                  Checkout All Items
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
