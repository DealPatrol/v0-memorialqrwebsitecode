"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { getCheckoutSession } from "@/app/actions/payment"

export default function CreateAccountPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  const [orderId, setOrderId] = useState<string>("")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch session data
  useEffect(() => {
    async function fetchSessionData() {
      if (!sessionId) {
        setError("No session ID found. Please try again.")
        setIsLoadingSession(false)
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
        }

        // Pre-fill email if available
        if (session.customer_email) {
          setEmail(session.customer_email)
        }

        setIsLoadingSession(false)
      } catch (err) {
        console.error("Error fetching session data:", err)
        setError("Failed to load order information. Please contact support.")
        setIsLoadingSession(false)
      }
    }

    fetchSessionData()
  }, [sessionId])

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            order_id: orderId,
          },
        },
      })

      if (signUpError) {
        throw signUpError
      }

      // Link the user to the order
      if (data.user) {
        await supabase.from("orders").update({ user_id: data.user.id }).eq("id", orderId)
      }

      // Redirect to confirmation page
      router.push(`/checkout/confirmation?session_id=${sessionId}`)
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order information...</p>
        </div>
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
            <div className="w-16 h-1 bg-gray-900 mx-2"></div>
            <div className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center">2</div>
            <div className="text-gray-900 font-medium ml-2">Account</div>
            <div className="w-16 h-1 bg-gray-300 mx-2"></div>
            <div className="bg-gray-300 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center">3</div>
            <div className="text-gray-600 ml-2">Confirmation</div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-serif">Payment Successful!</CardTitle>
              <CardDescription>
                Your order has been placed. Create your account to track your order and manage your memorial.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start mb-6">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t pt-4">
              <div className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link href={`/login?session_id=${sessionId}`} className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign in instead
                </Link>
              </div>
            </CardFooter>
          </Card>

          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-medium text-lg mb-4">What happens next?</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium">Create your account</p>
                  <p className="text-gray-600 text-sm">Set up your account to access your memorial dashboard</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium">We'll prepare your QR code</p>
                  <p className="text-gray-600 text-sm">Your weather-resistant QR code will be manufactured</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium">Delivery to your address</p>
                  <p className="text-gray-600 text-sm">Your QR code will be shipped to the address you provided</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <p className="font-medium">Set up your memorial page</p>
                  <p className="text-gray-600 text-sm">Create your memorial page with photos, videos, and stories</p>
                </div>
              </div>
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
