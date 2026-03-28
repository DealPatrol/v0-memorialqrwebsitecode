import { headers } from "next/headers"
import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { sendOrderConfirmationEmail } from "@/lib/email"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    // Note: In production, set up STRIPE_WEBHOOK_SECRET env var
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } else {
      // For development without webhook secret
      event = JSON.parse(body)
    }
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session

      // Extract metadata
      const metadata = session.metadata || {}
      const customerEmail = session.customer_email || ""
      const customerName = metadata.customerName || ""

      try {
        const supabase = await createServerSupabaseClient()

        // Create order in database
        const orderNumber = `MQR-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            order_number: orderNumber,
            customer_name: customerName,
            customer_email: customerEmail,
            package_type: metadata.packageId || "standard",
            plaque_color: metadata.plaqueColor || "black",
            box_personalization: metadata.boxPersonalization || "",
            addon_wooden_qr: metadata.addonIds?.includes("wooden_qr") || false,
            addon_picture_plaque: metadata.addonIds?.includes("picture_plaque") || false,
            addon_stone_qr: metadata.addonIds?.includes("stone_qr") || false,
            address_line1: metadata.shippingLine1 || "",
            address_line2: metadata.shippingLine2 || "",
            city: metadata.shippingCity || "",
            state: metadata.shippingState || "",
            zip: metadata.shippingPostalCode || "",
            payment_id: session.payment_intent as string,
            payment_status: "completed",
            total_amount: (session.amount_total || 0) / 100,
            status: "pending",
          })
          .select()
          .single()

        if (orderError) {
          console.error("Failed to create order:", orderError)
        } else {
          // Send confirmation email
          await sendOrderConfirmationEmail({
            customerEmail,
            customerName,
            orderNumber,
            packageType: metadata.packageId || "standard",
            totalAmount: (session.amount_total || 0) / 100,
          })
        }
      } catch (error) {
        console.error("Error processing checkout.session.completed:", error)
      }
      break
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.error("Payment failed:", paymentIntent.id)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
