import { headers } from "next/headers"
import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { getStripe } from "@/lib/stripe"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from "@/lib/email"
import { getProductById } from "@/lib/products"

export async function POST(req: Request) {
  const stripe = getStripe()
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } else if (process.env.NODE_ENV === "development") {
      // Allow unsigned events only in local development
      event = JSON.parse(body) as Stripe.Event
    } else {
      console.error("[stripe] STRIPE_WEBHOOK_SECRET is not configured")
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }
  } catch (err: any) {
    console.error("[stripe] Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session

      const metadata = session.metadata || {}
      const customerEmail = session.customer_details?.email || session.customer_email || ""
      const customerName = session.customer_details?.name || metadata.customerName || "Valued Customer"
      const shipping = session.collected_information?.shipping_details?.address

      try {
        const supabase = await createServerSupabaseClient()

        // Idempotency: skip if order already exists for this payment
        const { data: existingOrder } = await supabase
          .from("orders")
          .select("id")
          .eq("payment_id", session.payment_intent as string)
          .maybeSingle()

        if (existingOrder) {
          console.log("[stripe] Order already processed for payment:", session.payment_intent)
          break
        }

        const orderNumber = `MQR-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

        // Build a human-readable product name from session metadata
        let productName = "Memorial QR Package"
        try {
          const items: Array<{ productId: string; quantity: number }> = JSON.parse(metadata.items || "[]")
          if (items.length > 0) {
            productName = items
              .map((item) => {
                const product = getProductById(item.productId)
                return product
                  ? `${product.name}${item.quantity > 1 ? ` ×${item.quantity}` : ""}`
                  : item.productId
              })
              .join(", ")
          }
        } catch {}

        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            order_number: orderNumber,
            customer_name: customerName,
            customer_email: customerEmail,
            package_type: metadata.packageId || "store-purchase",
            plaque_color: metadata.plaqueColor || "black",
            box_personalization: metadata.boxPersonalization || "",
            addon_wooden_qr: (metadata.addonIds || "").includes("wooden_qr"),
            addon_picture_plaque: (metadata.addonIds || "").includes("picture_plaque"),
            addon_stone_qr: (metadata.addonIds || "").includes("stone_qr"),
            address_line1: shipping?.line1 || metadata.shippingLine1 || "",
            address_line2: shipping?.line2 || metadata.shippingLine2 || "",
            city: shipping?.city || metadata.shippingCity || "",
            state: shipping?.state || metadata.shippingState || "",
            zip: shipping?.postal_code || metadata.shippingPostalCode || "",
            payment_id: session.payment_intent as string,
            payment_status: "completed",
            total_amount: (session.amount_total || 0) / 100,
            status: "pending",
          })
          .select()
          .single()

        if (orderError) {
          console.error("[stripe] Failed to create order:", orderError)
          break
        }

        const emailData = {
          customerName,
          customerEmail,
          orderNumber,
          orderDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
          productName,
          amount: `$${((session.amount_total || 0) / 100).toFixed(2)}`,
          shippingAddress: {
            line1: shipping?.line1 || "",
            line2: shipping?.line2 || undefined,
            city: shipping?.city || "",
            state: shipping?.state || "",
            zip: shipping?.postal_code || "",
          },
        }

        try {
          await sendOrderConfirmationEmail(emailData)
        } catch (emailError) {
          console.error("[stripe] Failed to send confirmation email:", emailError)
        }

        try {
          await sendAdminOrderNotification(emailData)
        } catch (adminError) {
          console.error("[stripe] Failed to send admin notification:", adminError)
        }
      } catch (error) {
        console.error("[stripe] Error processing checkout.session.completed:", error)
      }
      break
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.error("[stripe] Payment failed:", paymentIntent.id)

      try {
        const supabase = await createServerSupabaseClient()
        await supabase
          .from("orders")
          .update({ payment_status: "failed", status: "cancelled" })
          .eq("payment_id", paymentIntent.id)
      } catch (error) {
        console.error("[stripe] Failed to update order for failed payment:", error)
      }
      break
    }

    // ── Subscription events ────────────────────────────────────────────────

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription
      console.log(
        `[stripe] Subscription ${event.type}: ${subscription.id} → status=${subscription.status}`,
      )
      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      console.log(`[stripe] Subscription cancelled: ${subscription.id}`)
      break
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice
      console.log(
        `[stripe] Invoice paid: ${invoice.id} amount=${(invoice.amount_paid / 100).toFixed(2)} customer=${invoice.customer}`,
      )
      break
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice
      console.error(
        `[stripe] Invoice payment failed: ${invoice.id} customer=${invoice.customer}`,
      )
      break
    }

    default:
      console.log(`[stripe] Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
