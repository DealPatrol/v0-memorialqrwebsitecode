import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { createClient } from "@/lib/supabase/server"
import { HOSTING_MONTHLY_PRICE } from "@/lib/pricing"
import { resolveConfiguredCheckoutItems } from "@/lib/fulfillment-availability"
import { fulfillPaidPhysicalOrder } from "@/lib/order-fulfillment"
import { isMissingPodOrderSchema } from "@/lib/pod-orders"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      planType,
      items,

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
    } = body

    const resolvedCustomerName = customerName || customerEmail

    // Validate required fields
    if (!resolvedCustomerName || !customerEmail || !addressLine1 || !city || !state || !zip || !paymentId) {
      const missing = []
      if (!resolvedCustomerName) missing.push("customerName")
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

    if (planType !== "cart-checkout") {
      return NextResponse.json({ success: false, error: "This product is not available" }, { status: 400 })
    }

    const resolvedItems = resolveConfiguredCheckoutItems(items)
    if (!resolvedItems) {
      return NextResponse.json({ success: false, error: "This product is not available" }, { status: 400 })
    }

    const shipsPhysical = resolvedItems.some((item) => item.ships)
    if (shipsPhysical && !/^[A-Za-z]{2}$/.test(state.trim())) {
      return NextResponse.json({ success: false, error: "Use a 2-letter US state code" }, { status: 400 })
    }
    if (shipsPhysical && !/^\d{5}(-\d{4})?$/.test(zip.trim())) {
      return NextResponse.json({ success: false, error: "Use a US ZIP code" }, { status: 400 })
    }

    const orderNumber = `MQR-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    const totalAmountCents = resolvedItems.reduce(
      (total, item) => total + Math.round(item.price * 100) * item.quantity,
      0,
    )
    const monthlyAmountCents = Math.round(HOSTING_MONTHLY_PRICE * 100)
    const finalProductName = resolvedItems.map((item) => `[${item.id}] ${item.name} × ${item.quantity}`).join(", ")
    const finalPlanType = "cart-checkout"
    const totalQuantity = resolvedItems.reduce((total, item) => total + item.quantity, 0)

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
      customer_name: resolvedCustomerName,
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
      quantity: totalQuantity,
      status: "processing",
      special_instructions: customization || null,
      plan_type: finalPlanType,
      subscription_id: subscriptionId,
      subscription_plan_id: process.env.SQUARE_SUBSCRIPTION_PLAN_ID || null,

      plaque_color: null,
      box_personalization: null,
      addon_wooden_qr: false,
      addon_picture_plaque: false,
      addon_stone_qr: false,
      stone_engraving_text: null,
      picture_plaque_url: null,

      user_id: userId,
      square_customer_id: finalSquareCustomerId,
    }

    const lineItems = resolvedItems.map((item) => ({
      sku: item.id,
      product_name: item.name,
      quantity: item.quantity,
      unit_amount_cents: Math.round(item.price * 100),
      fulfillment_provider: item.provider,
      provider_template_id: item.templateProductId || item.syncVariantId,
      provider_variant_id: item.variantId,
    }))
    const podOrderData = {
      ...orderData,
      line_items: lineItems,
      fulfillment_provider: shipsPhysical ? (new Set(resolvedItems.map((item) => item.provider).filter(Boolean)).size > 1 ? "mixed" : resolvedItems.find((item) => item.provider)?.provider) : null,
      fulfillment_id: null,
      fulfillment_status: shipsPhysical ? "pending" : "not_required",
      fulfillment_data: { schema_version: 1 },
      print_file_url: null,
    }

    let insertResult = await supabase.from("orders").insert(podOrderData).select().single()
    if (insertResult.error && isMissingPodOrderSchema(insertResult.error)) {
      insertResult = await supabase.from("orders").insert(orderData).select().single()
    }
    const { data: order, error } = insertResult

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

    let fulfillmentStatus = shipsPhysical ? "pending" : "not_required"
    let memorialUrl: string | null = null
    if (shipsPhysical) {
      try {
        const outcome = await fulfillPaidPhysicalOrder(supabase, order, resolvedItems)
        fulfillmentStatus = outcome.status
        memorialUrl = typeof outcome.details.memorialUrl === "string" ? outcome.details.memorialUrl : null
      } catch (fulfillmentError) {
        // Square has already captured payment. Keep the order and tell support.
        console.error("[v0] Fulfillment threw after payment:", fulfillmentError)
        fulfillmentStatus = "failed"
      }
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/send-order-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber: order.order_number,
          customerEmail: customerEmail,
          customerName: resolvedCustomerName,
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
        fulfillmentStatus,
        memorialUrl,
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
