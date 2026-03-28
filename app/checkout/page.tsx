"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"

const PRODUCTS = {
  memorial: {
    id: "online_memorial",
    name: "Online Memorial",
    oneTimePrice: 89.89,
  },
  plaques: {
    silver: {
      id: "silver_plaque",
      name: "Silver Memorial Plaque",
      description: "Premium silver finish with engraved QR code",
      image: "/plaque-silver.jpg",
    },
    gold: {
      id: "gold_plaque",
      name: "Gold Memorial Plaque",
      description: "Elegant gold finish with engraved QR code",
      image: "/plaque-gold.jpg",
    },
    black: {
      id: "black_plaque",
      name: "Black Memorial Plaque",
      description: "Classic black finish with engraved QR code",
      image: "/plaque-black.jpg",
    },
  },
  addons: {
    wooden_qr: {
      id: "wooden_qr",
      name: "Wooden QR Keychain",
      description: "Natural wood finish with laser-engraved QR code",
      price: 29.97, // Restored from $19.89 to normal price
      image: "/images/2e4fdbea-5150-40fa-bb82.jpeg",
    },
    picture_plaque: {
      id: "picture_plaque",
      name: "Picture Plaque",
      description: "Custom photo plaque with memorial details",
      price: 39.98, // Restored from $29.89 to normal price
      image: "/aluminum-card.jpg",
    },
    stone_qr: {
      id: "stone_qr",
      name: "Stone Memorial",
      description: "Durable stone memorial with engraved QR code",
      price: 56.99, // Restored from $39.98 to normal price
      image: "/images/e4de3d0a-3087-4815-924d.jpg",
    },
  },
}

const PACKAGES = {
  basic: {
    id: "basic",
    name: "Basic Package",
    price: 89.89,
    videos: 3,
    audio: 10,
    photos: 30,
  },
  standard: {
    id: "standard",
    name: "Standard Package",
    price: 129.89,
    videos: 5,
    audio: 15,
    photos: 50,
  },
  premium: {
    id: "premium",
    name: "Premium Package",
    price: 199.89,
    videos: 10,
    audio: 30,
    photos: 100,
  },
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageId = searchParams.get("package") || "standard"
  const selectedPackage = PACKAGES[packageId as keyof typeof PACKAGES] || PACKAGES.standard

  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    plaqueType: "black" as "silver" | "gold" | "black",
    boxPersonalization: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const savedAddOns = sessionStorage.getItem("selectedAddOns")
    if (savedAddOns) {
      setSelectedAddOns(JSON.parse(savedAddOns))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleNext = () => {
    sessionStorage.setItem("checkoutStep1", JSON.stringify(formData))
    router.push(`/checkout/details?package=${packageId}`)
  }

  const calculateAddOnsTotal = () => {
    return selectedAddOns.reduce((sum, addonId) => {
      const addon = Object.values(PRODUCTS.addons).find((a) => a.id === addonId)
      return sum + (addon?.price || 0)
    }, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <Header />

      {/* Package Summary */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-accent/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">{selectedPackage.name}</CardTitle>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-3xl font-bold text-gray-900">${selectedPackage.price}</p>
                  <p className="text-sm text-gray-600">One-time payment</p>
                  {selectedAddOns.length > 0 && (
                    <p className="text-sm text-accent font-semibold mt-1">
                      + ${calculateAddOnsTotal().toFixed(2)} in add-ons
                    </p>
                  )}
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>{selectedPackage.videos} videos</p>
                  <p>{selectedPackage.audio} voicemails/audio</p>
                  <p>{selectedPackage.photos} photos</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>

      {selectedAddOns.length > 0 && (
        <section className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Add-ons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedAddOns.map((addonId) => {
                    const addon = Object.values(PRODUCTS.addons).find((a) => a.id === addonId)
                    if (!addon) return null
                    return (
                      <div key={addonId} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{addon.name}</span>
                        <span className="text-sm text-gray-900 font-bold">${addon.price.toFixed(2)}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Add-ons Selection Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Add Optional Extras</CardTitle>
              <p className="text-sm text-muted-foreground">Enhance your memorial with additional products</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {Object.entries(PRODUCTS.addons).map(([key, addon]) => {
                  const isSelected = selectedAddOns.includes(addon.id)
                  return (
                    <div
                      key={key}
                      className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                        isSelected ? "border-accent ring-2 ring-accent" : "border-border hover:border-accent/50"
                      }`}
                      onClick={() => {
                        setSelectedAddOns((prev) =>
                          prev.includes(addon.id) ? prev.filter((id) => id !== addon.id) : [...prev, addon.id],
                        )
                      }}
                    >
                      <div className="relative h-40 w-full">
                        <Image
                          src={addon.image || "/placeholder.svg"}
                          alt={addon.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="p-4 bg-background">
                        <h3 className="font-semibold mb-1">{addon.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{addon.description}</p>
                        <p className="text-lg font-bold text-gray-900">${addon.price.toFixed(2)}</p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-accent text-accent-foreground rounded-full p-2">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Luxury Box Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden border-2 border-accent/30 shadow-xl">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-full min-h-[300px]">
                  <Image
                    src="/images/design-mode/box1(1).jpg"
                    alt="Luxury Memorial Presentation Box"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-6">
                    <p className="text-white text-lg font-semibold drop-shadow-lg">
                      Receive your own special, custom design
                    </p>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-background to-accent/5">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="h-8 w-8 text-accent" />
                    <h2 className="text-2xl font-bold text-foreground">Luxury Presentation Box</h2>
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">
                    Every order arrives in an elegant presentation box, adding a priceless touch to your memorial.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                      <span className="font-medium">Premium quality packaging</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                      <span className="font-medium">Personalization available</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                      <span className="font-medium">Included with every order at no extra cost</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t space-y-2">
                    <Label htmlFor="boxPersonalization" className="text-sm font-semibold">
                      Personalize Your Box
                    </Label>
                    <Textarea
                      id="boxPersonalization"
                      name="boxPersonalization"
                      placeholder="In Memory of John Doe..."
                      value={formData.boxPersonalization}
                      onChange={(e) => setFormData({ ...formData, boxPersonalization: e.target.value })}
                      maxLength={150}
                      rows={3}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">{formData.boxPersonalization.length}/150 characters</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Selection Section */}
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {/* Plaque Color Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Plaque Color</CardTitle>
                <p className="text-sm text-muted-foreground">Included with your memorial package</p>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.plaqueType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, plaqueType: value as "silver" | "gold" | "black" })
                  }
                  className="grid md:grid-cols-3 gap-6"
                >
                  {Object.entries(PRODUCTS.plaques).map(([key, plaque]) => (
                    <div
                      key={key}
                      className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                        formData.plaqueType === key
                          ? "border-accent ring-2 ring-accent"
                          : "border-border hover:border-accent/50"
                      }`}
                      onClick={() => setFormData({ ...formData, plaqueType: key as "silver" | "gold" | "black" })}
                    >
                      <div className="relative h-32 w-full">
                        <Image
                          src={plaque.image || "/placeholder.svg"}
                          alt={plaque.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="p-4 bg-background">
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value={key} id={key} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={key} className="font-semibold cursor-pointer block mb-1">
                              {plaque.name}
                            </Label>
                            <p className="text-xs text-muted-foreground">{plaque.description}</p>
                          </div>
                        </div>
                      </div>
                      {formData.plaqueType === key && (
                        <div className="absolute top-2 right-2 bg-accent text-accent-foreground rounded-full p-2">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Next Button */}
            <div className="flex justify-end pt-6">
              <Button onClick={handleNext} size="lg" className="gap-2">
                Next
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
