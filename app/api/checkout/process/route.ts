import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    console.log("[v0] Received checkout data:", JSON.stringify(body, null, 2))

    const {
      plaqueColor,
      boxPersonalization,
      customerName,
      customerEmail,
      customerPhone,
      addressLine1,
      addressLine2,
      city,
      state,
      zip,
      paymentId,
      addonWoodenQr,
      addonPicturePlaque,
      addonStoneQR, // Frontend sends this with capital QR
      stoneEngravingText,
      picturePlaqueUrl,
    } = body

    if (!customerName || !customerEmail || !addressLine1 || !city || !state || !zip || !paymentId) {
      console.error("[v0] Missing required fields")
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const orderNumber = `MQR-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    const baseAmount = 200
    let addonAmount = 0
    if (addonWoodenQr) addonAmount += 2997
    if (addonPicturePlaque) addonAmount += 3998
    if (addonStoneQR) addonAmount += 5699
    const totalAmountCents = baseAmount + addonAmount

    const supabase = createServiceRoleClient()

    const orderData = {
      order_number: orderNumber,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      shipping_address_line1: addressLine1,
      shipping_address_line2: addressLine2 || null,
      shipping_city: city,
      shipping_state: state,
      shipping_zip: zip,
      shipping_country: "US",
      payment_id: paymentId,
      payment_status: "completed",
      amount_cents: totalAmountCents,
      currency: "USD",
      product_type: "memorial_package",
      product_name: `Memorial QR Package${plaqueColor ? ` - ${plaqueColor} plaque` : ""}`,
      quantity: 1,
      status: "processing",
      special_instructions: boxPersonalization || null,
      plaque_color: plaqueColor || null,
      addon_wooden_qr: addonWoodenQr || false,
      addon_picture_plaque: addonPicturePlaque || false,
      addon_stone_qr: addonStoneQR || false,
      stone_engraving_text: stoneEngravingText || null,
      picture_plaque_url: picturePlaqueUrl || null,
    }

    console.log("[v0] Inserting order into database:", JSON.stringify(orderData, null, 2))

    const { data: order, error } = await supabase.from("orders").insert(orderData).select().single()

    if (error) {
      console.error("[v0] Database error:", JSON.stringify(error, null, 2))
      return NextResponse.json(
        {
          success: false,
          error: `Database error: ${error.message}`,
          details: error.details || "No additional details",
          hint: error.hint || "No hint available",
          code: error.code || "UNKNOWN",
        },
        { status: 500 },
      )
    }

    if (!order) {
      console.error("[v0] Order not created - no data returned")
      return NextResponse.json({ success: false, error: "Order not created" }, { status: 500 })
    }

    console.log("[v0] Order created successfully:", order.id)

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
      },
    })
  } catch (error: any) {
    console.error("[v0] Checkout error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Payment processing failed",
      },
      { status: 500 },
    )
  }
}
