"use client"

import { useState } from "react"
import { SquarePaymentForm } from "@/components/square-payment-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"

export default function TestSquarePage() {
  const [testAmount, setTestAmount] = useState(100) // $1.00 in cents
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const handlePaymentSuccess = (result: any) => {
    console.log("[v0] Payment successful:", result)
    setPaymentResult({
      success: true,
      message: `Payment successful! Transaction ID: ${result.payment?.id || "N/A"}`,
    })
  }

  const handlePaymentError = (error: string) => {
    console.log("[v0] Payment error:", error)
    setPaymentResult({
      success: false,
      message: `Payment failed: ${error}`,
    })
  }

  const resetTest = () => {
    setPaymentResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">Square Payment Test</h1>
          <p className="text-slate-600">
            Test your Square integration with a ${(testAmount / 100).toFixed(2)} transaction
          </p>
        </div>

        {paymentResult ? (
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {paymentResult.success ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    <span className="text-green-600">Payment Successful!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-red-600" />
                    <span className="text-red-600">Payment Failed</span>
                  </>
                )}
              </CardTitle>
              <CardDescription>{paymentResult.message}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={resetTest} className="w-full">
                Test Another Payment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Test Payment Form</CardTitle>
              <CardDescription>Use Square's test card: 4111 1111 1111 1111 (any future date, any CVV)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Test Card Details:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Card Number: 4111 1111 1111 1111</li>
                    <li>• Expiration: Any future date (e.g., 12/25)</li>
                    <li>• CVV: Any 3 digits (e.g., 123)</li>
                    <li>• ZIP: Any 5 digits (e.g., 12345)</li>
                  </ul>
                </div>

                <SquarePaymentForm 
                  amount={testAmount}
                  orderId={`TEST${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`}
                  onSuccess={handlePaymentSuccess} 
                  onError={handlePaymentError} 
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-slate-50">
          <CardHeader>
            <CardTitle className="text-lg">Environment Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Application ID:</span>
              <span className="font-mono text-slate-900">
                {process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID ? "✓ Set" : "✗ Missing"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Location ID:</span>
              <span className="font-mono text-slate-900">
                {process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ? "✓ Set" : "✗ Missing"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Environment:</span>
              <span className="font-mono text-slate-900">{process.env.SQUARE_ENVIRONMENT || "sandbox"}</span>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-slate-500">
          <p>This is a test page for Square payment integration.</p>
          <p>No real charges will be made in sandbox mode.</p>
        </div>
      </div>
    </div>
  )
}
