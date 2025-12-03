"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle, Package, ArrowRight, Plus } from 'lucide-react'
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

const PRODUCTS = {
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
      price: 29.97,
      image: "/images/7e603a13-5813-4af5-ae6b.jpeg",
    },
    picture_plaque: {
      id: "picture_plaque",
      name: "Picture Plaque",
      description: "Custom photo plaque with memorial details",
      price: 39.98,
      image: "/aluminum-card.jpg",
    },
    stone_qr: {
      id: "stone_qr",
      name: "Stone Memorial",
      description: "Durable stone memorial with engraved QR code",
      price: 56.99,
      image: "/images/e4de3d0a-3087-4815-924d.jpg",
    },
  },
}

export default function CustomizePage() {
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order")

  const [plaqueType, setPlaqueType] = useState<"silver" | "gold" | "black">("black")
  const [boxPersonalization, setBoxPersonalization] = useState("")
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    if (!orderNumber) {
      router.push("/")
      return
    }

    // Fetch order details
    fetch(`/api/orders/${orderNumber}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrder(data.order)
        }
      })
  }, [orderNumber, router])

  const toggleAddOn = (addonId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    )
  }

  const calculateAddOnsTotal = () => {
    return selectedAddOns.reduce((sum, addonId) => {
      const addon = Object.values(PRODUCTS.addons).find((a) => a.id === addonId)
      return sum + (addon?.price || 0)
    }, 0)
  }

  const handleContinue = async () => {
    setIsSubmitting(true)

    try {
      // Update order with customization choices
      const response = await fetch(`/api/orders/${orderNumber}/customize`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plaqueColor: plaqueType,
          boxPersonalization,
          addons: selectedAddOns,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to save customization")
      }

      toast({
        title: "Customization Saved!",
        description: "Redirecting you to create your memorial...",
      })

      // Store order info for memorial creation
      sessionStorage.setItem(
        "pendingOrder",
        JSON.stringify({
          orderNumber: orderNumber,
          orderId: order?.id,
          customerEmail: order?.customer_email,
          customerName: order?.customer_name,
          plaqueColor: plaqueType,
        })
      )

      router.push(`/create-memorial?order=${orderNumber}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save customization. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    // Set defaults and continue
    sessionStorage.setItem(
      "pendingOrder",
      JSON.stringify({
        orderNumber: orderNumber,
        orderId: order?.id,
        customerEmail: order?.customer_email,
        customerName: order?.customer_name,
        plaqueColor: "black",
      })
    )
    router.push(`/create-memorial?order=${orderNumber}`)
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your order...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <Header />

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Payment Successful!
            </h1>
            <p className="text-lg text-muted-foreground">
              Now let's customize your memorial plaque and add any extras
            </p>
          </div>

          {/* Plaque Color Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Choose Your Plaque Color</CardTitle>
              <p className="text-sm text-muted-foreground">Included with your memorial package</p>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={plaqueType}
                onValueChange={(value) => setPlaqueType(value as "silver" | "gold" | "black")}
                className="grid md:grid-cols-3 gap-6"
              >
                {Object.entries(PRODUCTS.plaques).map(([key, plaque]) => (
                  <div
                    key={key}
                    className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                      plaqueType === key
                        ? "border-accent ring-2 ring-accent"
                        : "border-border hover:border-accent/50"
                    }`}
                    onClick={() => setPlaqueType(key as "silver" | "gold" | "black")}
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
                    {plaqueType === key && (
                      <div className="absolute top-2 right-2 bg-accent text-accent-foreground rounded-full p-2">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Luxury Box Personalization */}
          <Card className="mb-8">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-full min-h-[300px]">
                  <Image
                    src="/images/design-mode/box1(1).jpg"
                    alt="Luxury Memorial Presentation Box"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="h-8 w-8 text-accent" />
                    <h2 className="text-2xl font-bold">Luxury Presentation Box</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Personalize your presentation box with a special message
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="boxPersonalization">Box Personalization (Optional)</Label>
                    <Textarea
                      id="boxPersonalization"
                      placeholder="In Memory of John Doe..."
                      value={boxPersonalization}
                      onChange={(e) => setBoxPersonalization(e.target.value)}
                      maxLength={150}
                      rows={3}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">{boxPersonalization.length}/150 characters</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add-ons Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add Optional Extras</CardTitle>
              <p className="text-sm text-muted-foreground">
                Additional products can be charged to your original payment method
              </p>
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
                      onClick={() => toggleAddOn(addon.id)}
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
                        <p className="text-lg font-bold">${addon.price.toFixed(2)}</p>
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

              {selectedAddOns.length > 0 && (
                <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Add-ons Total:</span>
                    <span className="text-2xl font-bold">${calculateAddOnsTotal().toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Add-ons will be charged separately after confirmation
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={handleSkip} size="lg" disabled={isSubmitting}>
              Skip Customization
            </Button>
            <Button onClick={handleContinue} size="lg" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? "Saving..." : "Continue to Memorial Creation"}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
