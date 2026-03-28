"use client"

import type React from "react"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Shield, Lock, CreditCard, Award } from "lucide-react"
import { SquarePaymentForm } from "@/components/square-payment-form"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const PACKAGES = {
  starter: { id: "starter", name: "Starter Package", price: 39.89, storage: "500 MB", plaques: 1 },
  basic: { id: "basic", name: "Basic Package", price: 89.89, storage: "1 GB", plaques: 1 },
  standard: { id: "standard", name: "Standard Package", price: 129.89, storage: "2 GB", plaques: 2 },
  premium: { id: "premium", name: "Premium Package", price: 199.89, storage: "5 GB", plaques: 3 },
}

export default function SimpleCheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const packageId = searchParams.get("package") || "standard"
  const selectedPackage = PACKAGES[packageId as keyof typeof PACKAGES] || PACKAGES.standard

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

  const handlePaymentSuccess = async (paymentId: string) => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const orderData = {
        planType: "one-time",
        packageType: packageId,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone || "",
        addressLine1: formData.address,
        addressLine2: formData.address2 || "",
        city: formData.city,
        state: formData.state,
        zip: formData.zipCode,
        paymentId: paymentId,
        // These will be added later in customization
        plaqueColor: "pending",
        boxPersonalization: "",
        addonWoodenQr: false,
        addonPicturePlaque: false,
        addonStoneQR: false,
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

      toast({
        title: "Payment Successful!",
        description: "Redirecting you to customize your memorial...",
      })

      router.push(`/checkout/customize?order=${result.order.orderNumber}`)
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive",
        duration: 10000,
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <Header />

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Complete Your Purchase</h1>
            <p className="text-lg text-muted-foreground">You'll customize your plaque and add-ons after checkout</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Summary Sidebar */}
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
                    <span className="text-muted-foreground">{selectedPackage.name}</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      ${selectedPackage.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• {selectedPackage.storage} storage space</p>
                    <p>
                      • {selectedPackage.plaques} premium {selectedPackage.plaques === 1 ? "plaque" : "plaques"}
                    </p>
                    <p>• Unlimited photos, videos & audio</p>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Today</span>
                    <span className="text-2xl text-gray-900 dark:text-gray-100">
                      ${selectedPackage.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground text-xs">What's Next:</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Choose plaque color</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Add optional extras</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Create your memorial</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/10 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Shield className="h-4 w-4 text-accent" />
                  <span>30-day money-back guarantee</span>
                </div>
              </CardContent>
            </Card>

            {/* Main Form */}
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping & Contact Information</CardTitle>
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
                        autoComplete="given-name"
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
                        autoComplete="family-name"
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
                        autoComplete="email"
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
                        autoComplete="tel"
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
                        autoComplete="street-address"
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
                        autoComplete="address-line2"
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
                          autoComplete="address-level2"
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
                          autoComplete="address-level1"
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
                          autoComplete="postal-code"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Section */}
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
                </CardHeader>
                <CardContent>
                  <SquarePaymentForm
                    amount={selectedPackage.price}
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
                By completing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
