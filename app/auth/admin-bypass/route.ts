import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const email = requestUrl.searchParams.get("email")
  const token = requestUrl.searchParams.get("token")

  // Security check - validate admin token
  const adminToken = process.env.ADMIN_BYPASS_TOKEN || "admin_memorial_qr_2025"
  if (token !== adminToken) {
    return NextResponse.redirect(new URL("/auth/login?error=Invalid admin token", requestUrl.origin))
  }

  if (!email) {
    return NextResponse.redirect(new URL("/auth/login?error=Email required", requestUrl.origin))
  }

  try {
    const supabase = await createClient()

    // Sign in the user using admin bypass (no password required)
    const { data, error } = await supabase.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      email_confirm: true, // Auto-confirm email
    })

    if (error && !error.message.includes("already exists")) {
      console.error("[v0] Admin bypass error:", error)
      return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin))
    }

    // Get the user session
    const { data: sessionData } = await supabase.auth.admin.getUserById(data?.user?.id || "")

    if (sessionData?.user) {
      // Check if user has paid orders
      const { data: orders } = await supabase
        .from("orders")
        .select("id, memorial_id, status")
        .eq("customer_email", email.toLowerCase().trim())
        .is("memorial_id", null)
        .in("status", ["completed", "paid", "processing"])
        .limit(1)

      // If user has paid but no memorial, send to create memorial page
      if (orders && orders.length > 0) {
        const orderId = orders[0].id
        return NextResponse.redirect(new URL(`/create-memorial?orderId=${orderId}&welcome=true`, requestUrl.origin))
      }

      // Default to dashboard
      return NextResponse.redirect(new URL("/dashboard", requestUrl.origin))
    }

    return NextResponse.redirect(new URL("/auth/login?error=Failed to create session", requestUrl.origin))
  } catch (err) {
    console.error("[v0] Admin bypass error:", err)
    return NextResponse.redirect(new URL("/auth/login?error=Something went wrong", requestUrl.origin))
  }
}
