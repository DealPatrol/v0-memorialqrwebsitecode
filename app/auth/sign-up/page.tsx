"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react"
import { Header } from "@/components/header"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    // Validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const normalizedEmail = email.trim().toLowerCase()

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone?.trim() || null,
          },
        },
      })

      if (signUpError) {
        if (
          signUpError.message?.includes("User already registered") ||
          signUpError.message?.includes("already been registered")
        ) {
          setError("This email is already registered. Please sign in instead.")
        } else if (signUpError.message?.includes("rate limit")) {
          setError("Too many attempts. Please wait a few minutes and try again.")
        } else {
          setError(signUpError.message || "Sign-up failed. Please try again.")
        }
        setIsLoading(false)
        return
      }

      // Check if email confirmation is required
      if (data?.user && !data.session) {
        setSuccess("Account created! Please check your email to confirm your account.")
        setIsLoading(false)
        return
      }

      // If session exists, user is logged in immediately
      if (data?.session) {
        setSuccess("Account created! Redirecting to your dashboard...")
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 1500)
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-white">Create Account</CardTitle>
              <CardDescription className="text-zinc-400 text-base">
                Sign up to create and manage memorial pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-zinc-200">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={isLoading}
                        autoComplete="given-name"
                        className="pl-10 h-12 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-zinc-200">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isLoading}
                      autoComplete="family-name"
                      className="h-12 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-200">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      autoComplete="email"
                      className="pl-10 h-12 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-zinc-200">
                    Phone (Optional)
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isLoading}
                      autoComplete="tel"
                      className="pl-10 h-12 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-zinc-200">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      autoComplete="new-password"
                      className="pl-10 pr-10 h-12 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-zinc-200">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      autoComplete="new-password"
                      className="pl-10 h-12 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-950/50 border border-red-800 p-4 text-sm text-red-200">{error}</div>
                )}

                {success && (
                  <div className="rounded-lg bg-green-950/50 border border-green-800 p-4 text-sm text-green-200">
                    {success}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-base bg-purple-600 hover:bg-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                <div className="text-center text-zinc-400">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-medium">
                    Sign in here
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
