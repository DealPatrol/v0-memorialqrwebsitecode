"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { SquarePaymentForm } from "@/components/square-payment-form"
import { CheckCircle, Package, Shield, Lock, CreditCard, Award, Clock, Users, Star, ChevronDown, ChevronUp } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

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
    popular: true,
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

const PLAQUES = {
  silver: {
    id: "silver",
    name: "Silver Memorial Plaque",
    description: "Premium silver finish with engraved QR code",
    image: "/plaque-silver.jpg",
  },
  gold: {
    id: "gold",
    name: "Gold Memorial Plaque",
    description: "Elegant gold finish with engraved QR code",
    image: "/plaque-gold.jpg",
  },
  black: {
    id: "black",
    name: "Black Memorial Plaque",
    description: "Classic black finish with engraved QR code",
    image: "/plaque-black.jpg",
  },
}

const ADDONS = {
  wooden_qr: {
    id: "wooden_qr",
    name: "Wooden QR Keychain",
    description: "Natural wood finish with laser-engraved QR code",
    price: 29.97,
    image: "/images/2e4fdbea-5150-40fa-bb82.jpeg",
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
}

export default function UnifiedCheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const packageParam = searchParams.get("package") || "standard"
  const [selectedPackageId, setSelectedPackageId] = useState(packageParam)
  const [selectedPlaque, setSelectedPlaque] = useState<"silver" | "gold" | "black">("black")
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [boxPersonalization, setBoxPersonalization] = useState("")

  const [addOnsOpen, setAddOnsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
  })

  const selectedPackage = PACKAGES[selectedPackageId as keyof typeof PACKAGES]

  const calculateTotal = () => {
    const packagePrice = selectedPackage.price
    const addOnsTotal = selectedAddOns.reduce((sum, addonId) => {
      const addon = Object.values(ADDONS).find((a) => a.id === addonId)
      return sum + (addon?.price || 0)
    }, 0)
    return packagePrice + addOnsTotal
  }

  const toggleAddOn = (addonId: string) => {
    setSelectedAddOns((prev) => (prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]))
  }

  const validateForm = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zipCode
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handlePaymentSuccess = async (paymentId: string) => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const orderData = {
        planType: "one-time",
        plaqueColor: selectedPlaque,
        boxPersonalization,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone || "",
        addressLine1: formData.address,
        addressLine2: formData.address2 || "",
        city: formData.city,
        state: formData.state,
        zip: formData.zipCode,
        addonWoodenQr: selectedAddOns.includes("wooden_qr"),
        addonPicturePlaque: selectedAddOns.includes("picture_plaque"),
        addonStoneQR: selectedAddOns.includes("stone_qr"),
        stoneEngravingText: "",
        picturePlaqueUrl: "",
        paymentId,
      }

      const response = await fetch("/api/checkout/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      const responseText = await response.text()
      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        throw new Error(`Server returned invalid response`)
      }

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to create order")
      }

      sessionStorage.setItem(
        "pendingOrder",
        JSON.stringify({
          orderId: result.order.id,
          orderNumber: result.order.orderNumber,
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
        }),
      )

      toast({
        title: "Payment Successful!",
        description: "Redirecting you to create your memorial...",
      })

      router.push(`/create-memorial?order=${result.order.orderNumber}`)
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <Header />

      <div className="bg-accent/10 border-b border-accent/20 py-2">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-accent" />
            <span>147 memorials created this week</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>4.9/5 from 2,341 families</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent" />
            <span>Limited time: Save $50 on Premium</span>
          </div>
        </div>
      </div>

      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Create Your Memorial</h1>
            <p className="text-muted-foreground">Everything you need in one simple checkout</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Package Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>1. Choose Your Package</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedPackageId} onValueChange={setSelectedPackageId} className="space-y-4">
                    {Object.entries(PACKAGES).map(([key, pkg]) => (
                      <div
                        key={key}
                        className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPackageId === key
                            ? "border-accent ring-2 ring-accent bg-accent/5"
                            : "border-border hover:border-accent/50"
                        }`}
                        onClick={() => setSelectedPackageId(key)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <RadioGroupItem value={key} id={key} className="mt-1" />
                            <div>
                              <div className="flex items-center gap-2">
                                <Label htmlFor={key} className="text-lg font-bold cursor-pointer">
                                  {pkg.name}
                                </Label>
                                {pkg.popular && (
                                  <Badge variant="default" className="bg-accent">
                                    Most Popular
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {pkg.videos} videos • {pkg.audio} audio • {pkg.photos} photos
                              </p>
                            </div>
                          </div>
                          <p className="text-2xl font-bold">${pkg.price}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Plaque Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>2. Select Plaque Color (Included)</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedPlaque} onValueChange={(v) => setSelectedPlaque(v as any)}>
                    <div className="grid md:grid-cols-3 gap-4">
                      {Object.entries(PLAQUES).map(([key, plaque]) => (
                        <div
                          key={key}
                          className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                            selectedPlaque === key
                              ? "border-accent ring-2 ring-accent"
                              : "border-border hover:border-accent/50"
                          }`}
                          onClick={() => setSelectedPlaque(key as any)}
                        >
                          <div className="relative h-32 w-full bg-gray-100">
                            <Image
                              src={plaque.image || "/placeholder.svg"}
                              alt={plaque.name}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                          <div className="p-3 bg-background">
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value={key} id={`plaque-${key}`} />
                              <Label htmlFor={`plaque-${key}`} className="font-semibold cursor-pointer text-sm">
                                {plaque.name}
                              </Label>
                            </div>
                          </div>
                          {selectedPlaque === key && (
                            <div className="absolute top-2 right-2 bg-accent text-white rounded-full p-1">
                              <CheckCircle className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Add-ons Section - Collapsible */}
              <Card>
                <Collapsible open={addOnsOpen} onOpenChange={setAddOnsOpen}>
                  <CardHeader className="cursor-pointer" onClick={() => setAddOnsOpen(!addOnsOpen)}>
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <CardTitle>3. Add Optional Extras (Save up to $30)</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedAddOns.length > 0
                              ? `${selectedAddOns.length} item(s) selected`
                              : "Tap to view options"}
                          </p>
                        </div>
                        {addOnsOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </div>
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        {Object.entries(ADDONS).map(([key, addon]) => {
                          const isSelected = selectedAddOns.includes(addon.id)
                          return (
                            <div
                              key={key}
                              className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                                isSelected ? "border-accent ring-2 ring-accent" : "border-border hover:border-accent/50"
                              }`}
                              onClick={() => toggleAddOn(addon.id)}
                            >
                              <div className="relative h-32 w-full bg-gray-100">
                                <Image
                                  src={addon.image || "/placeholder.svg"}
                                  alt={addon.name}
                                  fill
                                  className="object-contain p-2"
                                />
                              </div>
                              <div className="p-3 bg-background">
                                <h3 className="font-semibold text-sm mb-1">{addon.name}</h3>
                                <p className="text-xs text-muted-foreground mb-2">{addon.description}</p>
                                <p className="text-lg font-bold">${addon.price}</p>
                              </div>
                              {isSelected && (
                                <div className="absolute top-2 right-2 bg-accent text-white rounded-full p-1">
                                  <CheckCircle className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Box Personalization */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Package className="h-6 w-6 text-accent" />
                    <div>
                      <CardTitle>4. Personalize Your Luxury Box (Optional)</CardTitle>
                      <p className="text-sm text-muted-foreground">Free with every order</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="In Memory of..."
                    value={boxPersonalization}
                    onChange={(e) => setBoxPersonalization(e.target.value)}
                    maxLength={150}
                    rows={3}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2">{boxPersonalization.length}/150 characters</p>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle>5. Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">
                      Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address2">Apartment, Suite, etc.</Label>
                    <Input
                      id="address2"
                      value={formData.address2}
                      onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">
                        State <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        required
                        maxLength={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">
                        ZIP <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-accent" />
                    <CardTitle>6. Secure Payment</CardTitle>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 pt-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>SSL Encrypted</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-purple-600" />
                      <span>30-Day Guarantee</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <SquarePaymentForm
                    amount={calculateTotal()}
                    orderId={`order_${Date.now()}`}
                    onSuccess={handlePaymentSuccess}
                    onError={(error) => console.error("Payment error:", error)}
                    onBeforePayment={validateForm}
                    disabled={isSubmitting}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{selectedPackage.name}</span>
                        <span className="font-semibold">${selectedPackage.price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{PLAQUES[selectedPlaque].name}</span>
                        <span className="font-semibold text-accent">Included</span>
                      </div>
                      {selectedAddOns.map((addonId) => {
                        const addon = Object.values(ADDONS).find((a) => a.id === addonId)
                        if (!addon) return null
                        return (
                          <div key={addonId} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{addon.name}</span>
                            <span className="font-semibold">${addon.price}</span>
                          </div>
                        )
                      })}
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-2xl">${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <p className="font-semibold text-xs">Included:</p>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <span>Lifetime Hosting</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <span>Luxury Box</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <span>Free Shipping</span>
                      </div>
                    </div>

                    <div className="bg-accent/10 p-3 rounded-lg text-sm">
                      <p className="font-semibold mb-1 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Limited Time Offer
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Order in the next 4 hours to receive priority processing
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
