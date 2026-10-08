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
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react"
import { Header } from "@/components/header"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false)
  const [loginMethod, setLoginMethod] = useState<"magic" | "password">("magic")
  const router = useRouter()

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsMagicLinkLoading(true)
    setError(null)
    setSuccess(null)

    const supabase = createClient()

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        if (authError.message.includes("Database error saving new user")) {
          setSuccess(
            "Check your email! We sent you a magic link to sign in. If you don't see it, check your spam folder.",
          )
        } else if (authError.message.includes("Too many requests")) {
          setError("Too many login attempts. Please wait a few minutes and try again.")
        } else {
          setError(authError.message)
        }
        return
      }

      setSuccess(
        "Check your email! We sent you a magic link to sign in. Click the link to access your account. Don't forget to check your spam folder!",
      )
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsMagicLinkLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const supabase = createClient()

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          setError("Incorrect email or password. Try the Magic Link option instead!")
        } else if (authError.message.includes("Email not confirmed")) {
          setError("Please check your email and click the confirmation link before signing in.")
        } else {
          setError(authError.message)
        }
        return
      }

      if (data?.user) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
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
              <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
              <CardDescription className="text-zinc-400 text-base">
                Sign in to manage your memorial pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setLoginMethod("magic")}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                    loginMethod === "magic" ? "bg-purple-600 text-white" : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Sparkles className="inline-block w-4 h-4 mr-2" />
                  Magic Link (Easy)
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod("password")}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                    loginMethod === "password"
                      ? "bg-purple-600 text-white"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Lock className="inline-block w-4 h-4 mr-2" />
                  Password
                </button>
              </div>

              {loginMethod === "magic" && (
                <form onSubmit={handleMagicLink} className="space-y-6">
                  <div className="bg-purple-950/30 border border-purple-800/50 rounded-lg p-4 mb-4">
                    <p className="text-purple-200 text-sm">
                      No password needed! Just enter your email and we&apos;ll send you a link to sign in instantly.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="magic-email" className="text-zinc-200 text-base">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                      <Input
                        id="magic-email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        className="pl-10 h-14 bg-zinc-900 border-zinc-700 text-white text-lg placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-lg bg-red-950/50 border border-red-800 p-4 text-sm text-red-200">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="rounded-lg bg-green-950/50 border border-green-800 p-4 text-sm text-green-200">
                      {success}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-700"
                    disabled={isMagicLinkLoading}
                  >
                    {isMagicLinkLoading ? "Sending..." : "Send Magic Link"}
                  </Button>
                </form>
              )}

              {/* Password Form */}
              {loginMethod === "password" && (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-200 text-base">
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
                        autoComplete="email"
                        className="pl-10 h-14 bg-zinc-900 border-zinc-700 text-white text-lg placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-zinc-200 text-base">
                        Password
                      </Label>
                      <Link href="/auth/forgot-password" className="text-sm text-purple-400 hover:text-purple-300">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        className="pl-10 pr-10 h-14 bg-zinc-900 border-zinc-700 text-white text-lg placeholder:text-zinc-500"
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

                  {error && (
                    <div className="rounded-lg bg-red-950/50 border border-red-800 p-4 text-sm text-red-200">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="rounded-lg bg-green-950/50 border border-green-800 p-4 text-sm text-green-200">
                      {success}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              )}

              <div className="mt-6 text-center text-zinc-400">
                Don&apos;t have an account?{" "}
                <Link href="/auth/sign-up" className="text-purple-400 hover:text-purple-300 font-medium">
                  Create one here
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
