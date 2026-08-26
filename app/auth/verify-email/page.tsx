"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                <Mail className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
            <CardDescription className="text-center">
              {email ? `We've sent a verification link to ${email}` : "We've sent you a verification link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                <p className="font-medium mb-2">Next steps:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Open the email from MemorialQR</li>
                  <li>Click the confirmation link</li>
                  <li>Sign in to your account</li>
                </ol>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Note:</strong> The verification link will expire in 24 hours. If you don't see the email,
                  check your spam folder.
                </p>
              </div>
              <div className="text-center text-sm text-gray-600">
                Didn't receive the email?{" "}
                <Link href="/auth/sign-up" className="text-purple-600 hover:underline">
                  Try again
                </Link>
              </div>
              <Button asChild className="w-full">
                <Link href="/auth/login">Go to Sign In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
