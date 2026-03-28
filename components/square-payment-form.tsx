"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import dynamic from "next/dynamic"

const PaymentForm = dynamic(
  () =>
    import("react-square-web-payments-sdk")
      .then((mod) => mod.PaymentForm)
      .catch((err) => {
        console.error("[v0] Failed to load Square PaymentForm:", err)
        return () => null
      }),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    ),
  },
)

const CreditCard = dynamic(
  () =>
    import("react-square-web-payments-sdk")
      .then((mod) => mod.CreditCard)
      .catch((err) => {
        console.error("[v0] Failed to load Square CreditCard:", err)
        return () => null
      }),
  { ssr: false },
)

interface SquarePaymentFormProps {
  amount: number
  orderId: string
  onSuccess?: (paymentId: string, cardId?: string, customerId?: string) => void
  onError?: (error: string) => void
  onBeforePayment?: () => boolean
  disabled?: boolean
  customerEmail?: string
  customerName?: string
}

export function SquarePaymentForm({
  amount,
  orderId,
  onSuccess,
  onError,
  onBeforePayment,
  disabled,
  customerEmail,
  customerName,
}: SquarePaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isSDKReady, setIsSDKReady] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setIsMounted(true)
    const timer = setTimeout(() => {
      setIsSDKReady(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handlePayment = async (token: any) => {
    try {
      if (onBeforePayment && !onBeforePayment()) {
        return
      }

      setIsProcessing(true)

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
          verificationToken: token.details?.card?.verification_token,
          customerEmail,
          customerName,
        }),
      })

      console.log("[v0] Payment response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.log("[v0] Payment error response:", errorData)
        throw new Error(errorData.error || "Payment processing failed. Please try again.")
      }

      const data = await response.json()
      console.log("[v0] Payment successful:", data.payment?.id)

      if (data.success) {
        toast({
          title: "Payment Successful",
          description: "Your order has been processed successfully.",
        })
        onSuccess?.(data.payment.id, data.cardId, data.customerId)
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
      setIsProcessing(false)
    }
  }

  const handlePaymentError = (errors: any) => {
    console.error("[v0] Square tokenization error:", errors)

    let errorMessage = "Unable to process card information. Please check your details and try again."

    try {
      if (errors) {
        if (Array.isArray(errors) && errors.length > 0) {
          const error = errors[0]
          console.log("[v0] First error:", error)
          if (error.type === "VALIDATION_ERROR") {
            errorMessage = "Please check your card details and try again."
          } else if (error.message) {
            errorMessage = error.message
          }
        } else if (errors.message) {
          errorMessage = errors.message
        } else if (typeof errors === "string") {
          errorMessage = errors
        }
      }
    } catch (e) {
      console.error("[v0] Error parsing Square error:", e)
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

  if (!isMounted || !isSDKReady) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Loading secure payment form...</span>
      </div>
    )
  }

  if (!appId || !locId) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900">Payment Configuration Required</CardTitle>
          <CardDescription className="text-red-700">Square payment credentials are not configured.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">
            Please add NEXT_PUBLIC_SQUARE_APPLICATION_ID and NEXT_PUBLIC_SQUARE_LOCATION_ID environment variables in the
            Vars section of your project settings.
          </p>
        </CardContent>
      </Card>
    )
  }

  try {
    return (
      <div>
        <PaymentForm
          applicationId={appId}
          locationId={locId}
          cardTokenizeResponseReceived={handlePayment}
          createPaymentRequest={() => ({
            countryCode: "CA",
            currencyCode: "CAD",
            total: {
              amount: amount.toFixed(2),
              label: "Total",
            },
          })}
        >
          <CreditCard
            buttonProps={{
              isLoading: isProcessing || disabled,
              css: {
                backgroundColor: isProcessing || disabled ? "#9ca3af" : "#2563eb",
                fontSize: "16px",
                color: "#fff",
                "&:hover": {
                  backgroundColor: isProcessing || disabled ? "#9ca3af" : "#1d4ed8",
                },
              },
            }}
          />
        </PaymentForm>
        {(isProcessing || disabled) && (
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing your payment securely...</span>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("[v0] Square SDK render error:", error)
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-900">Payment Form Loading Issue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-yellow-700 mb-4">
            There was a temporary issue loading the payment form. Please refresh the page to try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </CardContent>
      </Card>
    )
  }
}
