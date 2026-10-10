"use client"

import { Suspense } from "react"
import type React from "react"
import { useState, useEffect, useRef } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { readStoredAttribution } from "@/components/attribution-capture"
import { trackCommerce } from "@/components/track-commerce"
import { purchaseAfterPayment } from "@/lib/ad-events"
import { orderNotesHint } from "@/lib/catalog"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { formatUsd } from "@/lib/site"
import { GIFT_MESSAGE_MAX } from "@/lib/gift-order"

type CartLine = { id: string; name: string; price: number; quantity: number; ships: boolean }

type SellableRow = { id: string; name: string; price: number; ships: boolean }

function lineFromSellable(catalog: Map<string, SellableRow>, id: string, quantity: number): CartLine | null {
  const product = catalog.get(id)
  if (!product) return null
  return { id: product.id, name: product.name, price: product.price, quantity, ships: product.ships }
}

function CheckoutForm() {
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()

  const [cartItems, setCartItems] = useState<CartLine[]>([])
  const [orderTotal, setOrderTotal] = useState(0)
  const [checkoutAttemptId] = useState(() => `order_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`)
  const [checkoutBlocked, setCheckoutBlocked] = useState(true)
  const [rejectedProduct, setRejectedProduct] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function loadCart() {
      const response = await fetch("/api/catalog/sellable")
      const payload = (await response.json()) as { products?: SellableRow[] }
      const catalog = new Map((payload.products ?? []).map((product) => [product.id, product]))
      const storedItems = localStorage.getItem("checkoutItems")
      let items: CartLine[] = []
      let rejected = false

      if (storedItems) {
        const parsed = JSON.parse(storedItems) as Array<{ id: string; quantity: number }>
        items = parsed.flatMap((item) => {
          const line = lineFromSellable(catalog, item.id, item.quantity)
          if (!line) rejected = true
          return line ? [line] : []
        })
      } else {
        const productId = searchParams.get("product")
        if (productId) {
          const line = lineFromSellable(catalog, productId, 1)
          if (line) items = [line]
          else rejected = true
        }
      }

      if (cancelled) return
      if (rejected) localStorage.removeItem("checkoutItems")
      setRejectedProduct(rejected)
      setCheckoutBlocked(items.length === 0)
      setCartItems(items)
      setOrderTotal(items.reduce((sum, item) => sum + item.price * item.quantity, 0))
    }
    loadCart().catch(() => {
      if (!cancelled) setCheckoutBlocked(true)
    })
    return () => {
      cancelled = true
    }
    // Prices come from the server catalog. Missing supplier env keeps a product out of that list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    customization: "",
    isGift: false,
    recipientName: "",
    giftMessage: "",
    shipToRecipient: false,
    recipientAddress: "",
    recipientAddress2: "",
    recipientCity: "",
    recipientState: "",
    recipientZip: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const checkoutTracked = useRef(false)

  useEffect(() => {
    if (checkoutBlocked || orderTotal <= 0 || checkoutTracked.current) return
    checkoutTracked.current = true
    trackCommerce({ name: "InitiateCheckout", value: orderTotal, currency: "USD" })
  }, [checkoutBlocked, orderTotal])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Digital-only carts ship nothing, so the address block is hidden and not required.
  const needsShipping = cartItems.some((item) => item.ships)

  const validateForm = () => {
    if (!formData.email) {
      toast({
        title: "Missing Information",
        description: "Please enter your email address before proceeding with payment.",
        variant: "destructive",
      })
      return false
    }

    const shipToRecipient = needsShipping && formData.isGift && formData.shipToRecipient
    const shipAddress = shipToRecipient ? formData.recipientAddress : formData.address
    const shipCity = shipToRecipient ? formData.recipientCity : formData.city
    const shipState = shipToRecipient ? formData.recipientState : formData.state
    const shipZip = shipToRecipient ? formData.recipientZip : formData.zipCode

    if (needsShipping && (!formData.fullName.trim() || !shipAddress || !shipCity || !shipState || !shipZip)) {
      toast({
        title: "Missing Information",
        description: shipToRecipient
          ? "Enter your name, the recipient's name, and the recipient's full US shipping address before payment."
          : "Please enter the name and the full US shipping address before payment.",
        variant: "destructive",
      })
      return false
    }

    if (needsShipping && formData.isGift && !formData.recipientName.trim()) {
      toast({
        title: "Recipient name",
        description: "Enter the name of the person this gift is for.",
        variant: "destructive",
      })
      return false
    }
    if (needsShipping && formData.isGift && formData.giftMessage.trim().length > GIFT_MESSAGE_MAX) {
      toast({
        title: "Gift message",
        description: `Keep the gift message to ${GIFT_MESSAGE_MAX} characters or fewer.`,
        variant: "destructive",
      })
      return false
    }

    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        })
        return false
      }
    }

    if (needsShipping && !/^[A-Za-z]{2}$/.test(shipState.trim())) {
      toast({
        title: "US state required",
        description: "Enter a 2-letter state code. We ship only in the United States.",
        variant: "destructive",
      })
      return false
    }
    if (needsShipping && !/^\d{5}(-\d{4})?$/.test(shipZip.trim())) {
      toast({
        title: "US ZIP required",
        description: "Enter a 5-digit ZIP code. We ship only in the United States.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handlePaymentSuccess = async (paymentId: string, cardId?: string, customerId?: string) => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const shipToRecipient = needsShipping && formData.isGift && formData.shipToRecipient
      const orderData = {
        planType: "cart-checkout",
        items: cartItems,
        totalAmount: orderTotal,
        customerName: needsShipping ? formData.fullName.trim() : "",
        customerEmail: formData.email || "",
        customerPhone: formData.phone || "",
        addressLine1: needsShipping && !shipToRecipient ? formData.address : "",
        addressLine2: needsShipping && !shipToRecipient ? formData.address2 || "" : "",
        city: needsShipping && !shipToRecipient ? formData.city : "",
        state: needsShipping && !shipToRecipient ? formData.state : "",
        zip: needsShipping && !shipToRecipient ? formData.zipCode : "",
        paymentId: paymentId,
        customization: formData.customization || "",
        isGift: needsShipping && formData.isGift,
        recipientName: needsShipping && formData.isGift ? formData.recipientName.trim() : "",
        giftMessage: needsShipping && formData.isGift ? formData.giftMessage.trim() : "",
        shipToRecipient,
        recipientAddressLine1: shipToRecipient ? formData.recipientAddress : "",
        recipientAddressLine2: shipToRecipient ? formData.recipientAddress2 : "",
        recipientCity: shipToRecipient ? formData.recipientCity : "",
        recipientState: shipToRecipient ? formData.recipientState : "",
        recipientZip: shipToRecipient ? formData.recipientZip : "",
        cardId: cardId,
        squareCustomerId: customerId,
        attribution: readStoredAttribution(),
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

      const purchase = purchaseAfterPayment({
        success: true,
        amount: result.order?.amount,
        currency: result.order?.currency,
        orderNumber: result.order?.orderNumber,
        contentId: cartItems.length === 1 ? cartItems[0].id : undefined,
      })
      if (purchase) trackCommerce(purchase)

      localStorage.removeItem("checkoutItems")
      
      // Store payment data in session storage for account creation
      sessionStorage.setItem("postPaymentData", JSON.stringify({
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        address2: formData.address2,
        city: formData.city,
        state: formData.state,
        zip: formData.zipCode,
        orderId: result.order.id,
        orderNumber: result.order.orderNumber,
      }))

      toast({
        title: "Payment Successful!",
        description: "Now let's create your account to access your memorial.",
      })

      // Redirect to account creation instead of order success
      router.push(`/auth/create-account?order=${result.order.id}`)
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

  if (checkoutBlocked) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {rejectedProduct ? "This product is not available" : "Choose a QR memorial keepsake"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {rejectedProduct
              ? "We are not selling that item right now. See the keepsakes that are available."
              : `Every QR memorial keepsake includes ${HOSTING_INCLUDED_YEARS} years of hosting for its memorial page. One payment, no recurring fees.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/store" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-primary-foreground">
              See Keepsakes
            </Link>
            <Link href="/concierge" className="inline-flex items-center justify-center rounded-md border px-6 py-3">
              Have Us Build It
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Complete Your Purchase</h1>
          <p className="text-lg text-muted-foreground">Secure one-time checkout</p>
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
                {cartItems.map((item, index) => (
                  <div key={index} className="pb-3 border-b border-gray-200 dark:border-gray-800">
                    <div className="text-sm font-medium text-foreground mb-1">{item.name}</div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Qty: {item.quantity}</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {formatUsd(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200 dark:border-blue-800">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-blue-900 dark:text-blue-100 font-medium">Memorial Page Hosting:</span>
                    <span className="font-semibold text-blue-900 dark:text-blue-100">{HOSTING_INCLUDED_YEARS} years included</span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                    Hosting starts on the order date. <strong>No recurring fees.</strong>
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Includes: Unlimited photos, videos & memorial content hosting
                  </p>
                </div>

                <Separator />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold">Due Today:</span>
                  <span className="text-2xl font-bold text-blue-600">{formatUsd(orderTotal)}</span>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  One-time payment. Nothing else is charged later.
                </p>
              </div>

              <Separator />

              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground text-xs mb-2">What's Included:</p>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>A digital memorial page for photos, stories, and messages</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{HOSTING_INCLUDED_YEARS} years of memorial page hosting included</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Unlimited photos, videos & memories</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>No subscription and no recurring charges</span>
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
                <CardTitle>{needsShipping ? "Shipping & Contact Information" : "Contact Information"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {needsShipping && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      Full name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Jane Doe"
                      autoComplete="name"
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.isGift
                        ? "Your name. Order email goes to you."
                        : "Name for the keepsake shipment"}
                    </p>
                  </div>
                )}

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
                      placeholder="john.doe@example.com"
                      autoComplete="email"
                    />
                    <p className="text-xs text-muted-foreground">For order updates and account recovery</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
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

                {!needsShipping ? (
                  <p className="text-sm text-muted-foreground">
                    Nothing is shipped for this order, so no mailing address is needed. Enter your card details and
                    billing ZIP code in the secure payment form below.
                  </p>
                ) : formData.isGift && formData.shipToRecipient ? (
                  <p className="text-sm text-muted-foreground">
                    We will ship the keepsake to the recipient. Enter their address below.
                  </p>
                ) : (
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">US shipping address</h3>
                  <p className="text-sm text-muted-foreground">Ships to United States addresses only.</p>
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
                        State (2-letter code) <span className="text-red-500">*</span>
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
                )}

                {needsShipping ? (
                  <div className="space-y-4 rounded-md border p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="isGift"
                        checked={formData.isGift}
                        onCheckedChange={(checked) =>
                          setFormData((current) => ({ ...current, isGift: checked === true }))
                        }
                      />
                      <div>
                        <Label htmlFor="isGift" className="font-normal">
                          This order is a gift
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Add the recipient&apos;s name and a short message. Use their address if it is different from yours.
                        </p>
                      </div>
                    </div>
                    {formData.isGift ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="recipientName">
                            Recipient&apos;s name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="recipientName"
                            name="recipientName"
                            value={formData.recipientName}
                            onChange={handleInputChange}
                            placeholder="Grace Hopper"
                            autoComplete="name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="giftMessage">Gift message (optional)</Label>
                          <Textarea
                            id="giftMessage"
                            name="giftMessage"
                            value={formData.giftMessage}
                            onChange={handleInputChange}
                            placeholder="A short note for the person this is for."
                            rows={3}
                            maxLength={GIFT_MESSAGE_MAX}
                          />
                          <p className="text-xs text-muted-foreground">
                            Saved with the order for the person who packs the keepsake. It is not engraved. {GIFT_MESSAGE_MAX} characters at most.
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="shipToRecipient"
                            checked={formData.shipToRecipient}
                            onCheckedChange={(checked) =>
                              setFormData((current) => ({ ...current, shipToRecipient: checked === true }))
                            }
                          />
                          <Label htmlFor="shipToRecipient" className="font-normal">
                            Ship to the recipient&apos;s address
                          </Label>
                        </div>
                        {formData.shipToRecipient ? (
                          <div className="space-y-4">
                            <h3 className="font-semibold text-sm">Recipient&apos;s US shipping address</h3>
                            <div className="space-y-2">
                              <Label htmlFor="recipientAddress">
                                Street Address <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="recipientAddress"
                                name="recipientAddress"
                                value={formData.recipientAddress}
                                onChange={handleInputChange}
                                placeholder="123 Main Street"
                                autoComplete="shipping street-address"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="recipientAddress2">Apartment, Suite, etc.</Label>
                              <Input
                                id="recipientAddress2"
                                name="recipientAddress2"
                                value={formData.recipientAddress2}
                                onChange={handleInputChange}
                                placeholder="Apt 4B"
                                autoComplete="shipping address-line2"
                              />
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="recipientCity">
                                  City <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="recipientCity"
                                  name="recipientCity"
                                  value={formData.recipientCity}
                                  onChange={handleInputChange}
                                  placeholder="New York"
                                  autoComplete="shipping address-level2"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="recipientState">
                                  State <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="recipientState"
                                  name="recipientState"
                                  value={formData.recipientState}
                                  onChange={handleInputChange}
                                  placeholder="NY"
                                  maxLength={2}
                                  autoComplete="shipping address-level1"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="recipientZip">
                                  ZIP Code <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="recipientZip"
                                  name="recipientZip"
                                  value={formData.recipientZip}
                                  onChange={handleInputChange}
                                  placeholder="10001"
                                  autoComplete="shipping postal-code"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            We will ship the keepsake to your address so you can give it yourself.
                          </p>
                        )}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="customization">Memorial Customization (Optional)</Label>
                  <Textarea
                    id="customization"
                    name="customization"
                    value={formData.customization}
                    onChange={handleInputChange}
                    placeholder="Names, dates, and anything our team should know about the memorial."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">{orderNotesHint(cartItems.map((item) => item.id))}</p>
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
                    <span className="font-medium">Secure HTTPS</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Payments processed by Square</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">30-Day Money-Back Guarantee</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <SquarePaymentForm
                  amount={orderTotal}
                  orderId={checkoutAttemptId}
                  items={cartItems.map((item) => ({ id: item.id, quantity: item.quantity }))}
                  onSuccess={handlePaymentSuccess}
                  onError={(error) => {
                    console.error("[v0] Payment error:", error)
                  }}
                  onBeforePayment={validateForm}
                  disabled={isSubmitting}
                  customerEmail={formData.email}
                  customerName={needsShipping ? formData.fullName.trim() : ""}
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
