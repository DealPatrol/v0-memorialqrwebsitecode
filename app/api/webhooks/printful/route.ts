import { type NextRequest, NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body
    if (type !== "package_shipped") {
      return NextResponse.json({ success: true, received: true })
    }

    const shipment = data?.shipment
    const orderNumber = data?.order?.external_id as string | undefined
    const printfulOrderId = data?.order?.id ? String(data.order.id) : null
    if (!orderNumber && !printfulOrderId) {
      return NextResponse.json({ success: false, error: "Missing order reference" }, { status: 400 })
    }

    const supabase = createServiceRoleClient()
    const query = supabase.from("orders").select("id, fulfillment_data")
    const { data: order } = orderNumber
      ? await query.eq("order_number", orderNumber).maybeSingle()
      : await query.eq("fulfillment_id", printfulOrderId).maybeSingle()

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
            carrier: shipment?.carrier || null,
            tracking_number: shipment?.tracking_number || null,
            tracking_url: shipment?.tracking_url || null,
            shipped_at: shipment?.ship_date || new Date().toISOString(),
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
