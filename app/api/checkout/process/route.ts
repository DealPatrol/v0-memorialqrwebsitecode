import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { createClient } from "@/lib/supabase/server"
import {
  createPodOrderLineItems,
  getCheckoutTotalCents,
  resolveCheckoutItems,
} from "@/lib/checkout-products"
import {
  getConfiguredTemplateId,
  getFulfillmentProvider,
  isMissingHostingSchema,
  isMissingPodOrderSchema,
} from "@/lib/pod-orders"
import { getHostingTerms } from "@/lib/hosting"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      planType,
      items,

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

    if (planType !== "cart-checkout") {
      return NextResponse.json({ success: false, error: "Unsupported checkout type" }, { status: 400 })
    }

    const resolvedItems = resolveCheckoutItems(items)
    if (!resolvedItems) {
      return NextResponse.json({ success: false, error: "Cart contains an unsupported product" }, { status: 400 })
    }

    const orderNumber = `MQR-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    const totalAmountCents = getCheckoutTotalCents(resolvedItems)
    // Physical keepsake orders include 10 years of basic hosting (no monthly subscription).
    // Digital-only orders keep the $4.99/month hosting subscription.
    const hostingTerms = getHostingTerms(resolvedItems)
    const monthlyAmountCents = hostingTerms.monthlyAmountCents
    const finalProductName = resolvedItems
      .map((item) => `[${item.id}] ${item.name} × ${item.quantity}`)
      .join(", ")
    const finalPlanType = "cart-checkout"
    const totalQuantity = resolvedItems.reduce((total, item) => total + item.quantity, 0)
    const podLineItems = createPodOrderLineItems(resolvedItems, getConfiguredTemplateId)

    const accessToken = process.env.SQUARE_ACCESS_TOKEN
    const locationId = process.env.SQUARE_LOCATION_ID
    const environment = process.env.SQUARE_ENVIRONMENT || "sandbox"
    if (accessToken && locationId) {
      const baseUrl =
        environment === "production" ? "https://connect.squareup.com" : "https://connect.squareupsandbox.com"
      const paymentResponse = await fetch(`${baseUrl}/v2/payments/${encodeURIComponent(paymentId)}`, {
        headers: {
          "Square-Version": "2024-12-18",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const paymentData = await paymentResponse.json()
      const payment = paymentData.payment

      if (
        !paymentResponse.ok ||
        payment?.status !== "COMPLETED" ||
        payment?.amount_money?.amount !== totalAmountCents ||
        payment?.amount_money?.currency !== "CAD" ||
        payment?.location_id !== locationId
      ) {
        return NextResponse.json({ success: false, error: "Payment does not match the order total" }, { status: 400 })
      }
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

    // Only create a subscription for digital-only orders (monthly fee > 0) when payment info is available.
    // Physical keepsake orders never create a subscription: hosting is included until hostingIncludedUntil.
    if (!hostingTerms.includesPhysicalKeepsake && monthlyAmountCents > 0 && cardId && finalSquareCustomerId) {
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
      currency: "CAD",
      product_type: finalPlanType,
      product_name: finalProductName,
      quantity: totalQuantity,
      status: "processing",
      special_instructions: customization || null,
      plan_type: finalPlanType,
      subscription_id: subscriptionId,
      subscription_plan_id: subscriptionId ? process.env.SQUARE_SUBSCRIPTION_PLAN_ID || null : null,

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

    const { data: order, error } = await (async () => {
      const podOrderData = {
        ...orderData,
        line_items: podLineItems,
        fulfillment_provider: getFulfillmentProvider(podLineItems),
        fulfillment_id: null,
        fulfillment_status: podLineItems.length > 0 ? "awaiting_memorial_setup" : "not_required",
        fulfillment_data: {
          schema_version: 1,
          hosting_plan: hostingTerms.hostingPlan,
          hosting_included_until: hostingTerms.hostingIncludedUntil,
        },
        print_file_url: null,
      }

      // Prefer storing hosting_included_until as a first-class column (scripts/026_add_hosting_included_until.sql).
      let insertResult = await supabase
        .from("orders")
        .insert({ ...podOrderData, hosting_included_until: hostingTerms.hostingIncludedUntil })
        .select()
        .single()

      if (insertResult.error && isMissingHostingSchema(insertResult.error)) {
        console.warn("[v0] hosting_included_until column is not available; storing it in fulfillment_data")
        insertResult = await supabase.from("orders").insert(podOrderData).select().single()
      }

      if (insertResult.error && isMissingPodOrderSchema(insertResult.error)) {
        console.warn("[v0] POD order migration is not available; saving legacy order fields")
        insertResult = await supabase.from("orders").insert(orderData).select().single()
      }

      return insertResult
    })()

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
          hostingIncludedUntil: hostingTerms.hostingIncludedUntil,
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
