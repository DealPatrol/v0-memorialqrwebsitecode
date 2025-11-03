import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`
      : `${request.headers.get("origin")}/auth/reset-password`

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    })

    if (error) {
      console.error("[v0] Error generating reset link:", error)
      // Don't reveal if email exists or not for security
      return NextResponse.json({ success: true })
    }

    // Note: We need to disable Supabase's default email in the Supabase dashboard
    // and handle it ourselves for better deliverability
    try {
      // Generate a custom reset URL with better branding
      const resetUrl = `${redirectUrl}?email=${encodeURIComponent(email)}`

      await sendPasswordResetEmail({
        email,
        resetUrl,
      })
    } catch (emailError) {
      console.error("[v0] Error sending custom reset email:", emailError)
      // Continue anyway since Supabase sent their email
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in reset password route:", error)
    return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 })
  }
}
