"use client"

import { useCallback, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Lock, Shield, CreditCard, Award } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeCheckoutProps {
  fetchClientSecret: () => Promise<string>
  onComplete?: () => void
}

export function StripeCheckout({ fetchClientSecret, onComplete }: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(true)

  const fetchSecret = useCallback(async () => {
    const secret = await fetchClientSecret()
    setIsLoading(false)
    return secret
  }, [fetchClientSecret])

  return (
    <Card>
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Secure Payment
        </CardTitle>
        <CardDescription>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
            <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
              <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
              <span>Stripe Secure</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
              <Award className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
              <span>30-Day Guarantee</span>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Loading payment form...</span>
          </div>
        )}
        <div id="checkout">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{
              fetchClientSecret: fetchSecret,
              onComplete: onComplete,
            }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </CardContent>
    </Card>
  )
}
