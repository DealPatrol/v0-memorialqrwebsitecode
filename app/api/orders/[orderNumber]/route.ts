import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { orderNumber: string } }) {
  try {
    const supabase = await createClient()

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", params.orderNumber)
      .single()

    if (error) {
      console.error("[v0] Error fetching order:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 404 })
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("[v0] Exception fetching order:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 })
  }
}
