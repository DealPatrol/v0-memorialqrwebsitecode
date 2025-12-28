"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      // Redirect to dashboard on successful login
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif flex items-center">
            Memorial QR
            <span className="text-yellow-400 ml-1">★</span>
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-gray-600">
            View Pricing
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Login Form */}
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-serif">Sign in to your account</CardTitle>
              <CardDescription>Enter your email and password to access your memorials</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start mb-4">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-4">
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Remember me for 30 days
                  </Label>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t pt-4">
              <div className="text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                  Create an account
                </Link>
              </div>
            </CardFooter>
          </Card>

          {/* Right Column - Image and Info */}
          <div className="hidden md:flex flex-col items-center space-y-6">
            <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/qr-code-gravestone.png"
                alt="Memorial QR Code on a gravestone"
                fill
                className="object-cover"
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm max-w-md">
              <h3 className="font-medium text-lg mb-2">Manage Your Memorial Pages</h3>
              <p className="text-gray-600 mb-4">
                Sign in to access your dashboard where you can view visitor statistics, add new photos and stories, or
                edit your memorial pages.
              </p>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-1 rounded-full mr-3">
                    <svg
                      className="h-4 w-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-sm">View visitor statistics</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-100 p-1 rounded-full mr-3">
                    <svg
                      className="h-4 w-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-sm">Add photos and videos</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-100 p-1 rounded-full mr-3">
                    <svg
                      className="h-4 w-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-sm">Manage family tree</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-100 p-1 rounded-full mr-3">
                    <svg
                      className="h-4 w-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-sm">Approve visitor stories</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6">
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
