import { type NextRequest, NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, resource } = body
    if (type !== "order:shipment:created" && type !== "shipment:sent") {
      return NextResponse.json({ success: true, received: true })
    }

    const externalId = resource?.external_id as string | undefined
    const orderId = resource?.id || resource?.order_id
    const tracking = resource?.tracking || resource?.shipment?.tracking
    if (!externalId && !orderId) {
      return NextResponse.json({ success: false, error: "Missing order reference" }, { status: 400 })
    }

    const supabase = createServiceRoleClient()
    const query = supabase.from("orders").select("id, fulfillment_data")
    const { data: order } = externalId
      ? await query.eq("order_number", externalId).maybeSingle()
      : await query.eq("fulfillment_id", String(orderId)).maybeSingle()

    if (!order) return NextResponse.json({ success: true, message: "Order not found" })

    const existing = typeof order.fulfillment_data === "object" && order.fulfillment_data ? order.fulfillment_data : {}
    await supabase
      .from("orders")
      .update({
        fulfillment_status: "shipped",
        status: "shipped",
        fulfillment_data: {
          ...existing,
          shipment: {
            carrier: tracking?.carrier || null,
            tracking_number: tracking?.number || null,
            tracking_url: tracking?.url || null,
            shipped_at: new Date().toISOString(),
          },
        },
      })
      .eq("id", order.id)

    return NextResponse.json({ success: true, received: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process webhook"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
