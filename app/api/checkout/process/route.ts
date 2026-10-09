import { NextResponse } from "next/server"
import { attributionFromUnknown, formatAttribution } from "@/lib/attribution"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { createClient } from "@/lib/supabase/server"
import { priceCart } from "@/lib/checkout-pricing"
import { recordEmailAlert } from "@/lib/order-email-alerts"
import { verifySquarePayment } from "@/lib/square-verify"
import { fulfillPaidPhysicalOrder } from "@/lib/order-fulfillment"
import { isMissingPodOrderSchema } from "@/lib/pod-orders"
import { sendOrderConfirmationEmail } from "@/lib/order-confirmation-email"

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
      squareCustomerId,
      attribution: rawAttribution,
    } = body

    const attribution = attributionFromUnknown(rawAttribution)
    const attributionNote = formatAttribution(attribution) || null

    const resolvedCustomerName = customerName || customerEmail

    // Validate required fields. A shipping address is only required when the cart ships something.
    const baseMissing = []
    if (!resolvedCustomerName) baseMissing.push("customerName")
    if (!customerEmail) baseMissing.push("customerEmail")
    if (!paymentId) baseMissing.push("paymentId")
    if (baseMissing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${baseMissing.join(", ")}` },
        { status: 400 },
      )
    }

    if (planType !== "cart-checkout") {
      return NextResponse.json({ success: false, error: "This product is not available" }, { status: 400 })
    }

    const cart = priceCart(items)
    if (!cart) {
      return NextResponse.json({ success: false, error: "This product is not available" }, { status: 400 })
    }
    const resolvedItems = cart.lines

    const shipsPhysical = resolvedItems.some((item) => item.ships)
    const manualFulfillment =
      shipsPhysical && resolvedItems.every((item) => !item.ships || item.provider === "manual")
    if (shipsPhysical && (!addressLine1 || !city || !state || !zip)) {
      const missing = []
      if (!addressLine1) missing.push("addressLine1")
      if (!city) missing.push("city")
      if (!state) missing.push("state")
      if (!zip) missing.push("zip")
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 },
      )
    }
    if (shipsPhysical && !/^[A-Za-z]{2}$/.test(state.trim())) {
      return NextResponse.json({ success: false, error: "Use a 2-letter US state code" }, { status: 400 })
    }
    if (shipsPhysical && !/^\d{5}(-\d{4})?$/.test(zip.trim())) {
      return NextResponse.json({ success: false, error: "Use a US ZIP code" }, { status: 400 })
    }

    const totalAmountCents = cart.amountCents

    // Never create an order for a payment Square has not completed for this exact amount.
    const payment = await verifySquarePayment(paymentId, { amountCents: totalAmountCents, currency: cart.currency })
    if (!payment.ok) {
      console.error("[Checkout] Square payment verification failed:", paymentId, payment.reason)
      return NextResponse.json({ success: false, error: payment.reason }, { status: payment.status })
    }

    const supabase = createServiceRoleClient()

    // One order per Square payment. A retry returns the order that already exists.
    const existing = await findOrderByPaymentId(supabase, paymentId)
    if (existing) return NextResponse.json(orderResponse(existing, existing.fulfillment_status ?? null, null))

    const orderNumber = `MQR-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
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

    // Keepsakes include 10 years of hosting. Checkout is one-time only and never creates a subscription.

    const orderData = {
      order_number: orderNumber,
      customer_name: resolvedCustomerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      // Digital-only carts collect no address; empty strings keep the NOT NULL columns valid.
      shipping_address_line1: shipsPhysical ? addressLine1 : addressLine1 || "",
      shipping_address_line2: addressLine2 || null,
      shipping_city: shipsPhysical ? city : city || "",
      shipping_state: shipsPhysical ? state : state || "",
      shipping_zip: shipsPhysical ? zip : zip || "",
      shipping_country: "US",
      payment_id: paymentId,
      payment_status: "completed",
      amount_cents: totalAmountCents,
      monthly_amount_cents: 0,
      currency: "USD",
      product_type: finalPlanType,
      product_name: finalProductName,
      quantity: totalQuantity,
      status: "processing",
      special_instructions: customization || null,
      plan_type: finalPlanType,
      subscription_id: null,
      subscription_plan_id: null,

      plaque_color: null,
      box_personalization: null,
      addon_wooden_qr: false,
      addon_picture_plaque: false,
      addon_stone_qr: false,
      stone_engraving_text: null,
      picture_plaque_url: null,

      user_id: userId,
      square_customer_id: finalSquareCustomerId,
      admin_notes: attributionNote,
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
      fulfillment_data: { schema_version: 1, ...(attribution ? { attribution } : {}) },
      print_file_url: null,
    }

    let insertResult = await supabase.from("orders").insert(podOrderData).select().single()
    if (insertResult.error && isMissingPodOrderSchema(insertResult.error)) {
      insertResult = await supabase.from("orders").insert(orderData).select().single()
    }
    const { data: order, error } = insertResult

    if (error && error.code === "23505") {
      // Unique payment_id: a concurrent request for the same payment already created the order.
      const raced = await findOrderByPaymentId(supabase, paymentId)
      if (raced) return NextResponse.json(orderResponse(raced, raced.fulfillment_status ?? null, null))
    }

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
      await sendOrderConfirmationEmail({
        customerEmail,
        customerName: resolvedCustomerName,
        orderNumber: order.order_number,
        productName: finalProductName,
        amount: (totalAmountCents / 100).toFixed(2),
        shipsPhysical,
        manualFulfillment,
      })
    } catch (emailError) {
      // Don't fail a paid order because of email, but make it visible.
      await recordEmailAlert(supabase, order, "customer_confirmation", emailError)
    }

    return NextResponse.json(orderResponse(order, fulfillmentStatus, memorialUrl))
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

type OrderRow = {
  id: string
  order_number: string
  status: string
  amount_cents: number
  currency?: string | null
  fulfillment_status?: string | null
}

async function findOrderByPaymentId(supabase: ReturnType<typeof createServiceRoleClient>, paymentId: string) {
  const { data } = await supabase
    .from("orders")
    .select("id, order_number, status, amount_cents, currency, fulfillment_status")
    .eq("payment_id", paymentId)
    .limit(1)
    .maybeSingle()
  return (data as OrderRow | null) ?? null
}

function orderResponse(order: OrderRow, fulfillmentStatus: string | null, memorialUrl: string | null) {
  return {
    success: true,
    order: {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      fulfillmentStatus,
      memorialUrl,
      amount: order.amount_cents / 100,
      currency: order.currency || "USD",
    },
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "/api/checkout/process" })
}
