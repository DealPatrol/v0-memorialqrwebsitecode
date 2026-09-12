import { type NextRequest, NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { verifyWebhookSignature } from "@/lib/webhook-signature"

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const webhookSecret = process.env.PRINTIFY_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error("[Printify Webhook] PRINTIFY_WEBHOOK_SECRET is not configured")
      return NextResponse.json({ success: false, error: "Webhook verification is not configured" }, { status: 503 })
    }
    if (!verifyWebhookSignature(rawBody, req.headers.get("x-pfy-signature"), webhookSecret)) {
      return NextResponse.json({ success: false, error: "Invalid webhook signature" }, { status: 401 })
    }

    const body = JSON.parse(rawBody)
    const { type, resource } = body

    console.log(`[Printify Webhook] Event received: ${type}`)

    if (type === "order:shipment:created" || type === "shipment:sent") {
      const orderId = resource?.id || resource?.order_id
      const externalId = resource?.external_id
      const tracking = resource?.tracking || resource?.shipment?.tracking

      if (!orderId && !externalId) {
        return NextResponse.json({ success: false, error: "Missing order reference in webhook" }, { status: 400 })
      }

      const supabase = createServiceRoleClient()

      let query = supabase.from("orders").select("id, customer_email, customer_name, fulfillment_data")
      if (externalId) {
        query = query.eq("order_number", externalId)
      } else if (orderId) {
        query = query.eq("fulfillment_id", String(orderId))
      }

      const { data: order, error: orderError } = await query.maybeSingle()

      if (orderError || !order) {
        console.warn(`[Printify Webhook] Order not found for orderId: ${orderId || externalId}`)
        return NextResponse.json({ success: true, message: "Order not found or already handled" })
      }

      const existingData = typeof order.fulfillment_data === "object" ? order.fulfillment_data : {}
      const trackingNumber = tracking?.number || null
      const trackingUrl = tracking?.url || null
      const carrier = tracking?.carrier || null

      const { error: updateError } = await supabase
        .from("orders")
        .update({
          fulfillment_status: "shipped",
          status: "shipped",
          tracking_number: trackingNumber,
          fulfillment_data: {
            ...existingData,
            shipment: {
              carrier,
              tracking_number: trackingNumber,
              tracking_url: trackingUrl,
              shipped_at: new Date().toISOString(),
            },
          },
        })
        .eq("id", order.id)

      if (updateError) {
        throw new Error(`Failed to update order shipment: ${updateError.message}`)
      }

      console.log(`[Printify Webhook] Updated order ${order.id} status to shipped with tracking ${trackingNumber}`)
    }

    return NextResponse.json({ success: true, received: true })
  } catch (error: any) {
    console.error("[Printify Webhook] Error processing event:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process webhook" },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ status: "active", provider: "printify" })
}
