"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, Shield, ArrowLeft, Lock, CreditCard, Award } from "lucide-react"
import { SquarePaymentForm } from "@/components/square-payment-form"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

const PRODUCTS = {
  memorial: {
    id: "online_memorial",
    name: "Online Memorial",
    oneTimePrice: 2.0,
    monthlyPrice: 2.0,
    monthlyFee: 2.0,
  },
  plaques: {
    silver: { name: "Silver Memorial Plaque" },
    gold: { name: "Gold Memorial Plaque" },
    black: { name: "Black Memorial Plaque" },
  },
  addons: {
    woodenQR: {
      id: "wooden_qr",
      name: "Wooden QR Code",
      description: "Natural wood finish with laser-engraved QR code",
      price: 29.97,
      image: "/wooden-keychain.png",
    },
    picturePlaque: {
      id: "picture_plaque",
      name: "Picture Plaque",
      description: "Custom photo plaque with memorial details",
      price: 39.98,
      image: "/aluminum-card.jpg",
    },
    stoneQR: {
      id: "stone_qr",
      name: "Stone QR Code",
      description: "Durable stone memorial with engraved QR code",
      price: 56.99,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e4de3d0a-3087-4815-924d-3bcb93c7a20d.jpg",
    },
  },
}

export default function CheckoutDetailsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [step1Data, setStep1Data] = useState<{
    paymentPlan: "onetime" | "monthly"
    plaqueType: "silver" | "gold" | "black"
    boxPersonalization: string
  } | null>(null)

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
    includeWoodenQR: false,
    includePicturePlaque: false,
    includeStoneQR: false,
    stoneCustomText: "",
    picturePlaqueImage: null as File | null,
    isGift: false,
    giftMessage: "",
    recipientName: "",
    recipientEmail: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const savedData = sessionStorage.getItem("checkoutStep1")
    if (savedData) {
      setStep1Data(JSON.parse(savedData))
    } else {
      // Redirect back to step 1 if no data found
      router.push("/checkout")
    }
  }, [router])

  const calculateTotal = () => {
    if (!step1Data) return 0

    let total = step1Data.paymentPlan === "onetime" ? PRODUCTS.memorial.oneTimePrice : PRODUCTS.memorial.monthlyPrice

    if (formData.includeWoodenQR) total += PRODUCTS.addons.woodenQR.price
    if (formData.includePicturePlaque) total += PRODUCTS.addons.picturePlaque.price
    if (formData.includeStoneQR) total += PRODUCTS.addons.stoneQR.price

    return total
  }

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive",
        })
        return
      }
      setFormData({
        ...formData,
        picturePlaqueImage: file,
      })
    }
  }

  const handleProductChange = (
    productKey: "includeWoodenQR" | "includePicturePlaque" | "includeStoneQR",
    checked: boolean,
  ) => {
    setFormData({
      ...formData,
      [productKey]: checked,
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

  const handlePaymentSuccess = async (paymentId: string) => {
    if (isSubmitting || !step1Data) return

    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()

      // Plan and product details
      formDataToSend.append("planType", step1Data.paymentPlan === "onetime" ? "one-time" : "monthly")
      formDataToSend.append("plaqueColor", step1Data.plaqueType)
      formDataToSend.append("boxPersonalization", step1Data.boxPersonalization)

      // Customer information
      formDataToSend.append("customerName", `${formData.firstName} ${formData.lastName}`)
      formDataToSend.append("customerEmail", formData.email)
      formDataToSend.append("customerPhone", formData.phone)

      // Shipping address
      formDataToSend.append("addressLine1", formData.address)
      formDataToSend.append("addressLine2", formData.address2)
      formDataToSend.append("city", formData.city)
      formDataToSend.append("state", formData.state)
      formDataToSend.append("zip", formData.zipCode)
      formDataToSend.append("country", "US")

      // Add-ons
      formDataToSend.append("addonWoodenQr", formData.includeWoodenQR.toString())
      formDataToSend.append("addonPicturePlaque", formData.includePicturePlaque.toString())
      formDataToSend.append("addonStoneQr", formData.includeStoneQR.toString())
      formDataToSend.append("stoneEngravingText", formData.stoneCustomText)

      // Picture plaque image if selected
      if (formData.includePicturePlaque && formData.picturePlaqueImage) {
        formDataToSend.append("picturePlaqueFile", formData.picturePlaqueImage)
      }

      // Payment details
      formDataToSend.append("sourceId", paymentId)
      formDataToSend.append("totalAmount", calculateTotal().toString())

      // Gift information
      if (formData.isGift) {
        formDataToSend.append("isGift", "true")
        formDataToSend.append("recipientName", formData.recipientName)
        formDataToSend.append("recipientEmail", formData.recipientEmail)
        formDataToSend.append("giftMessage", formData.giftMessage)
      }

      console.log("[v0] Creating order after payment...")

      const response = await fetch("/api/checkout/process", {
        method: "POST",
        body: formDataToSend,
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to create order")
      }

      console.log("[v0] Order created successfully:", result.order.orderNumber)

      // Store minimal order data for memorial creation
      const orderData = {
        orderId: result.order.id,
        orderNumber: result.order.orderNumber,
        customerEmail: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`,
        plaqueColor: step1Data.plaqueType,
        planType: step1Data.paymentPlan,
      }

      sessionStorage.setItem("pendingOrder", JSON.stringify(orderData))

      toast({
        title: "Payment Successful!",
        description: "Redirecting you to create your memorial...",
      })

      // Redirect to create memorial page
      router.push("/create-memorial")
    } catch (error: any) {
      console.error("[v0] Error processing payment:", error)
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please contact support.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!step1Data) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <Header />

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost" onClick={() => router.push("/checkout")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Plan Selection
            </Button>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Complete Your Order</h1>
            <p className="text-lg text-muted-foreground">Add optional extras and enter your shipping information</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <Card className="h-fit lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      {step1Data.paymentPlan === "onetime"
                        ? "Memorial Package (Lifetime)"
                        : "Memorial Package (Monthly)"}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      $
                      {step1Data.paymentPlan === "onetime"
                        ? PRODUCTS.memorial.oneTimePrice.toFixed(2)
                        : PRODUCTS.memorial.monthlyPrice.toFixed(2)}
                    </span>
                  </div>
                  {step1Data.paymentPlan === "monthly" && (
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Then ${PRODUCTS.memorial.monthlyFee}/month</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{PRODUCTS.plaques[step1Data.plaqueType].name}</span>
                    <span className="font-semibold text-accent">Included</span>
                  </div>
                  {formData.includeWoodenQR && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Wooden QR Code</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        ${PRODUCTS.addons.woodenQR.price.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {formData.includePicturePlaque && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Picture Plaque</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        ${PRODUCTS.addons.picturePlaque.price.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {formData.includeStoneQR && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Stone QR Code</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        ${PRODUCTS.addons.stoneQR.price.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Today</span>
                    <span className="text-2xl text-gray-900 dark:text-gray-100">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground text-xs">Included with Every Order:</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Digital Memorial Website</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Lifetime Hosting {step1Data.paymentPlan === "onetime" && "(Included)"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Luxury Presentation Box</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Free Shipping</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/10 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Shield className="h-4 w-4 text-accent" />
                  <span>30-day money-back guarantee</span>
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Add-ons */}
              <Card>
                <CardHeader>
                  <CardTitle>Optional Add-ons</CardTitle>
                  <p className="text-sm text-muted-foreground">Enhance your memorial with these additional products</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Wooden QR Code */}
                  <div
                    className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                      formData.includeWoodenQR ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
                    }`}
                    onClick={() => handleProductChange("includeWoodenQR", !formData.includeWoodenQR)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="woodenQR"
                        checked={formData.includeWoodenQR}
                        onCheckedChange={(checked) => handleProductChange("includeWoodenQR", checked as boolean)}
                        className="mt-1"
                      />
                      <div className="relative h-20 w-20 rounded overflow-hidden border flex-shrink-0">
                        <Image
                          src={PRODUCTS.addons.woodenQR.image || "/placeholder.svg"}
                          alt={PRODUCTS.addons.woodenQR.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="woodenQR" className="font-semibold text-sm cursor-pointer block mb-1">
                          {PRODUCTS.addons.woodenQR.name}
                        </Label>
                        <p className="text-xs text-muted-foreground mb-2">{PRODUCTS.addons.woodenQR.description}</p>
                        <span className="text-sm font-semibold text-accent">
                          +${PRODUCTS.addons.woodenQR.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Picture Plaque */}
                  <div
                    className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                      formData.includePicturePlaque
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/50"
                    }`}
                    onClick={() => handleProductChange("includePicturePlaque", !formData.includePicturePlaque)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="picturePlaque"
                        checked={formData.includePicturePlaque}
                        onCheckedChange={(checked) => handleProductChange("includePicturePlaque", checked as boolean)}
                        className="mt-1"
                      />
                      <div className="relative h-20 w-24 rounded overflow-hidden border flex-shrink-0">
                        <Image
                          src={PRODUCTS.addons.picturePlaque.image || "/placeholder.svg"}
                          alt={PRODUCTS.addons.picturePlaque.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="picturePlaque" className="font-semibold text-sm cursor-pointer block mb-1">
                          {PRODUCTS.addons.picturePlaque.name}
                        </Label>
                        <p className="text-xs text-muted-foreground mb-2">
                          {PRODUCTS.addons.picturePlaque.description}
                        </p>
                        <span className="text-sm font-semibold text-accent">
                          +${PRODUCTS.addons.picturePlaque.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    {formData.includePicturePlaque && (
                      <div className="mt-4 pt-4 border-t" onClick={(e) => e.stopPropagation()}>
                        <Label htmlFor="picturePlaqueUpload" className="text-sm font-medium mb-2 block">
                          Upload Your Photo
                        </Label>
                        <div className="flex items-center gap-3">
                          <Input
                            id="picturePlaqueUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="cursor-pointer"
                          />
                          {formData.picturePlaqueImage && (
                            <div className="flex items-center gap-2 text-xs text-accent">
                              <CheckCircle className="h-4 w-4" />
                              <span>{formData.picturePlaqueImage.name}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Upload a high-quality photo (max 5MB). JPG, PNG, or HEIC format.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Stone QR Code */}
                  <div
                    className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                      formData.includeStoneQR ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
                    }`}
                    onClick={() => handleProductChange("includeStoneQR", !formData.includeStoneQR)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="stoneQR"
                        checked={formData.includeStoneQR}
                        onCheckedChange={(checked) => handleProductChange("includeStoneQR", checked as boolean)}
                        className="mt-1"
                      />
                      <div className="relative h-20 w-20 rounded overflow-hidden border flex-shrink-0">
                        <Image
                          src={PRODUCTS.addons.stoneQR.image || "/placeholder.svg"}
                          alt={PRODUCTS.addons.stoneQR.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="stoneQR" className="font-semibold text-sm cursor-pointer block mb-1">
                          {PRODUCTS.addons.stoneQR.name}
                        </Label>
                        <p className="text-xs text-muted-foreground mb-2">{PRODUCTS.addons.stoneQR.description}</p>
                        <span className="text-sm font-semibold text-accent">
                          +${PRODUCTS.addons.stoneQR.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    {formData.includeStoneQR && (
                      <div className="mt-4 pt-4 border-t" onClick={(e) => e.stopPropagation()}>
                        <Label htmlFor="stoneCustomText" className="text-sm font-medium mb-2 block">
                          Custom Engraving Text
                        </Label>
                        <Textarea
                          id="stoneCustomText"
                          name="stoneCustomText"
                          placeholder="Gone But Never Forgotten&#10;John Doe&#10;1950 - 2024"
                          value={formData.stoneCustomText}
                          onChange={handleTextareaChange}
                          maxLength={100}
                          rows={3}
                          className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          {formData.stoneCustomText.length}/100 characters. This text will be engraved on your stone
                          plaque.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <Checkbox
                      id="isGift"
                      checked={formData.isGift}
                      onCheckedChange={(checked) => setFormData({ ...formData, isGift: checked as boolean })}
                    />
                    <Label htmlFor="isGift" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-accent"
                      >
                        <polyline points="20 12 20 22 4 22 4 12" />
                        <rect x="2" y="7" width="20" height="5" />
                        <line x1="12" y1="22" x2="12" y2="7" />
                        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                      </svg>
                      This is a gift
                    </Label>
                  </div>

                  {formData.isGift && (
                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
                      <h3 className="font-semibold text-sm">Gift Recipient Information</h3>
                      <div className="space-y-2">
                        <Label htmlFor="recipientName">Recipient Name *</Label>
                        <Input
                          id="recipientName"
                          name="recipientName"
                          placeholder="Jane Smith"
                          value={formData.recipientName}
                          onChange={handleInputChange}
                          required={formData.isGift}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="recipientEmail">Recipient Email *</Label>
                        <Input
                          id="recipientEmail"
                          name="recipientEmail"
                          type="email"
                          placeholder="jane@example.com"
                          value={formData.recipientEmail}
                          onChange={handleInputChange}
                          required={formData.isGift}
                        />
                        <p className="text-xs text-muted-foreground">
                          We'll send the recipient instructions to create their memorial
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="giftMessage">Gift Message (Optional)</Label>
                        <Textarea
                          id="giftMessage"
                          name="giftMessage"
                          placeholder="Write a personal message to include with your gift..."
                          value={formData.giftMessage}
                          onChange={handleTextareaChange}
                          maxLength={500}
                          rows={4}
                          className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">{formData.giftMessage.length}/500 characters</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{formData.isGift ? "Your" : ""} First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{formData.isGift ? "Your" : ""} Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{formData.isGift ? "Your" : ""} Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm">
                      {formData.isGift ? "Shipping Address (Where to send the gift)" : "Shipping Address"}
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="123 Main Street"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address2">Apartment, Suite, etc.</Label>
                      <Input
                        id="address2"
                        name="address2"
                        placeholder="Apt 4B"
                        value={formData.address2}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          placeholder="New York"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          name="state"
                          placeholder="NY"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        placeholder="10001"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-accent" />
                    Secure Payment
                  </CardTitle>
                  {/* Trust signals section */}
                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t mt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-5 w-5 text-green-600" />
                      <span className="font-medium">SSL Encrypted</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">100% Satisfaction Guaranteed</span>
                    </div>
                  </div>
                  <div className="pt-3 text-xs text-muted-foreground">
                    <p>We accept all major credit cards • Powered by Square</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <SquarePaymentForm
                    amount={calculateTotal()}
                    orderId={`ORD${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`}
                    onSuccess={handlePaymentSuccess}
                    onError={(error) => {
                      console.error("Payment error:", error)
                    }}
                    onBeforePayment={validateForm}
                    disabled={isSubmitting}
                  />
                </CardContent>
              </Card>

              <p className="text-xs text-muted-foreground text-center">
                By completing your order, you agree to our Terms of Service and Privacy Policy. Your memorial will be
                created within 24 hours of payment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
