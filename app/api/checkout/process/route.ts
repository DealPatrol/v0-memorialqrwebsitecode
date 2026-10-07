import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { createClient } from "@/lib/supabase/server"
import { resolveConfiguredCheckoutItems } from "@/lib/fulfillment-availability"
import { fulfillPaidPhysicalOrder } from "@/lib/order-fulfillment"
import { isMissingHostingSchema, isMissingPodOrderSchema } from "@/lib/pod-orders"
import { paymentMatchesQuote, quoteCheckout } from "@/lib/checkout-quote"
import { CHECKOUT_CURRENCY } from "@/lib/site"
import {
  createSquareSubscription,
  getSquareCard,
  getSquareConfig,
  getSquarePayment,
  subscriptionStartDate,
} from "@/lib/square-api"

type Row = Record<string, unknown>

/** Tries the richest insert first and drops columns from migrations 025/026 that are not applied yet. */
async function insertOrder(
  supabase: ReturnType<typeof createServiceRoleClient>,
  legacy: Row,
  podFields: Row,
  hostingIncludedUntil: string | null,
) {
  const hosting = hostingIncludedUntil ? { hosting_included_until: hostingIncludedUntil } : {}
  const attempts: Row[] = [
    { ...legacy, ...podFields, ...hosting },
    { ...legacy, ...podFields },
    { ...legacy, ...hosting },
    legacy,
  ]
  let result = await supabase.from("orders").insert(attempts[0]).select().single()
  for (const attempt of attempts.slice(1)) {
    if (!result.error || !(isMissingHostingSchema(result.error) || isMissingPodOrderSchema(result.error))) break
    result = await supabase.from("orders").insert(attempt).select().single()
  }
  return result
}

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
    } = body

    const resolvedCustomerName = customerName || customerEmail

    // A shipping address is only required when the cart ships something.
    const baseMissing = []
    if (!resolvedCustomerName) baseMissing.push("customerName")
    if (!customerEmail) baseMissing.push("customerEmail")
    if (!paymentId || typeof paymentId !== "string") baseMissing.push("paymentId")
    if (baseMissing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${baseMissing.join(", ")}` },
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

    const orderDate = new Date()
    const quoted = quoteCheckout(resolvedItems, orderDate)
    if (!quoted.ok) {
      return NextResponse.json({ success: false, error: quoted.error }, { status: 400 })
    }
    const { quote } = quoted
    const { hostingTerms } = quote

    const shipsPhysical = resolvedItems.some((item) => item.ships)
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

    const square = getSquareConfig()
    if (!square) {
      return NextResponse.json({ success: false, error: "Square not configured" }, { status: 500 })
    }

    // Never trust the browser: confirm with Square that this payment exists, is complete,
    // and paid exactly the server-computed total at our location.
    const paymentLookup = await getSquarePayment(square, paymentId)
    if (!paymentLookup.ok) {
      console.error("[checkout] Payment lookup failed:", paymentLookup.error)
      return NextResponse.json({ success: false, error: "We could not confirm your payment" }, { status: 402 })
    }
    const payment = paymentLookup.data.payment
    const paidCents = payment.amount_money?.amount
    if (!paymentMatchesQuote(payment, quote.totalCents, square.locationId, CHECKOUT_CURRENCY)) {
      console.error("[checkout] Payment does not match order", {
        paymentId,
        status: payment.status,
        paidCents,
        expectedCents: quote.totalCents,
      })
      return NextResponse.json({ success: false, error: "Payment does not match this order" }, { status: 402 })
    }

    const supabase = createServiceRoleClient()

    // One order per Square payment. A retried submit returns the order already recorded.
    const existing = await supabase
      .from("orders")
      .select("id, order_number, status")
      .eq("payment_id", paymentId)
      .maybeSingle()
    if (existing.data) {
      return NextResponse.json({
        success: true,
        duplicate: true,
        order: { id: existing.data.id, orderNumber: existing.data.order_number, status: existing.data.status },
      })
    }

    const orderNumber = `MQR-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    const totalAmountCents = quote.totalCents
    const monthlyAmountCents = quote.monthlyAmountCents
    const finalProductName = resolvedItems.map((item) => `[${item.id}] ${item.name} × ${item.quantity}`).join(", ")
    const finalPlanType = "cart-checkout"
    const totalQuantity = resolvedItems.reduce((total, item) => total + item.quantity, 0)

    const supabaseAuth = await createClient()
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser()
    const userId = user?.id || null

    // The customer comes from the verified payment, not from the request body.
    const squareCustomerId = payment.customer_id || null
    const adminNotes: string[] = []
    if (hostingTerms.hostingIncludedUntil) {
      adminNotes.push(`hosting_included_until=${hostingTerms.hostingIncludedUntil} (${hostingTerms.hostingPlan})`)
    }

    let subscriptionId: string | null = null
    let subscriptionStatus: "active" | "not_required" | "failed" = quote.needsSubscription ? "failed" : "not_required"
    const planVariationId = process.env.SQUARE_SUBSCRIPTION_PLAN_ID?.trim() || ""

    if (quote.needsSubscription) {
      let failure: string | null = null
      if (!planVariationId) failure = "SQUARE_SUBSCRIPTION_PLAN_ID is not set"
      else if (!squareCustomerId) failure = "payment has no Square customer"
      else if (!cardId || typeof cardId !== "string") failure = "card was not saved after payment"

      if (!failure && squareCustomerId && typeof cardId === "string") {
        const card = await getSquareCard(square, cardId)
        if (!card.ok || card.data.card.customer_id !== squareCustomerId || card.data.card.enabled === false) {
          failure = "saved card does not belong to the paying customer"
        } else {
          const created = await createSquareSubscription(square, {
            customerId: squareCustomerId,
            cardId,
            planVariationId,
            startDate: subscriptionStartDate(orderDate),
            // Deterministic, so a retried request cannot create a second subscription.
            idempotencyKey: `sub-${paymentId}`.slice(0, 45),
          })
          if (created.ok) {
            subscriptionId = created.data.subscription.id
            subscriptionStatus = "active"
          } else {
            failure = `Square subscription error: ${created.error}`
          }
        }
      }

      if (failure) {
        console.error("[checkout] Monthly hosting subscription was NOT created:", failure)
        adminNotes.push(`SUBSCRIPTION NOT CREATED: ${failure}. Payment ${paymentId} was charged for the first month.`)
      }
    }

    const legacyOrder: Row = {
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
      monthly_amount_cents: monthlyAmountCents,
      currency: CHECKOUT_CURRENCY,
      product_type: finalPlanType,
      product_name: finalProductName,
      quantity: totalQuantity,
      status: "processing",
      special_instructions: customization || null,
      admin_notes: adminNotes.length ? adminNotes.join("\n") : null,
      plan_type: finalPlanType,
      subscription_id: subscriptionId,
      subscription_plan_id: subscriptionId ? planVariationId : null,

      plaque_color: null,
      box_personalization: null,
      addon_wooden_qr: false,
      addon_picture_plaque: false,
      addon_stone_qr: false,
      stone_engraving_text: null,
      picture_plaque_url: null,

      user_id: userId,
      square_customer_id: squareCustomerId,
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
    const providers = new Set(resolvedItems.map((item) => item.provider).filter(Boolean))
    const podFields: Row = {
      line_items: lineItems,
      fulfillment_provider: shipsPhysical ? (providers.size > 1 ? "mixed" : resolvedItems.find((item) => item.provider)?.provider) : null,
      fulfillment_id: null,
      fulfillment_status: shipsPhysical ? "pending" : "not_required",
      fulfillment_data: {
        schema_version: 1,
        hosting_plan: hostingTerms.hostingPlan,
        hosting_included_until: hostingTerms.hostingIncludedUntil,
        subscription_status: subscriptionStatus,
      },
      print_file_url: null,
    }

    const { data: order, error } = await insertOrder(supabase, legacyOrder, podFields, hostingTerms.hostingIncludedUntil)

    if (error || !order) {
      // The card was charged. Log everything support needs to reconcile.
      console.error("[checkout] Database error creating order after payment", { paymentId, orderNumber, error })
      return NextResponse.json(
        {
          success: false,
          error: `Your payment went through but we could not save the order. Please contact support with payment ${paymentId}.`,
        },
        { status: 500 },
      )
    }

    let fulfillmentStatus = shipsPhysical ? "pending" : "not_required"
    let memorialUrl: string | null = null
    if (shipsPhysical) {
      try {
        const outcome = await fulfillPaidPhysicalOrder(supabase, order, resolvedItems)
        fulfillmentStatus = outcome.status
        memorialUrl = typeof outcome.details.memorialUrl === "string" ? outcome.details.memorialUrl : null
      } catch (fulfillmentError) {
        // Square has already captured payment. Keep the order and tell support.
        console.error("[checkout] Fulfillment threw after payment:", fulfillmentError)
        fulfillmentStatus = "failed"
      }

      // Best effort: copy the included-hosting end date onto the memorial (needs migration 026).
      if (hostingTerms.hostingIncludedUntil) {
        try {
          const { data: linked } = await supabase.from("orders").select("memorial_id").eq("id", order.id).maybeSingle()
          if (linked?.memorial_id) {
            const { error: hostingError } = await supabase
              .from("memorials")
              .update({ hosting_included_until: hostingTerms.hostingIncludedUntil })
              .eq("id", linked.memorial_id)
            if (hostingError) console.warn("[checkout] memorials.hosting_included_until not saved:", hostingError.message)
          }
        } catch (hostingError) {
          console.warn("[checkout] Could not copy hosting_included_until to memorial:", hostingError)
        }
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
          hostingIncludedUntil: hostingTerms.hostingIncludedUntil,
        }),
      })
    } catch (emailError) {
      console.error("[checkout] Failed to send order confirmation email:", emailError)
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        fulfillmentStatus,
        memorialUrl,
        subscriptionStatus,
        hostingIncludedUntil: hostingTerms.hostingIncludedUntil,
      },
    })
  } catch (error: any) {
    console.error("[checkout] Checkout processing error:", error)
    return NextResponse.json({ success: false, error: error.message || "Unknown server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "/api/checkout/process" })
}
