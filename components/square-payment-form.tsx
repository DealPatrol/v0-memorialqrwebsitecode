"use client"

import { useState } from "react"
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react'

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
      if (!token || !token.token) {
        throw new Error("Invalid payment token received from Square")
      }

      console.log("[v0] Processing payment for order:", orderId, "Amount:", amount)

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

      console.log("[v0] Payment response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.log("[v0] Payment error response:", errorData)
        throw new Error(errorData.error || "Payment processing failed. Please try again.")
      }

      const data = await response.json()
      console.log("[v0] Payment data:", data)

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

  const handlePaymentError = (errors: any) => {
    console.error("[v0] Square tokenization error:", errors)

    let errorMessage = "Unable to process card information. Please try again."

    if (errors && Array.isArray(errors) && errors.length > 0) {
      const error = errors[0]
      console.log("[v0] First error:", error)
      if (error.type === "VALIDATION_ERROR") {
        errorMessage = "Please check your card details and try again."
      } else if (error.message) {
        errorMessage = error.message
      }
    }

    toast({
      title: "Payment Error",
      description: errorMessage,
      variant: "destructive",
    })

    onError?.(errorMessage)
    setIsProcessing(false)
  }

  const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID
  const locId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID

  console.log("[v0] Square config check - AppId exists:", !!appId, "LocationId exists:", !!locId)

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>Enter your card details to complete the purchase</CardDescription>
      </CardHeader>
      <CardContent>
        <PaymentForm
          applicationId={appId}
          locationId={locId}
          cardTokenizeResponseReceived={handlePayment}
          createPaymentRequest={() => ({
            countryCode: "US",
            currencyCode: "USD",
            total: {
              amount: amount.toString(),
              label: "Total",
            },
          })}
        >
          <CreditCard
            buttonProps={{
              isLoading: isProcessing || disabled,
            }}
          />
        </PaymentForm>
        {(isProcessing || disabled) && (
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
