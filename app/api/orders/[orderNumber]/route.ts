import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { orderNumber: string } }) {
  try {
    const { orderNumber } = await params

    console.log("[v0] API - Looking up order by order_number:", orderNumber)

    const supabase = await createClient()

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .maybeSingle()

    if (error) {
      console.error("[v0] API - Error fetching order:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    if (!order) {
      console.log("[v0] API - No order found with order_number:", orderNumber)
      const { data: recentOrders } = await supabase
        .from("orders")
        .select("order_number, created_at, customer_name")
        .order("created_at", { ascending: false })
        .limit(5)
      console.log("[v0] API - Recent 5 orders in database:", recentOrders)
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    console.log("[v0] API - Order found successfully:", order.id, order.order_number)
    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("[v0] API - Exception fetching order:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 })
  }
}
