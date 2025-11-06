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
  onBeforePayment?: () => boolean
  disabled?: boolean
}

export function SquarePaymentForm({
  amount,
  orderId,
  onSuccess,
  onError,
  onBeforePayment,
  disabled,
}: SquarePaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handlePayment = async (token: any) => {
    if (onBeforePayment && !onBeforePayment()) {
      return
    }

    setIsProcessing(true)

    try {
      console.log("[v0] Starting payment with token:", token)
      console.log("[v0] Payment details:", { amount, orderId })

      if (!token || !token.token) {
        throw new Error("Invalid payment token received from Square")
      }

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
      console.log("[v0] Content-Type:", contentType)

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.log("[v0] Non-JSON response body:", text)
        throw new Error("Server returned an invalid response. Please try again.")
      }

      const data = await response.json()
      console.log("[v0] Response data:", data)

      if (data.success) {
        toast({
          title: "Payment Successful",
          description: "Your order has been processed successfully.",
        })
        onSuccess?.(data.payment.id)
      } else {
        let errorMessage = data.error || "Payment failed"

        // Provide user-friendly messages for common errors
        if (data.errorCode === "INVALID_CARD_DATA") {
          errorMessage = "Invalid card information. Please check your card details and try again."
        } else if (data.errorCode === "CARD_DECLINED") {
          errorMessage = "Your card was declined. Please try a different payment method."
        } else if (data.errorCode === "INSUFFICIENT_FUNDS") {
          errorMessage = "Insufficient funds. Please try a different payment method."
        } else if (errorMessage.includes("source_id")) {
          errorMessage = "Payment token expired. Please try again."
        }

        throw new Error(errorMessage)
      }
    } catch (error: any) {
      console.error("[v0] Payment error:", error)
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment.",
        variant: "destructive",
      })
      onError?.(error.message)
      setIsProcessing(false)
    }
  }

  const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID
  const locId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID

  if (!appId || !locId) {
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

  console.log("[v0] Square Payment Form initialized with:", {
    appIdPrefix: appId.substring(0, 10),
    locIdPrefix: locId.substring(0, 10),
    amount,
    orderId,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>Enter your card details to complete the purchase</CardDescription>
      </CardHeader>
      <CardContent>
        <PaymentForm applicationId={appId} locationId={locId} cardTokenizeResponseReceived={handlePayment}>
          <CreditCard />
          <Button type="submit" className="w-full mt-4" disabled={isProcessing || disabled}>
            {isProcessing || disabled ? (
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
