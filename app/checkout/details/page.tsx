"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
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
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const savedData = sessionStorage.getItem("checkoutStep1")
    if (savedData) {
      setStep1Data(JSON.parse(savedData))
    } else {
      router.push("/checkout")
    }
  }, [router])

  const calculateTotal = () => {
    return PRODUCTS.memorial.oneTimePrice
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
        description:
          "Your first and last name combined must be 45 characters or less. Please shorten one or both names.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handlePaymentSuccess = async (paymentId: string) => {
    if (isSubmitting || !step1Data) {
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        planType: "one-time",
        plaqueColor: step1Data.plaqueType,
        boxPersonalization: step1Data.boxPersonalization,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone || "",
        addressLine1: formData.address,
        addressLine2: formData.address2 || "",
        city: formData.city,
        state: formData.state,
        zip: formData.zipCode,
        addonWoodenQr: false,
        addonPicturePlaque: false,
        addonStoneQR: false,
        stoneEngravingText: "",
        picturePlaqueUrl: "",
        paymentId: paymentId,
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
        console.error("Failed to parse response:", parseError)
        throw new Error(`Server returned invalid response: ${responseText.substring(0, 100)}`)
      }

      if (!response.ok) {
        throw new Error(result.error || `Server error: ${response.status}`)
      }

      if (!result.success) {
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
      console.error("Payment processing error:", error)
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive",
        duration: 10000,
      })
      setIsSubmitting(false)
    }
  }

  if (!step1Data) {
    return null
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
                    <span className="text-muted-foreground">Memorial Package (Lifetime)</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      ${PRODUCTS.memorial.oneTimePrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{PRODUCTS.plaques[step1Data.plaqueType].name}</span>
                    <span className="font-semibold text-accent">Included</span>
                  </div>
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
                    <span>Lifetime Hosting (Included)</span>
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

            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                  <p className="text-sm text-muted-foreground">Enter your contact and shipping details</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm">Shipping Address</h3>
                    <div className="space-y-2">
                      <Label htmlFor="address">
                        Street Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address2">Apartment, Suite, etc.</Label>
                      <Input
                        id="address2"
                        name="address2"
                        value={formData.address2}
                        onChange={handleInputChange}
                        placeholder="Apt 4B"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">
                          City <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          placeholder="New York"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">
                          State <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          placeholder="NY"
                          maxLength={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">
                          ZIP Code <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          placeholder="10001"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-accent" />
                    Secure Payment
                  </CardTitle>
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
