"use client"

import { Suspense } from "react"
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
import { Textarea } from "@/components/ui/textarea"

const STORE_PRODUCTS = {
  "wooden-keychain-necklace": { name: "Memorial QR Code Wooden Keychain or Necklace", price: 14.99, monthlyFee: 4.99 },
  "slate-memorial-coaster": { name: "Memorial Slate Coaster with QR Code", price: 24.99, monthlyFee: 4.99 },
  "memorial-photo-frame": { name: "Memorial Photo Frame with QR Code", price: 49.99, monthlyFee: 4.99 },
}

function CheckoutForm() {
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const productId = searchParams.get("product") || "wooden-keychain-necklace"

  const selectedProduct =
    STORE_PRODUCTS[productId as keyof typeof STORE_PRODUCTS] || STORE_PRODUCTS["wooden-keychain-necklace"]

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
    customization: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        planType: "individual-product",
        package: productId,
        productName: selectedProduct.name,
        productPrice: selectedProduct.price,
        monthlyFee: selectedProduct.monthlyFee,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone || "",
        addressLine1: formData.address,
        addressLine2: formData.address2 || "",
        city: formData.city,
        state: formData.state,
        zip: formData.zipCode,
        paymentId: paymentId,
        customization: formData.customization || "",
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
        description: "Your order has been confirmed. Check your email for details.",
      })

      router.push(`/order-success?order=${result.order.orderNumber}`)
    } catch (error: any) {
      console.error("[v0] Order creation error:", error)
      toast({
        title: "Order Processing Failed",
        description: error.message || "There was an error processing your order. Please contact support.",
        variant: "destructive",
        duration: 10000,
      })
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Complete Your Purchase</h1>
          <p className="text-lg text-muted-foreground">Secure checkout for your memorial product</p>
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
              <div className="space-y-3">
                <div className="text-sm font-medium text-foreground">{selectedProduct.name}</div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Product Price:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    ${selectedProduct.price.toFixed(2)}
                  </span>
                </div>
                {selectedProduct.monthlyFee > 0 && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200 dark:border-blue-800">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-blue-900 dark:text-blue-100 font-medium">Monthly Hosting:</span>
                      <span className="font-semibold text-blue-900 dark:text-blue-100">
                        ${selectedProduct.monthlyFee.toFixed(2)}/mo
                      </span>
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Unlimited photos, videos & memorial content
                    </p>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold">Due Today:</span>
                  <span className="text-2xl font-bold text-blue-600">${selectedProduct.price.toFixed(2)}</span>
                </div>
                {selectedProduct.monthlyFee > 0 && (
                  <p className="text-xs text-muted-foreground text-center">
                    Then ${selectedProduct.monthlyFee.toFixed(2)}/month starting next month
                  </p>
                )}
              </div>

              <Separator />

              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground text-xs mb-2">What's Included:</p>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Personalized memorial product with QR code</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Lifetime digital memorial website</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Unlimited photos, videos & memories</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Fast shipping (3-5 business days)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-green-900 dark:text-green-100 font-medium">30-day money-back guarantee</span>
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

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="customization">Memorial Customization (Optional)</Label>
                  <Textarea
                    id="customization"
                    name="customization"
                    value={formData.customization}
                    onChange={handleInputChange}
                    placeholder="For keychain/necklace: specify which you prefer. For slate coaster or photo frame: provide name, dates, and any special text..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Let us know personalization details: names, dates, memorial text, or special requests for your
                    order.
                  </p>
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
                    <span className="font-medium">Square Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">100% Satisfaction Guaranteed</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <SquarePaymentForm
                  amount={selectedProduct.price}
                  orderId={`order_${Date.now()}`}
                  onSuccess={handlePaymentSuccess}
                  onError={(error) => {
                    console.error("[v0] Payment error:", error)
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
  )
}

export default function SimpleCheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <Header />
      <Suspense fallback={<div className="py-20 text-center">Loading checkout...</div>}>
        <CheckoutForm />
      </Suspense>
    </div>
  )
}
