import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const redirect = requestUrl.searchParams.get("redirect")
  const next = requestUrl.searchParams.get("next")

  console.log("[v0] OAuth callback received")
  console.log("[v0] Code:", code ? "present" : "missing")
  console.log("[v0] Redirect param:", redirect)
  console.log("[v0] Next param:", next)

  if (code) {
    const supabase = await createClient()
    console.log("[v0] Exchanging code for session...")

    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code)

    console.log("[v0] Exchange result - User:", authData?.user?.id || "none")
    console.log("[v0] Exchange error:", error?.message || "none")

    if (!error && authData.user) {
      console.log("[v0] Auth successful for user:", authData.user.email)

      // Handle custom redirect first
      if (redirect) {
        console.log("[v0] Redirecting to custom URL:", redirect)
        return NextResponse.redirect(new URL(redirect, requestUrl.origin))
      }

      if (next) {
        console.log("[v0] Redirecting to next URL:", next)
        return NextResponse.redirect(new URL(next, requestUrl.origin))
      }

      // Check if user has any memorials
      const { data: memorials, error: memorialError } = await supabase
        .from("memorials")
        .select("id")
        .eq("user_id", authData.user.id)
        .limit(1)

      console.log("[v0] User memorials count:", memorials?.length || 0)
      console.log("[v0] Memorial query error:", memorialError?.message || "none")

      if (memorials && memorials.length > 0) {
        console.log("[v0] Redirecting to dashboard")
        return NextResponse.redirect(new URL("/dashboard", requestUrl.origin))
      } else {
        console.log("[v0] Redirecting to create-memorial")
        return NextResponse.redirect(new URL("/create-memorial", requestUrl.origin))
      }
    } else {
      console.error("[v0] Auth exchange failed:", error?.message)
    }
  } else {
    console.error("[v0] No code parameter in callback URL")
  }

  const errorMessage = encodeURIComponent("Authentication failed. Please try again or contact support.")
  console.log("[v0] Redirecting to sign-in with error")
  return NextResponse.redirect(new URL(`/auth/sign-in?error=${errorMessage}`, requestUrl.origin))
}
