"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Package, Mail, ArrowRight, Eye } from "lucide-react"
import Link from "next/link"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderNumber = searchParams.get("order")
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderNumber) {
      console.log("[v0] Confirmation - No order number in URL, redirecting to home")
      router.push("/")
      return
    }

    console.log("[v0] Confirmation - Fetching order details for:", orderNumber)

    // Fetch order details
    fetch(`/api/orders/${orderNumber}`)
      .then((res) => {
        console.log("[v0] Confirmation - Order fetch response status:", res.status)
        return res.json()
      })
      .then((data) => {
        console.log("[v0] Confirmation - Order fetch response data:", data)
        if (data.success) {
          setOrder(data.order)
        } else {
          console.error("[v0] Confirmation - Order fetch failed:", data.error)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error("[v0] Confirmation - Error fetching order:", error)
        setLoading(false)
      })
  }, [orderNumber, router])

  useEffect(() => {
    if (order) {
      sessionStorage.setItem(
        "pendingOrder",
        JSON.stringify({
          orderNumber: order.order_number,
          orderId: order.id,
          customerEmail: order.customer_email,
          customerName: order.customer_name,
          plaqueColor: order.plaque_color,
          planType: order.plan_type,
        }),
      )
    }
  }, [order])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your order...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-xl text-muted-foreground mb-6">
            We couldn't find your order. Please check your email for confirmation details.
          </p>
          <Button onClick={() => router.push("/")}>Return Home</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-xl text-muted-foreground">Thank you for your purchase, {order.customer_name}</p>
        </div>

        {order.memorial_id && (
          <Card className="p-8 mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
            <div className="text-center">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-3">Your Memorial is Live! 🎉</h2>
              <p className="text-lg mb-6 opacity-90">
                Your digital memorial has been created and is ready to view and share with family and friends.
              </p>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
                <Link href={`/memorial/${order.memorial_id}`}>
                  <Eye className="mr-2 h-5 w-5" />
                  View Memorial Page
                </Link>
              </Button>
            </div>
          </Card>
        )}

        {/* Order Details Card */}
        <Card className="p-8 mb-6">
          <div className="flex items-center justify-between mb-6 pb-6 border-b">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Order Number</p>
              <p className="text-2xl font-bold">{order.order_number}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
              <p className="text-2xl font-bold text-primary">${(order.amount_cents / 100).toFixed(2)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Order Details</h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Product:</span>
                  <span className="font-medium">{order.product_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-medium capitalize">{order.plan_type} Payment</span>
                </div>
                {order.plan_type === "monthly" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Monthly:</span>
                    <span className="font-medium">${(order.monthly_amount_cents / 100).toFixed(2)}/month</span>
                  </div>
                )}
                {order.addon_wooden_qr && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Add-on:</span>
                    <span className="font-medium">Wooden QR Code</span>
                  </div>
                )}
                {order.addon_picture_plaque && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Add-on:</span>
                    <span className="font-medium">Picture Plaque</span>
                  </div>
                )}
                {order.addon_stone_qr && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Add-on:</span>
                    <span className="font-medium">Stone QR Code</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm">{order.shipping_address_line1}</p>
                {order.shipping_address_line2 && <p className="text-sm">{order.shipping_address_line2}</p>}
                <p className="text-sm">
                  {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Check Your Email</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a confirmation email to <strong>{order.customer_email}</strong> with your order details and
                  next steps.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Shipping Timeline</h3>
                <p className="text-sm text-muted-foreground">
                  Your memorial plaque will be carefully crafted and shipped within 3-5 business days. You'll receive
                  tracking information via email.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {!order.memorial_id && (
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-3">Create Your Memorial Now</h2>
              <p className="text-muted-foreground mb-6">
                Start building your loved one's memorial page. Add photos, stories, and memories that will be accessible
                through your QR code plaque.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/create-memorial">
                    Create Memorial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/">Return Home</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Want to manage your memorial later?{" "}
                <Link href="/auth/sign-up" className="text-primary hover:underline font-medium">
                  Create a free account
                </Link>
              </p>
            </div>
          </Card>
        )}

        {order.memorial_id && (
          <Card className="p-6 bg-muted/50">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Want to Manage Your Memorial?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create a free account to edit your memorial, add more content, and track your order anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/auth/sign-up">Create Free Account</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/">Return Home</Link>
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Support */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            Questions about your order?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
