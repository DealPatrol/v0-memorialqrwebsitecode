"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react"

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <Card className="border-2 border-green-200">
        <CardHeader className="text-center pb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-600 mb-2">Order Complete!</CardTitle>
          <p className="text-muted-foreground text-lg">Thank you for your purchase</p>
          {orderId && <p className="text-sm text-muted-foreground mt-2">Order ID: {orderId}</p>}
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Check Your Email</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent order confirmation and memorial dashboard login credentials to your email address.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
              <Package className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Your Order is Being Prepared</h3>
                <p className="text-sm text-muted-foreground">
                  Your memorial products will ship within 3-5 business days. You'll receive tracking information via
                  email.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Next Steps:</h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
                <span>Check your email for login credentials to your memorial dashboard</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                <span>Start uploading photos, videos, and memories to create your digital memorial</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
                <span>Your physical memorial products will arrive at your door within 5-7 business days</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 flex-shrink-0">4.</span>
                <span>Share the QR code with family and friends to celebrate your loved one's life</span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button asChild className="flex-1">
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 bg-transparent">
              <Link href="/store">Continue Shopping</Link>
            </Button>
          </div>

          <div className="text-center pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-2">Need help or have questions?</p>
            <Button asChild variant="link">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
        <OrderSuccessContent />
      </Suspense>
    </div>
  )
}
