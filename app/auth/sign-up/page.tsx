"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    console.log("[v0] Starting sign-up process for:", email)

    try {
      console.log("[v0] Creating Square customer...")
      const squareResponse = await fetch("/api/square/create-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          givenName: firstName,
          familyName: lastName,
          phoneNumber: phone || undefined,
        }),
      })

      const squareData = await squareResponse.json()

      if (!squareData.success) {
        console.error("[v0] Square customer creation failed:", squareData.error)
        setError(`Failed to create payment account: ${squareData.error}`)
        setIsLoading(false)
        return
      }

      const squareCustomerId = squareData.customer.id
      console.log("[v0] Square customer created:", squareCustomerId)

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
          data: {
            square_customer_id: squareCustomerId,
            first_name: firstName,
            last_name: lastName,
            phone: phone || null,
          },
        },
      })

      console.log("[v0] Sign-up response:", { data: signUpData, error: signUpError })

      if (signUpError) {
        console.error("[v0] Sign-up error details:", signUpError)

        if (
          signUpError.message?.includes("Email signups are disabled") ||
          signUpError.message?.includes("email_provider_disabled")
        ) {
          setError("Sign-ups are currently disabled. Please contact support@memorialsqr.com")
          setIsLoading(false)
          return
        }

        if (
          signUpError.message?.includes("User already registered") ||
          signUpError.message?.includes("already been registered")
        ) {
          setError("This email is already registered. Please sign in instead.")
          setIsLoading(false)
          return
        }

        if (signUpError.message?.includes("rate limit")) {
          setError("Too many attempts. Please wait a few minutes and try again.")
          setIsLoading(false)
          return
        }

        setError(`Sign-up failed: ${signUpError.message}`)
        setIsLoading(false)
        return
      }

      if (signUpData?.user && !signUpData.session) {
        console.log("[v0] Email confirmation required")
        setError("✓ Account created! Please check your email to confirm your account.")
        setIsLoading(false)
        return
      }

      if (signUpData?.session) {
        console.log("[v0] Sign-up successful, redirecting...")
        if (redirect) {
          router.push(decodeURIComponent(redirect))
        } else {
          router.push("/dashboard")
        }
      }
    } catch (error: unknown) {
      console.error("[v0] Unexpected error during sign-up:", error)
      const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred"
      setError(`Error: ${errorMessage}`)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              {redirect?.includes("create-memorial")
                ? "Create your account to continue with your memorial"
                : "Sign up to manage your memorials"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isLoading}
                      autoComplete="given-name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isLoading}
                      autoComplete="family-name"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                    autoComplete="tel"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                </div>
                {error && (
                  <div
                    className={`rounded-md p-3 text-sm border ${
                      error.startsWith("✓")
                        ? "bg-green-50 text-green-800 border-green-200"
                        : "bg-red-50 text-red-800 border-red-200"
                    }`}
                  >
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link
                  href={`/auth/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
                  className="underline underline-offset-4 text-purple-600 hover:text-purple-700"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
