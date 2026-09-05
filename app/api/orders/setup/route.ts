import { type NextRequest, NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("orderId")
  if (!orderId) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
  }

  const serviceRole = createServiceRoleClient()
  const { data: order, error } = await serviceRole
    .from("orders")
    .select("id, customer_name, memorial_id")
    .eq("id", orderId)
    .maybeSingle()

  if (error || !order?.memorial_id) {
    return NextResponse.json({ error: "Reserved memorial not found" }, { status: 404 })
  }

  const { data: memorial } = await serviceRole
    .from("memorials")
    .select("product_type")
    .eq("id", order.memorial_id)
    .maybeSingle()

  if (!memorial) {
    return NextResponse.json({ error: "Reserved memorial not found" }, { status: 404 })
  }

  return NextResponse.json({
    order: {
      id: order.id,
      customerName: order.customer_name,
      packageType: memorial.product_type,
    },
  })
}
