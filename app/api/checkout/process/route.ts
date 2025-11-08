import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function POST(req: Request) {
  try {
    console.log("[v0 API] Checkout process route called")

    const body = await req.json()
    console.log("[v0 API] Request body received:", JSON.stringify(body, null, 2))

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
      addonStoneQR,
      stoneEngravingText,
      picturePlaqueUrl,
    } = body

    if (!customerName || !customerEmail || !addressLine1 || !city || !state || !zip || !paymentId) {
      console.error("[v0 API] Missing required fields:", {
        customerName: !!customerName,
        customerEmail: !!customerEmail,
        addressLine1: !!addressLine1,
        city: !!city,
        state: !!state,
        zip: !!zip,
        paymentId: !!paymentId,
      })
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0 API] All required fields present")

    const orderNumber = `MQR-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    console.log("[v0 API] Generated order number:", orderNumber)

    const baseAmount = 200
    let addonAmount = 0
    if (addonWoodenQr) addonAmount += 2997
    if (addonPicturePlaque) addonAmount += 3998
    if (addonStoneQR) addonAmount += 5699
    const totalAmountCents = baseAmount + addonAmount

    console.log("[v0 API] Calculated total:", totalAmountCents)

    console.log("[v0 API] Creating Supabase client...")
    const supabase = createServiceRoleClient()
    console.log("[v0 API] Supabase client created")

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

    console.log("[v0 API] Order data prepared, inserting into database...")
    console.log("[v0 API] Order data:", JSON.stringify(orderData, null, 2))

    const { data: order, error } = await supabase.from("orders").insert(orderData).select().single()

    if (error) {
      console.error("[v0 API] Supabase error:", JSON.stringify(error, null, 2))
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
      console.error("[v0 API] No order data returned from database")
      return NextResponse.json({ success: false, error: "Order not created - no data returned" }, { status: 500 })
    }

    console.log("[v0 API] Order created successfully! ID:", order.id, "Number:", order.order_number)

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
      },
    })
  } catch (error: any) {
    console.error("[v0 API] FATAL ERROR in checkout process:", error)
    console.error("[v0 API] Error stack:", error.stack)
    console.error("[v0 API] Error message:", error.message)
    console.error("[v0 API] Error name:", error.name)

    return NextResponse.json(
      {
        success: false,
        error: `Server error: ${error.message || "Unknown error"}`,
        details: error.stack?.substring(0, 200) || "No stack trace",
      },
      { status: 500 },
    )
  }
}
