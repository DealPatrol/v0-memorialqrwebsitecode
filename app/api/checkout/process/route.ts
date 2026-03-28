import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      // New individual product fields
      planType,
      package: packageOrProductId,
      productName,
      productPrice,
      monthlyFee,

      // Shared fields
      customerName,
      customerEmail,
      customerPhone,
      addressLine1,
      addressLine2,
      city,
      state,
      zip,
      paymentId,
      customization,
      cardId,
      squareCustomerId,

      // Old package fields (keep for backwards compatibility)
      plaqueColor,
      boxPersonalization,
      addonWoodenQr,
      addonPicturePlaque,
      addonStoneQR,
      stoneEngravingText,
      picturePlaqueUrl,
    } = body

    // Validate required fields
    if (!customerName || !customerEmail || !addressLine1 || !city || !state || !zip || !paymentId) {
      const missing = []
      if (!customerName) missing.push("customerName")
      if (!customerEmail) missing.push("customerEmail")
      if (!addressLine1) missing.push("addressLine1")
      if (!city) missing.push("city")
      if (!state) missing.push("state")
      if (!zip) missing.push("zip")
      if (!paymentId) missing.push("paymentId")

      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 },
      )
    }

    const orderNumber = `MQR-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    let totalAmountCents = 0
    let monthlyAmountCents = 0
    let finalProductName = productName || "Memorial QR Product"
    let finalPlanType = planType || "individual-product"

    if (planType === "individual-product") {
      // Individual product purchase
      totalAmountCents = Math.round((productPrice || 0) * 100)
      monthlyAmountCents = Math.round((monthlyFee || 4.99) * 100)
      finalProductName = productName || "Memorial QR Product"
    } else {
      // Legacy package purchase
      const packagePrices: Record<string, number> = {
        basic: 8989,
        standard: 12989,
        premium: 19989,
      }
      const baseAmount = packagePrices[packageOrProductId as string] || packagePrices.standard

      let addonAmount = 0
      if (addonWoodenQr) addonAmount += 1989
      if (addonPicturePlaque) addonAmount += 2989
      if (addonStoneQR) addonAmount += 3998
      totalAmountCents = baseAmount + addonAmount
      monthlyAmountCents = 499 // $4.99/month
      finalProductName = `Memorial QR ${packageOrProductId || "standard"} Package${plaqueColor ? ` - ${plaqueColor} plaque` : ""}`
      finalPlanType = "package"
    }

    const supabaseAuth = await createClient()
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser()

    const userId = user?.id || null
    const finalSquareCustomerId = squareCustomerId || user?.user_metadata?.square_customer_id || null

    console.log("[v0] Processing checkout - User ID:", userId, "Square Customer ID:", finalSquareCustomerId)

    const supabase = createServiceRoleClient()

    let subscriptionId = null
    let subscriptionStatus = null

    // Only create subscription if monthly fee exists and payment info is available
    // Note: In future enhancement, check if customer already has subscription for this memorial
    if (monthlyAmountCents > 0 && cardId && finalSquareCustomerId) {
      console.log("[v0] Creating monthly subscription for memorial hosting (per-memorial, not per-product)...")

      try {
        const subscriptionResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/square/create-subscription`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customerId: finalSquareCustomerId,
              cardId: cardId,
              planVariationId: process.env.SQUARE_SUBSCRIPTION_PLAN_ID,
              orderId: orderNumber,
            }),
          },
        )

        const subscriptionData = await subscriptionResponse.json()

        if (subscriptionData.success) {
          subscriptionId = subscriptionData.subscription.id
          subscriptionStatus = subscriptionData.subscription.status
          console.log("[v0] Subscription created successfully:", subscriptionId)
        } else {
          console.error("[v0] Subscription creation failed:", subscriptionData.error)
          // Don't fail the order if subscription fails - store can follow up manually
        }
      } catch (subError) {
        console.error("[v0] Subscription creation error:", subError)
        // Don't fail the order if subscription fails
      }
    }

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
      monthly_amount_cents: monthlyAmountCents,
      currency: "USD",
      product_type: finalPlanType,
      product_name: finalProductName,
      quantity: 1,
      status: "processing",
      special_instructions: customization || boxPersonalization || null,
      plan_type: finalPlanType,
      subscription_id: subscriptionId,
      subscription_plan_id: process.env.SQUARE_SUBSCRIPTION_PLAN_ID || null,

      // Keep legacy fields for backwards compatibility
      plaque_color: plaqueColor || null,
      box_personalization: boxPersonalization || null,
      addon_wooden_qr: addonWoodenQr || false,
      addon_picture_plaque: addonPicturePlaque || false,
      addon_stone_qr: addonStoneQR || false,
      stone_engraving_text: stoneEngravingText || null,
      picture_plaque_url: picturePlaqueUrl || null,

      user_id: userId,
      square_customer_id: finalSquareCustomerId,
    }

    const { data: order, error } = await supabase.from("orders").insert(orderData).select().single()

    if (error) {
      console.error("[v0] Database error creating order:", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
        { status: 500 },
      )
    }

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not created" }, { status: 500 })
    }

    console.log("[v0] Order created successfully:", order.order_number)

    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/send-order-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber: order.order_number,
          customerEmail: customerEmail,
          customerName: customerName,
          productName: finalProductName,
          amount: (totalAmountCents / 100).toFixed(2),
          monthlyFee: (monthlyAmountCents / 100).toFixed(2),
        }),
      })
    } catch (emailError) {
      console.error("[v0] Failed to send order confirmation email:", emailError)
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
      },
    })
  } catch (error: any) {
    console.error("[v0] Checkout processing error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown server error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "/api/checkout/process" })
}
