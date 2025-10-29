"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Shield, Package } from "lucide-react"
import { SquarePaymentForm } from "@/components/square-payment-form"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { PlaqueColorSelector } from "@/components/plaque-color-selector"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()

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
    plaqueColor: "black",
    boxPersonalization: "", // Added box personalization field
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleColorChange = (color: string) => {
    setFormData({
      ...formData,
      plaqueColor: color,
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
        customerEmail: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerPhone: formData.phone,
        shippingAddress: {
          line1: formData.address,
          line2: formData.address2,
          city: formData.city,
          state: formData.state,
          zip: formData.zipCode,
        },
        paymentId,
        amountCents: 200,
        productType: "qr_plaque",
        productName: "Memorial QR Package",
        plaqueColor: formData.plaqueColor,
        boxPersonalization: formData.boxPersonalization,
      }

      sessionStorage.setItem("pendingOrder", JSON.stringify(orderData))

      toast({
        title: "Payment Successful!",
        description: "Now let's create your account and memorial profile.",
      })

      router.push("/auth/sign-up?redirect=create-memorial")
    } catch (error: any) {
      console.error("[v0] Error processing payment:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please contact support.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <Header />

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Complete Your Memorial Order</h1>
            <p className="text-lg text-muted-foreground">
              You're just one step away from creating a beautiful memorial
            </p>
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
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Package className="h-4 w-4 text-accent" />
                    <span>Premium Packaging Included</span>
                  </div>
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted max-w-[350px] mx-auto">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/box1-ddkM8m6r7XISkEEH5qA6RU6DblzyIK.jpg"
                      alt="Custom Memorial Keepsake Box"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Your plaque will arrive beautifully packaged in a custom memorial box
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="boxPersonalization" className="text-sm font-semibold">
                    Personalize Your Box
                  </Label>
                  <Textarea
                    id="boxPersonalization"
                    name="boxPersonalization"
                    placeholder="In Memory of..."
                    value={formData.boxPersonalization}
                    onChange={handleTextareaChange}
                    maxLength={150}
                    rows={3}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">{formData.boxPersonalization.length}/150 characters</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Customize Your Memorial Plaque</h3>
                  <PlaqueColorSelector selectedColor={formData.plaqueColor} onColorChange={handleColorChange} />
                </div>

                <Separator />

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Custom QR Memorial Plaque</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Digital Memorial Website</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Lifetime Hosting Included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Free Shipping</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>$2.00</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/10 p-3 rounded-lg">
                  <Shield className="h-4 w-4 text-accent" />
                  <span>30-day money-back guarantee</span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
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
                      <Label htmlFor="lastName">Last Name *</Label>
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
                    <Label htmlFor="email">Email Address *</Label>
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
                    <h3 className="font-semibold">Shipping Address</h3>

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

              <SquarePaymentForm
                amount={2.0}
                orderId={`order_${Date.now()}`}
                onSuccess={handlePaymentSuccess}
                onError={(error) => {
                  console.error("Payment error:", error)
                }}
                onBeforePayment={validateForm}
                disabled={isSubmitting}
              />

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
