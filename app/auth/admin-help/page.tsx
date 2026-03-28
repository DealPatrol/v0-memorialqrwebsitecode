"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"

export default function AdminHelpPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      setMessage({
        type: "success",
        text: "Password reset email sent! Please check your inbox and spam folder.",
      })
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to send reset email",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-black">
      <div className="w-full max-w-md">
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Account Help</CardTitle>
            <CardDescription className="text-zinc-400">
              Having trouble logging in? We can help you reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-zinc-200">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>

              {message && (
                <div
                  className={`rounded-md p-3 text-sm border ${
                    message.type === "success"
                      ? "bg-green-950/50 border-green-900 text-green-200"
                      : "bg-red-950/50 border-red-900 text-red-200"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Password Reset Email"}
              </Button>
            </form>

            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <p className="text-sm text-zinc-400">Common Issues:</p>
              <ul className="text-sm text-zinc-400 space-y-2 list-disc list-inside">
                <li>Check your spam folder for the confirmation or reset email</li>
                <li>Make sure you&apos;re using the correct email address</li>
                <li>If you signed up recently, you may need to confirm your email first</li>
              </ul>
            </div>

            <div className="text-center text-sm text-zinc-400">
              <Link href="/auth/login" className="underline underline-offset-4 text-white hover:text-zinc-300">
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
