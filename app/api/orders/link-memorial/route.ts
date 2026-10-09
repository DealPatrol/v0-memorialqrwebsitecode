import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { decideMemorialLink } from "@/lib/order-access"

export async function POST(req: Request) {
  try {
    const { orderId, memorialId, customerEmail } = await req.json()
    if (typeof orderId !== "string" || typeof memorialId !== "string" || !customerEmail) {
      return NextResponse.json({ success: false, error: "Missing orderId, memorialId or customerEmail" }, { status: 400 })
    }

    const supabase = createServiceRoleClient()
    const { data: order } = await supabase
      .from("orders")
      .select("id, customer_email, memorial_id")
      .eq("id", orderId)
      .maybeSingle()
    const decision = decideMemorialLink(order, memorialId, customerEmail)
    if (!decision.ok) return NextResponse.json({ success: false, error: decision.error }, { status: decision.status })

    const { data: memorial } = await supabase.from("memorials").select("id").eq("id", memorialId).maybeSingle()
    if (!memorial) return NextResponse.json({ success: false, error: "Memorial not found" }, { status: 404 })

    const { error } = await supabase
      .from("orders")
      .update({ memorial_id: memorialId })
      .eq("id", orderId)
      .is("memorial_id", null)
    if (error) return NextResponse.json({ success: false, error: "Failed to link memorial to order" }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error linking memorial to order:", error)
    return NextResponse.json({ success: false, error: "Failed to link memorial to order" }, { status: 500 })
  }
}
