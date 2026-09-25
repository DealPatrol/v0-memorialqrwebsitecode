"use client"

import type React from "react"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Package, Mail, ArrowRight, UserPlus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order")
  const { toast } = useToast()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAccountPrompt, setShowAccountPrompt] = useState(false)
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [accountEmail, setAccountEmail] = useState("")
  const [accountPassword, setAccountPassword] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setIsAuthenticated(true)
        setShowAccountPrompt(false)
      } else {
        // Show account creation prompt after 2 seconds
        setTimeout(() => setShowAccountPrompt(true), 2000)
      }
    }

    checkAuth()
  }, [])

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreatingAccount(true)

    try {
      const supabase = createClient()

      const { data, error } = await supabase.auth.signUp({
        email: accountEmail,
        password: accountPassword,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error

      toast({
        title: "Account Created!",
        description: "Check your email to verify your account and access your memorial dashboard.",
      })

      setShowAccountPrompt(false)
      setIsAuthenticated(true)
    } catch (error: any) {
      toast({
        title: "Account Creation Failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingAccount(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <Card className="border-2 border-green-200">
        <CardHeader className="text-center pb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-600 mb-2">Order Complete!</CardTitle>
          <p className="text-muted-foreground text-lg">Thank you for your purchase</p>
          {orderId && <p className="text-sm text-muted-foreground mt-2">Order Number: {orderId}</p>}
        </CardHeader>

        <CardContent className="space-y-8">
          {showAccountPrompt && !isAuthenticated && (
            <Card className="border-2 border-blue-200 bg-blue-50/50">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserPlus className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Create Your Account</CardTitle>
                      <p className="text-sm text-muted-foreground">Manage your memorial and view order history</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setShowAccountPrompt(false)} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAccount} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-email">Email Address</Label>
                    <Input
                      id="account-email"
                      type="email"
                      value={accountEmail}
                      onChange={(e) => setAccountEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      disabled={isCreatingAccount}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-password">Create Password</Label>
                    <Input
                      id="account-password"
                      type="password"
                      value={accountPassword}
                      onChange={(e) => setAccountPassword(e.target.value)}
                      placeholder="Choose a secure password"
                      minLength={8}
                      required
                      disabled={isCreatingAccount}
                    />
                    <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" disabled={isCreatingAccount} className="flex-1">
                      {isCreatingAccount ? "Creating..." : "Create Account"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAccountPrompt(false)}
                      disabled={isCreatingAccount}
                    >
                      Skip for Now
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    You can create an account anytime to manage your memorials
                  </p>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Check Your Email</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent your order confirmation with all the details you need to get started with your memorial.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
              <Package className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Your Order is Being Prepared</h3>
                <p className="text-sm text-muted-foreground">
                  Your memorial products are being prepared and will ship soon. You'll receive tracking information via
                  email.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Next Steps:</h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
                <span>Check your email for order confirmation and memorial setup instructions</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                <span>
                  {isAuthenticated
                    ? "Access your dashboard to start uploading photos, videos, and memories"
                    : "Create an account (optional) to easily manage your memorial content"}
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
                <span>Your physical memorial products will be shipped to your address</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600 flex-shrink-0">4.</span>
                <span>Share the QR code with family and friends to celebrate your loved one's life</span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            {isAuthenticated ? (
              <Button asChild className="flex-1">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/login">Sign In to Dashboard</Link>
              </Button>
            )}
            <Button asChild variant="outline" className="flex-1 bg-transparent">
              <Link href="/store">Continue Shopping</Link>
            </Button>
          </div>

          <div className="text-center pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-2">Need help or have questions?</p>
            <Button asChild variant="link">
              <Link href="/help">Contact Support</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
        <OrderSuccessContent />
      </Suspense>
    </div>
  )
}
