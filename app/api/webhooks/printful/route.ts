import { type NextRequest, NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { verifyWebhookSignature } from "@/lib/webhook-signature"

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const webhookSecret = process.env.PRINTFUL_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error("[Printful Webhook] PRINTFUL_WEBHOOK_SECRET is not configured")
      return NextResponse.json({ success: false, error: "Webhook verification is not configured" }, { status: 503 })
    }
    if (!verifyWebhookSignature(rawBody, req.headers.get("x-pful-signature"), webhookSecret)) {
      return NextResponse.json({ success: false, error: "Invalid webhook signature" }, { status: 401 })
    }

    const body = JSON.parse(rawBody)
    const { type, data } = body

    console.log(`[Printful Webhook] Event received: ${type}`)

    if (type === "package_shipped") {
      const shipment = data?.shipment
      const orderData = data?.order
      const orderNumber = orderData?.external_id
      const printfulOrderId = orderData?.id ? String(orderData.id) : null

      if (!orderNumber && !printfulOrderId) {
        return NextResponse.json({ success: false, error: "Missing order reference in webhook" }, { status: 400 })
      }

      const supabase = createServiceRoleClient()

      let query = supabase.from("orders").select("id, customer_email, customer_name, fulfillment_data")
      if (orderNumber) {
        query = query.eq("order_number", orderNumber)
      } else if (printfulOrderId) {
        query = query.eq("fulfillment_id", printfulOrderId)
      }

      const { data: order, error: orderError } = await query.maybeSingle()

      if (orderError || !order) {
        console.warn(`[Printful Webhook] Order not found for orderNumber: ${orderNumber}`)
        return NextResponse.json({ success: true, message: "Order not found or already handled" })
      }

      const existingData = typeof order.fulfillment_data === "object" ? order.fulfillment_data : {}
      const trackingNumber = shipment?.tracking_number || null
      const trackingUrl = shipment?.tracking_url || null
      const carrier = shipment?.carrier || null

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
              shipped_at: shipment?.ship_date || new Date().toISOString(),
            },
          },
        })
        .eq("id", order.id)

      if (updateError) {
        throw new Error(`Failed to update order shipment: ${updateError.message}`)
      }

      console.log(`[Printful Webhook] Updated order ${order.id} status to shipped with tracking ${trackingNumber}`)
    }

    return NextResponse.json({ success: true, received: true })
  } catch (error: any) {
    console.error("[Printful Webhook] Error processing event:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process webhook" },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ status: "active", provider: "printful" })
}
