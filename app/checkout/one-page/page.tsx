"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Package, Lock, ChevronDown, ChevronUp } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { StripeCheckout } from "@/components/stripe-checkout"
import { createCheckoutSession } from "@/app/actions/stripe"
import { PACKAGES, ADDONS, PLAQUES, formatPrice } from "@/lib/products"

function CheckoutLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse text-muted-foreground">Loading checkout...</div>
    </div>
  )
}

function OnePageCheckoutContent() {
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const packageId = searchParams.get("package") || "standard"
  const selectedPackage = PACKAGES[packageId] || PACKAGES.standard

  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [plaqueType, setPlaqueType] = useState<"silver" | "gold" | "black">("black")
  const [boxPersonalization, setBoxPersonalization] = useState("")
  const [showPayment, setShowPayment] = useState(false)

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
    if (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.address &&
      formData.city &&
      formData.state &&
      formData.zipCode
    ) {
      setShippingOpen(false)
      setShowPayment(true)
    }
  }, [formData])

  const calculateAddOnsTotal = () => {
    return selectedAddOns.reduce((sum, addonId) => {
      const addon = ADDONS[addonId]
      return sum + (addon?.priceInCents || 0)
    }, 0)
  }

  const calculateTotal = () => {
    return selectedPackage.priceInCents + calculateAddOnsTotal()
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

    return true
  }

  const fetchClientSecret = useCallback(async () => {
    if (!validateForm()) {
      throw new Error("Please fill in all required fields")
    }

    const result = await createCheckoutSession({
      packageId,
      addonIds: selectedAddOns,
      plaqueColor: plaqueType,
      boxPersonalization,
      customerEmail: formData.email,
      customerName: `${formData.firstName} ${formData.lastName}`,
      shippingAddress: {
        line1: formData.address,
        line2: formData.address2,
        city: formData.city,
        state: formData.state,
        postal_code: formData.zipCode,
        country: "US",
      },
    })

    return result.clientSecret!
  }, [packageId, selectedAddOns, plaqueType, boxPersonalization, formData])

  const handleCheckoutComplete = () => {
    toast({
      title: "Payment Successful!",
      description: "Redirecting you to create your memorial...",
    })

    // Store order info and redirect
    sessionStorage.setItem(
      "pendingOrder",
      JSON.stringify({
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
      }),
    )

    router.push("/checkout/success")
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
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">${formatPrice(calculateTotal())}</p>
                  {selectedAddOns.length > 0 && (
                    <p className="text-xs sm:text-sm text-accent">+ ${formatPrice(calculateAddOnsTotal())} add-ons</p>
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
                        {addOnsOpen ? (
                          <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                      </div>
                      {selectedAddOns.length > 0 && (
                        <p className="text-xs sm:text-sm text-accent text-left">
                          {selectedAddOns.length} selected (+${formatPrice(calculateAddOnsTotal())})
                        </p>
                      )}
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="p-3 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        {Object.entries(ADDONS).map(([key, addon]) => {
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
                                <p className="text-xs text-muted-foreground mb-1 hidden sm:block">
                                  {addon.description}
                                </p>
                                <p className="text-sm sm:text-base font-bold text-foreground">
                                  ${formatPrice(addon.priceInCents)}
                                </p>
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
                        {plaqueOpen ? (
                          <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground text-left">
                        {PLAQUES[plaqueType].name} selected
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
                        {Object.entries(PLAQUES).map(([key, plaque]) => (
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
                        {boxOpen ? (
                          <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground text-left">Personalize (optional)</p>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="p-3 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="relative h-32 sm:h-48 rounded-lg overflow-hidden">
                          <Image src="/images/design-mode/box1(1).jpg" alt="Luxury Box" fill className="object-cover" />
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
                        {shippingOpen ? (
                          <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
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
                            First Name <span className="text-destructive">*</span>
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
                            Last Name <span className="text-destructive">*</span>
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
                            Email <span className="text-destructive">*</span>
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
                          <Label htmlFor="phone" className="text-xs sm:text-sm">
                            Phone
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-xs sm:text-sm">
                          Address <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          className="text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address2" className="text-xs sm:text-sm">
                          Apartment, Suite, etc.
                        </Label>
                        <Input
                          id="address2"
                          name="address2"
                          value={formData.address2}
                          onChange={handleInputChange}
                          className="text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 sm:gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-xs sm:text-sm">
                            City <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state" className="text-xs sm:text-sm">
                            State <span className="text-destructive">*</span>
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
                            ZIP <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            required
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Payment Section - Stripe Embedded Checkout */}
              {showPayment && (
                <StripeCheckout fetchClientSecret={fetchClientSecret} onComplete={handleCheckoutComplete} />
              )}

              {!showPayment && (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    <Lock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Complete shipping information to proceed to payment</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
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
                      <span className="font-semibold text-foreground">
                        ${formatPrice(selectedPackage.priceInCents)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{PLAQUES[plaqueType].name}</span>
                      <span className="font-semibold text-accent">Included</span>
                    </div>
                    {selectedAddOns.map((addonId) => {
                      const addon = ADDONS[addonId]
                      if (!addon) return null
                      return (
                        <div key={addonId} className="flex justify-between">
                          <span className="text-muted-foreground">{addon.name}</span>
                          <span className="font-semibold text-foreground">${formatPrice(addon.priceInCents)}</span>
                        </div>
                      )
                    })}
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-2xl text-foreground">${formatPrice(calculateTotal())}</span>
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

export default function OnePageCheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <OnePageCheckoutContent />
    </Suspense>
  )
}
