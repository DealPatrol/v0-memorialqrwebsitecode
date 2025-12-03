"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Package, Shield, Lock, CreditCard, Award, ChevronDown, ChevronUp } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SquarePaymentForm } from "@/components/square-payment-form"
import { useToast } from "@/hooks/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const PRODUCTS = {
  plaques: {
    silver: {
      id: "silver_plaque",
      name: "Silver Memorial Plaque",
      description: "Premium silver finish with engraved QR code",
      image: "/images/silver.jpg",
    },
    gold: {
      id: "gold_plaque",
      name: "Gold Memorial Plaque",
      description: "Elegant gold finish with engraved QR code",
      image: "/images/gold.jpg",
    },
    black: {
      id: "black_plaque",
      name: "Black Memorial Plaque",
      description: "Classic black finish with engraved QR code",
      image: "/images/black.jpg",
    },
  },
  addons: {
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

export default function OnePageCheckout() {
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const packageId = searchParams.get("package") || "standard"
  const selectedPackage = PACKAGES[packageId as keyof typeof PACKAGES] || PACKAGES.standard

  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [plaqueType, setPlaqueType] = useState<"silver" | "gold" | "black">("black")
  const [boxPersonalization, setBoxPersonalization] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [addOnsOpen, setAddOnsOpen] = useState(false)
  const [plaqueOpen, setPlaqueOpen] = useState(false)
  const [boxOpen, setBoxOpen] = useState(false)
  const [shippingOpen, setShippingOpen] = useState(true)

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

  useEffect(() => {
    if (formData.firstName && formData.lastName && formData.email && formData.address && formData.city && formData.state && formData.zipCode) {
      setShippingOpen(false)
    }
  }, [formData])

  const calculateAddOnsTotal = () => {
    return selectedAddOns.reduce((sum, addonId) => {
      const addon = Object.values(PRODUCTS.addons).find((a) => a.id === addonId)
      return sum + (addon?.price || 0)
    }, 0)
  }

  const calculateTotal = () => {
    return selectedPackage.price + calculateAddOnsTotal()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
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
        description: "Please fill in all required fields before proceeding with payment.",
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

    const fullName = `${formData.firstName} ${formData.lastName}`
    if (fullName.length > 45) {
      toast({
        title: "Name Too Long",
        description: "Your first and last name combined must be 45 characters or less.",
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
        package: packageId,
        plaqueColor: plaqueType,
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

      const result = await response.json()

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
        duration: 10000,
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <Header />

      <section className="sticky top-0 z-40 py-3 sm:py-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 shadow-md">
        <div className="max-w-6xl mx-auto">
          <Card className="border-2 border-accent/30">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold">{selectedPackage.name}</h2>
                  <div className="flex gap-3 text-xs sm:text-sm text-muted-foreground">
                    <span>{selectedPackage.videos} videos</span>
                    <span>{selectedPackage.audio} audio</span>
                    <span>{selectedPackage.photos} photos</span>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">${calculateTotal().toFixed(2)}</p>
                  {selectedAddOns.length > 0 && (
                    <p className="text-xs sm:text-sm text-accent">+ ${calculateAddOnsTotal().toFixed(2)} add-ons</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
            <div className="space-y-3 sm:space-y-4 lg:col-span-2">
              {/* Add-ons Collapsible */}
              <Collapsible open={addOnsOpen} onOpenChange={setAddOnsOpen}>
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="cursor-pointer hover:bg-accent/5 transition-colors p-3 sm:p-6">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base sm:text-lg">Optional Add-ons</CardTitle>
                        {addOnsOpen ? <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />}
                      </div>
                      {selectedAddOns.length > 0 && (
                        <p className="text-xs sm:text-sm text-accent text-left">
                          {selectedAddOns.length} selected (+${calculateAddOnsTotal().toFixed(2)})
                        </p>
                      )}
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="p-3 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        {Object.entries(PRODUCTS.addons).map(([key, addon]) => {
                          const isSelected = selectedAddOns.includes(addon.id)
                          return (
                            <div
                              key={key}
                              className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                                isSelected
                                  ? "border-accent ring-2 ring-accent"
                                  : "border-border hover:border-accent/50"
                              }`}
                              onClick={() => {
                                setSelectedAddOns((prev) =>
                                  prev.includes(addon.id) ? prev.filter((id) => id !== addon.id) : [...prev, addon.id],
                                )
                              }}
                            >
                              <div className="relative h-24 sm:h-32 w-full">
                                <Image
                                  src={addon.image || "/placeholder.svg"}
                                  alt={addon.name}
                                  fill
                                  className="object-contain p-2"
                                />
                              </div>
                              <div className="p-2 sm:p-3 bg-background">
                                <h3 className="font-semibold text-xs sm:text-sm mb-1">{addon.name}</h3>
                                <p className="text-xs text-muted-foreground mb-1 hidden sm:block">{addon.description}</p>
                                <p className="text-sm sm:text-base font-bold text-gray-900">${addon.price.toFixed(2)}</p>
                              </div>
                              {isSelected && (
                                <div className="absolute top-2 right-2 bg-accent text-accent-foreground rounded-full p-1 sm:p-1.5">
                                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Plaque Selection Collapsible */}
              <Collapsible open={plaqueOpen} onOpenChange={setPlaqueOpen}>
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="cursor-pointer hover:bg-accent/5 transition-colors p-3 sm:p-6">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base sm:text-lg">Plaque Color</CardTitle>
                        {plaqueOpen ? <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground text-left">
                        {PRODUCTS.plaques[plaqueType].name} selected
                      </p>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="p-3 sm:p-6">
                      <RadioGroup
                        value={plaqueType}
                        onValueChange={(value) => setPlaqueType(value as "silver" | "gold" | "black")}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
                      >
                        {Object.entries(PRODUCTS.plaques).map(([key, plaque]) => (
                          <div
                            key={key}
                            className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                              plaqueType === key ? "border-accent ring-2 ring-accent" : "border-border"
                            }`}
                            onClick={() => setPlaqueType(key as "silver" | "gold" | "black")}
                          >
                            <div className="relative h-20 sm:h-28 w-full">
                              <Image
                                src={plaque.image || "/placeholder.svg"}
                                alt={plaque.name}
                                fill
                                className="object-contain p-2"
                              />
                            </div>
                            <div className="p-2 sm:p-3 bg-background">
                              <div className="flex items-start gap-2">
                                <RadioGroupItem value={key} id={key} className="mt-1" />
                                <div className="flex-1">
                                  <Label htmlFor={key} className="font-semibold cursor-pointer text-xs sm:text-sm">
                                    {plaque.name}
                                  </Label>
                                  <p className="text-xs text-muted-foreground hidden sm:block">{plaque.description}</p>
                                </div>
                              </div>
                            </div>
                            {plaqueType === key && (
                              <div className="absolute top-2 right-2 bg-accent text-accent-foreground rounded-full p-1 sm:p-1.5">
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              </div>
                            )}
                          </div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Box Personalization Collapsible */}
              <Collapsible open={boxOpen} onOpenChange={setBoxOpen}>
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="cursor-pointer hover:bg-accent/5 transition-colors p-3 sm:p-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                          <CardTitle className="text-base sm:text-lg">Presentation Box</CardTitle>
                        </div>
                        {boxOpen ? <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground text-left">Personalize (optional)</p>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="p-3 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="relative h-32 sm:h-48 rounded-lg overflow-hidden">
                          <Image
                            src="/images/design-mode/box1(1).jpg"
                            alt="Luxury Box"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-accent flex-shrink-0" />
                              <span>Premium packaging</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-accent flex-shrink-0" />
                              <span>Included free</span>
                            </div>
                          </div>
                          <div className="space-y-2 pt-2">
                            <Label htmlFor="boxPersonalization" className="text-xs sm:text-sm font-semibold">
                              Personalization
                            </Label>
                            <Textarea
                              id="boxPersonalization"
                              placeholder="In Memory of..."
                              value={boxPersonalization}
                              onChange={(e) => setBoxPersonalization(e.target.value)}
                              maxLength={150}
                              rows={3}
                              className="resize-none text-sm"
                            />
                            <p className="text-xs text-muted-foreground">{boxPersonalization.length}/150 characters</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Shipping Information */}
              <Collapsible open={shippingOpen} onOpenChange={setShippingOpen}>
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="cursor-pointer hover:bg-accent/5 transition-colors p-3 sm:p-6">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base sm:text-lg">Shipping Information</CardTitle>
                        {shippingOpen ? <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />}
                      </div>
                      {formData.firstName && formData.email && (
                        <p className="text-xs sm:text-sm text-accent text-left">Information provided</p>
                      )}
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="p-3 sm:p-6 space-y-3 sm:space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-xs sm:text-sm">
                            First Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-xs sm:text-sm">
                            Last Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-xs sm:text-sm">
                            Email <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-xs sm:text-sm">Phone</Label>
                          <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="text-sm" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-xs sm:text-sm">
                          Address <span className="text-red-500">*</span>
                        </Label>
                        <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required className="text-sm" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address2" className="text-xs sm:text-sm">Apartment, Suite, etc.</Label>
                        <Input id="address2" name="address2" value={formData.address2} onChange={handleInputChange} className="text-sm" />
                      </div>

                      <div className="grid grid-cols-3 gap-2 sm:gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-xs sm:text-sm">
                            City <span className="text-red-500">*</span>
                          </Label>
                          <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required className="text-sm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state" className="text-xs sm:text-sm">
                            State <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                            maxLength={2}
                            className="text-sm uppercase"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode" className="text-xs sm:text-sm">
                            ZIP <span className="text-red-500">*</span>
                          </Label>
                          <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required className="text-sm" />
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Payment Section */}
              <Card>
                <CardHeader className="p-3 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                    Secure Payment
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 sm:pt-3">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                      <span>SSL Encrypted</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                      <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                      <Award className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                      <span>30-Day Guarantee</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <SquarePaymentForm
                    amount={calculateTotal()}
                    orderId={`order_${Date.now()}`}
                    onSuccess={handlePaymentSuccess}
                    onError={(error) => {
                      console.error("Payment error:", error)
                    }}
                    onBeforePayment={validateForm}
                    disabled={isSubmitting}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar - Hidden on mobile, shown as sticky summary */}
            <div className="hidden lg:block lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{selectedPackage.name}</span>
                      <span className="font-semibold text-gray-900">${selectedPackage.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{PRODUCTS.plaques[plaqueType].name}</span>
                      <span className="font-semibold text-accent">Included</span>
                    </div>
                    {selectedAddOns.map((addonId) => {
                      const addon = Object.values(PRODUCTS.addons).find((a) => a.id === addonId)
                      if (!addon) return null
                      return (
                        <div key={addonId} className="flex justify-between">
                          <span className="text-muted-foreground">{addon.name}</span>
                          <span className="font-semibold text-gray-900">${addon.price.toFixed(2)}</span>
                        </div>
                      )
                    })}
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-2xl text-gray-900">${calculateTotal().toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>Digital Memorial Website</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>Lifetime Hosting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>Luxury Presentation Box</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>30-Day Money-Back Guarantee</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
