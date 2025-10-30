import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/dashboard"

  console.log("[v0] Auth callback - code:", code ? "present" : "missing")
  console.log("[v0] Auth callback - next:", next)

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      console.log("[v0] Session exchanged successfully, redirecting to:", next)
      if (next === "/auth/reset-password") {
        return NextResponse.redirect(new URL("/auth/reset-password", requestUrl.origin))
      }
      // Check if there's a pending order in the redirect
      if (next === "/create-memorial") {
        return NextResponse.redirect(new URL("/create-memorial", requestUrl.origin))
      }
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    } else {
      console.error("[v0] Session exchange error:", error)
    }
  }

  // If there's an error or no code, redirect to sign-in
  console.log("[v0] No code or error, redirecting to login")
  return NextResponse.redirect(new URL("/auth/login", requestUrl.origin))
}
