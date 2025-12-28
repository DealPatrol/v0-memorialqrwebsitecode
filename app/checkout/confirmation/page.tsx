"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Truck, Calendar } from "lucide-react"
import { getCheckoutSession } from "@/app/actions/payment"
import { getSupabaseBrowserClient } from "@/lib/supabase"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  const [orderId, setOrderId] = useState("")
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [estimatedDelivery, setEstimatedDelivery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Calculate estimated delivery date (5-7 business days from now)
    const today = new Date()
    const deliveryDate = new Date(today)
    deliveryDate.setDate(today.getDate() + 7) // 7 days from now

    // Format the date
    setEstimatedDelivery(
      deliveryDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    )

    // Fetch order details
    async function fetchOrderDetails() {
      if (!sessionId) {
        setError("No session ID found. Please try again.")
        setIsLoading(false)
        return
      }

      try {
        // Get session data from Stripe
        const session = await getCheckoutSession(sessionId)

        // Get order data from database
        const supabase = getSupabaseBrowserClient()
        const { data: order } = await supabase.from("orders").select("*").eq("stripe_session_id", sessionId).single()

        if (order) {
          setOrderId(order.id)
          setOrderDetails(order)
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching order details:", err)
        setError("Failed to load order information. Please contact support.")
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-2xl font-serif flex items-center justify-center">
            Memorial QR
            <span className="text-yellow-400 ml-1">★</span>
          </Link>
        </div>
      </header>

      {/* Checkout Steps */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
            <div className="text-gray-900 font-medium ml-2">Payment</div>
            <div className="w-16 h-1 bg-green-500 mx-2"></div>
            <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
            <div className="text-gray-900 font-medium ml-2">Account</div>
            <div className="w-16 h-1 bg-gray-900 mx-2"></div>
            <div className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center">3</div>
            <div className="text-gray-900 font-medium ml-2">Confirmation</div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-serif">Order Confirmed!</CardTitle>
              <CardDescription>Thank you for your purchase. Your order #{orderId} has been confirmed.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="font-medium">Order Processing</span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    In Progress
                  </span>
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="bg-green-500 w-6 h-6 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="h-1 bg-green-500"></div>
                    </div>
                    <div>
                      <div className="bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center">
                        <div className="h-2 w-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="h-1 bg-gray-300"></div>
                    </div>
                    <div>
                      <div className="bg-gray-300 w-6 h-6 rounded-full flex items-center justify-center">
                        <div className="h-2 w-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="h-1 bg-gray-300"></div>
                    </div>
                    <div>
                      <div className="bg-gray-300 w-6 h-6 rounded-full flex items-center justify-center">
                        <div className="h-2 w-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-600">
                    <div className="text-center w-16">
                      <p>Order Placed</p>
                    </div>
                    <div className="text-center w-16">
                      <p>Processing</p>
                    </div>
                    <div className="text-center w-16">
                      <p>Shipped</p>
                    </div>
                    <div className="text-center w-16">
                      <p>Delivered</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <Truck className="h-5 w-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Shipping Information</p>
                    <p className="text-gray-600 text-sm">
                      Your QR code will be shipped to the address you provided during checkout.
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      Estimated delivery: <span className="font-medium">{estimatedDelivery}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Next Steps</p>
                    <p className="text-gray-600 text-sm">
                      While your QR code is being prepared, you can start setting up your memorial page.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <Button asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-medium text-lg mb-4">What to expect next</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium">Manufacturing (1-2 days)</p>
                  <p className="text-gray-600 text-sm">Your weather-resistant QR code is being manufactured</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium">Shipping (3-5 days)</p>
                  <p className="text-gray-600 text-sm">Your QR code will be shipped via tracked delivery</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium">Delivery</p>
                  <p className="text-gray-600 text-sm">
                    You'll receive an email notification when your QR code is delivered
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t pt-6">
              <h4 className="font-medium mb-2">Need help?</h4>
              <p className="text-gray-600 text-sm mb-4">
                If you have any questions about your order, please contact our customer support team.
              </p>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Memorial QR. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/privacy" className="hover:text-gray-700">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-700">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-gray-700">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
