"use client"

import { useState } from "react"
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface SquarePaymentFormProps {
  amount: number
  orderId: string
  onSuccess?: (paymentId: string) => void
  onError?: (error: string) => void
}

export function SquarePaymentForm({ amount, orderId, onSuccess, onError }: SquarePaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handlePayment = async (token: any) => {
    console.log("[v0] Payment token received")
    setIsProcessing(true)

    try {
      console.log("[v0] Sending payment request to API")
      const response = await fetch("/api/square/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceId: token.token,
          amount,
          orderId,
        }),
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response headers:", Object.fromEntries(response.headers.entries()))

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("[v0] Non-JSON response received:", text)
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`)
      }

      const data = await response.json()
      console.log("[v0] Payment response:", { success: data.success, error: data.error })

      if (data.success) {
        toast({
          title: "Payment Successful",
          description: "Your order has been processed successfully.",
        })
        onSuccess?.(data.payment.id)
      } else {
        throw new Error(data.error || "Payment failed")
      }
    } catch (error: any) {
      console.error("[v0] Payment error:", error)
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment.",
        variant: "destructive",
      })
      onError?.(error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || !process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Configuration Required</CardTitle>
          <CardDescription>Square payment credentials are not configured.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please add NEXT_PUBLIC_SQUARE_APPLICATION_ID and NEXT_PUBLIC_SQUARE_LOCATION_ID environment variables.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>Enter your card details to complete the purchase</CardDescription>
      </CardHeader>
      <CardContent>
        <PaymentForm
          applicationId={process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID}
          locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID}
          cardTokenizeResponseReceived={handlePayment}
        >
          <CreditCard />
          <Button type="submit" className="w-full mt-4" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay $${amount.toFixed(2)}`
            )}
          </Button>
        </PaymentForm>
      </CardContent>
    </Card>
  )
}
