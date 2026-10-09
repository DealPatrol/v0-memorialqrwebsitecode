import { NextRequest, NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { emailMatchesOrder, parseCustomization } from "@/lib/order-access"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ orderNumber: string }> }) {
  try {
    const { orderNumber } = await params
    const body = await request.json().catch(() => null)
    const parsed = parseCustomization(body)
    if (!parsed.ok) return NextResponse.json({ success: false, error: parsed.error }, { status: 400 })
    if (!body?.customerEmail) {
      return NextResponse.json({ success: false, error: "customerEmail is required" }, { status: 400 })
    }

    const supabase = createServiceRoleClient()
    const { data: existing } = await supabase
      .from("orders")
      .select("id, customer_email")
      .eq("order_number", orderNumber)
      .maybeSingle()
    // Same answer for "no such order" and "wrong email" so order numbers can't be probed.
    if (!existing || !emailMatchesOrder(existing, body.customerEmail)) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    const { plaqueColor, boxPersonalization, addons } = parsed.value
    const { error } = await supabase
      .from("orders")
      .update({
        plaque_color: plaqueColor,
        box_personalization: boxPersonalization,
        addon_wooden_qr: addons.includes("wooden_qr"),
        addon_picture_plaque: addons.includes("picture_plaque"),
        addon_stone_qr: addons.includes("stone_qr"),
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)

    if (error) {
      console.error("Error updating order customization:", error)
      return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 })
    }
    return NextResponse.json({ success: true, orderNumber })
  } catch (error) {
    console.error("Customize API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
