"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, ExternalLink } from "lucide-react"

const LOOKUP_KEY = "Standard_QR_Plaque-dc24166"

function SubscribeContent() {
  const searchParams = useSearchParams()
  const [success, setSuccess] = useState(false)
  const [sessionId, setSessionId] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (searchParams.get("success")) {
      setSuccess(true)
      setSessionId(searchParams.get("session_id") ?? "")
    }
    if (searchParams.get("canceled")) {
      setSuccess(false)
      setMessage("Order canceled — continue to shop around and checkout when you're ready.")
    }
  }, [searchParams])

  if (success && sessionId) {
    return <SuccessDisplay sessionId={sessionId} />
  }

  if (message) {
    return (
      <div className="max-w-md mx-auto text-center py-8">
        <p className="text-muted-foreground">{message}</p>
        <Button className="mt-4" onClick={() => setMessage("")}>
          Back to Plans
        </Button>
      </div>
    )
  }

  return <ProductDisplay />
}

function ProductDisplay() {
  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-xl border-2 border-accent/20">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl">Standard QR Plaque</CardTitle>
          <CardDescription>
            <span className="text-3xl font-bold text-foreground">$39.99</span>
            <span className="text-muted-foreground"> / month</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              "Unlimited QR code scans",
              "Digital memorial website hosting",
              "Photo & video storage",
              "Family sharing",
              "Cancel anytime",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          <form action="/api/stripe/create-checkout-session" method="POST" className="pt-2">
            <input type="hidden" name="lookup_key" value={LOOKUP_KEY} />
            <Button type="submit" className="w-full h-12 text-base font-semibold">
              Subscribe Now
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            Secure payment via Stripe. Cancel anytime in the billing portal.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function SuccessDisplay({ sessionId }: { sessionId: string }) {
  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-xl border-2 border-green-200">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">Subscription Active!</CardTitle>
          <CardDescription>
            You're now subscribed to Standard QR Plaque. Manage your billing information below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action="/api/stripe/create-portal-session" method="POST">
            <input type="hidden" name="session_id" value={sessionId} />
            <Button type="submit" variant="outline" className="w-full h-12 text-base gap-2">
              <ExternalLink className="h-4 w-4" />
              Manage Billing
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function SubscribeClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Memorial QR Subscription</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Keep your digital memorial active with a simple monthly subscription.
          </p>
        </div>
        <Suspense fallback={<div className="text-center text-muted-foreground">Loading...</div>}>
          <SubscribeContent />
        </Suspense>
      </main>
    </div>
  )
}
