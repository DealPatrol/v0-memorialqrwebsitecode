import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next")

  if (code) {
    const supabase = await createClient()
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && authData.user) {
      // If there's a specific next URL, use it
      if (next) {
        return NextResponse.redirect(new URL(next, requestUrl.origin))
      }

      const { data: memorials } = await supabase
        .from("memorials")
        .select("id, slug")
        .eq("user_id", authData.user.id)
        .order("created_at", { ascending: false })
        .limit(1)

      // If user has memorials, go to first memorial
      if (memorials && memorials.length > 0) {
        return NextResponse.redirect(new URL(`/memorial/${memorials[0].id}`, requestUrl.origin))
      }

      const { data: orders } = await supabase
        .from("orders")
        .select("id, memorial_id, status")
        .eq("customer_email", authData.user.email)
        .is("memorial_id", null)
        .in("status", ["completed", "paid", "processing"])
        .limit(1)

      if (orders && orders.length > 0) {
        const orderId = orders[0].id
        return NextResponse.redirect(new URL(`/create-memorial?orderId=${orderId}&welcome=true`, requestUrl.origin))
      }

      const { data: allOrders } = await supabase
        .from("orders")
        .select("id")
        .eq("customer_email", authData.user.email)
        .limit(1)

      // If they have any order history, go to dashboard
      if (allOrders && allOrders.length > 0) {
        return NextResponse.redirect(new URL("/dashboard", requestUrl.origin))
      }

      return NextResponse.redirect(new URL("/store", requestUrl.origin))
    }
  }

  return NextResponse.redirect(new URL("/auth/login?error=Invalid authentication link", requestUrl.origin))
}
