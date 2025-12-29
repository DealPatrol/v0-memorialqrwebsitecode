import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params
    const body = await request.json()
    const { plaqueColor, boxPersonalization, addons } = body

    const supabase = createServerClient()

    // Update order with customization
    const { data: order, error } = await supabase
      .from("orders")
      .update({
        plaque_color: plaqueColor,
        box_personalization: boxPersonalization,
        addon_wooden_qr: addons.includes("wooden_qr"),
        addon_picture_plaque: addons.includes("picture_plaque"),
        addon_stone_qr: addons.includes("stone_qr"),
        updated_at: new Date().toISOString(),
      })
      .eq("order_number", orderNumber)
      .select()
      .single()

    if (error) {
      console.error("Error updating order:", error)
      return NextResponse.json(
        { success: false, error: "Failed to update order" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    console.error("Customize API error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
