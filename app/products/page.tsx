"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, Plus } from "lucide-react"

export default function ProductsPage() {
  const router = useRouter()
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])

  // Main product - $89
  const mainProduct = {
    name: "Memorial Plaque Package",
    price: 89,
    includes: [
      "Choice of Gold, Black, or Silver plaque",
      "Personalized memorial page with QR code",
      "Custom presentation box",
      "Up to 50 photos",
      "Up to 2 videos",
      "Up to 10 voicemails/audio files",
    ],
  }

  // Add-on plaques
  const addOns = [
    { id: "gold", name: "Additional Gold Plaque", price: 29 },
    { id: "black", name: "Additional Black Plaque", price: 29 },
    { id: "silver", name: "Additional Silver Plaque", price: 29 },
  ]

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const calculateTotal = () => {
    const addOnsTotal = selectedAddOns.length * 29
    return mainProduct.price + addOnsTotal
  }

  const handleCheckout = () => {
    const total = calculateTotal()
    // Navigate to checkout with selected items
    router.push(`/checkout/details?total=${total}&addons=${selectedAddOns.join(",")}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Memorial Plaque Package</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Honor your loved one with a beautiful memorial plaque and digital page that preserves their memory forever
          </p>
        </div>

        {/* Main Product Card */}
        <Card className="mb-8 border-2 border-purple-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <CardTitle className="text-3xl">Complete Memorial Package</CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Everything you need to create a lasting tribute
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              {/* Features List */}
              <div className="flex-1 space-y-4">
                {mainProduct.includes.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 text-lg">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="flex flex-col items-center justify-center bg-purple-50 rounded-xl p-6 min-w-[200px]">
                <div className="text-5xl font-bold text-purple-600">${mainProduct.price}</div>
                <div className="text-gray-600 mt-2">One-time payment</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add-ons Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-6 h-6 text-purple-600" />
            Additional Plaques
          </h2>
          <p className="text-gray-600 mb-6">
            Want to share the memorial with multiple family members? Add additional plaques at a special price.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {addOns.map((addon) => (
              <Card
                key={addon.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedAddOns.includes(addon.id)
                    ? "border-2 border-purple-500 shadow-lg"
                    : "border border-gray-200 hover:border-purple-300"
                }`}
                onClick={() => toggleAddOn(addon.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{addon.name}</h3>
                      <p className="text-2xl font-bold text-purple-600">+${addon.price}</p>
                    </div>
                    <Checkbox
                      checked={selectedAddOns.includes(addon.id)}
                      onCheckedChange={() => toggleAddOn(addon.id)}
                      className="mt-1"
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {addon.name === "Additional Gold Plaque"
                      ? "Elegant gold finish"
                      : addon.name === "Additional Black Plaque"
                        ? "Classic black finish"
                        : "Timeless silver finish"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Total and Checkout */}
        <Card className="border-2 border-gray-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <div className="text-gray-600 text-sm mb-1">Total Amount</div>
                <div className="text-4xl font-bold text-gray-900">${calculateTotal()}</div>
                {selectedAddOns.length > 0 && (
                  <div className="text-sm text-gray-600 mt-1">
                    Includes {selectedAddOns.length} additional plaque{selectedAddOns.length > 1 ? "s" : ""}
                  </div>
                )}
              </div>
              <Button
                onClick={handleCheckout}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-6 text-xl font-semibold rounded-xl shadow-lg"
              >
                Continue to Checkout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features Highlight */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            Free shipping included • Lifetime access to memorial page • 24/7 customer support
          </p>
        </div>
      </div>
    </div>
  )
}
