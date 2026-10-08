"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Mail className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
            <CardDescription className="text-center">
              {email ? `We've sent a verification link to ${email}` : "We've sent you a verification link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Please check your email and click the verification link to activate your account. Once verified, you'll
                be automatically redirected to continue creating your memorial.
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Note:</strong> The verification link will expire in 24 hours. If you don't see the email,
                  check your spam folder.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
