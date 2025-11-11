"use client"
import Image from "next/image"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Plus, Check } from "lucide-react"

const ADDON_PLAQUES = [
  {
    id: "wooden_qr",
    name: "Wooden QR Keychain",
    description: "Natural wood finish with laser-engraved QR code",
    price: 29.97,
    image: "/wooden-keychain.png",
  },
  {
    id: "picture_plaque",
    name: "Picture Plaque",
    description: "Custom photo plaque with memorial details",
    price: 39.98,
    image: "/aluminum-card.jpg",
  },
  {
    id: "stone_qr",
    name: "Stone Memorial",
    description: "Durable stone memorial with engraved QR code",
    price: 56.99,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e4de3d0a-3087-4815-924d-3bcb93c7a20d.jpg",
  },
]

const PACKAGES = {
  basic: { id: "basic", name: "Basic Package", price: 89.89 },
  standard: { id: "standard", name: "Standard Package", price: 129.89 },
  premium: { id: "premium", name: "Premium Package", price: 199.89 },
}

export default function AddOnsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageId = searchParams.get("package") || "standard"
  const selectedPackage = PACKAGES[packageId as keyof typeof PACKAGES] || PACKAGES.standard

  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])

  const toggleAddOn = (addonId: string) => {
    setSelectedAddOns((prev) => (prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]))
  }

  const calculateTotal = () => {
    const addOnsTotal = selectedAddOns.reduce((sum, addonId) => {
      const addon = ADDON_PLAQUES.find((p) => p.id === addonId)
      return sum + (addon?.price || 0)
    }, 0)
    return selectedPackage.price + addOnsTotal
  }

  const handleContinue = () => {
    // Store selected add-ons in session storage
    sessionStorage.setItem("selectedAddOns", JSON.stringify(selectedAddOns))
    router.push(`/checkout?package=${packageId}`)
  }

  const handleSkip = () => {
    // Clear any previously selected add-ons
    sessionStorage.removeItem("selectedAddOns")
    router.push(`/checkout?package=${packageId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <Header />

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost" onClick={() => router.push("/pricing")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Pricing
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Enhance Your Memorial with Additional Plaques
            </h1>
            <p className="text-lg text-muted-foreground">
              Select optional add-ons to create a complete memorial experience
            </p>
          </div>

          {/* Package Summary */}
          <Card className="mb-8 border-2 border-accent/30">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Selected Package</p>
                  <p className="text-xl font-bold">{selectedPackage.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Package Price</p>
                  <p className="text-2xl font-bold text-accent">${selectedPackage.price.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add-ons Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {ADDON_PLAQUES.map((addon) => {
              const isSelected = selectedAddOns.includes(addon.id)
              return (
                <Card
                  key={addon.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isSelected ? "ring-2 ring-accent border-accent" : "border-border"
                  }`}
                  onClick={() => toggleAddOn(addon.id)}
                >
                  <CardHeader className="relative">
                    {isSelected && (
                      <div className="absolute top-4 right-4 bg-accent text-white rounded-full p-1.5 z-10">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                    <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={addon.image || "/placeholder.svg"}
                        alt={addon.name}
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h3 className="text-lg font-bold mb-2">{addon.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{addon.description}</p>
                      <p className="text-2xl font-bold text-accent">${addon.price.toFixed(2)}</p>
                    </div>
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleAddOn(addon.id)
                      }}
                    >
                      {isSelected ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Added
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Add to Order
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Total and Action Buttons */}
          <Card className="border-2 border-accent/30">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order Total</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-accent">${calculateTotal().toFixed(2)}</p>
                    {selectedAddOns.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        (Package: ${selectedPackage.price.toFixed(2)} + Add-ons: $
                        {(calculateTotal() - selectedPackage.price).toFixed(2)})
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleSkip} size="lg">
                    Skip Add-ons
                  </Button>
                  <Button onClick={handleContinue} size="lg" className="gap-2">
                    Continue
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
