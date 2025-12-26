"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Mail } from "lucide-react"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const [orderInfo, setOrderInfo] = useState<{
    customerName?: string
    customerEmail?: string
  } | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem("pendingOrder")
    if (stored) {
      setOrderInfo(JSON.parse(stored))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <Header />

      <main className="container max-w-2xl mx-auto px-4 py-12">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl">Payment Successful!</CardTitle>
            <CardDescription className="text-base">
              Thank you for your order{orderInfo?.customerName ? `, ${orderInfo.customerName}` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {orderInfo?.customerEmail && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Confirmation sent to {orderInfo.customerEmail}</span>
              </div>
            )}

            <div className="bg-muted/50 rounded-lg p-4 text-left space-y-2">
              <h3 className="font-semibold">What happens next?</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>1. Create your memorial page with photos, videos, and stories</li>
                <li>2. We'll ship your QR plaque within 3-5 business days</li>
                <li>3. Scan the QR code to view your memorial anytime</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg">
                <Link href="/create-memorial">
                  Create Memorial <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
