import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createServerSupabaseClient } from "@/lib/supabase"
import { updateOrderWithPaymentStatus } from "@/app/actions/payment"

// This is your Stripe webhook secret for testing your endpoint locally.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16", // Use the latest API version
})

export async function POST(req: NextRequest) {
  console.log("🔔 Webhook received!")

  // Check if webhook secret is properly configured
  if (!webhookSecret) {
    console.error("❌ Stripe webhook secret is missing. Check your environment variables.")
    return NextResponse.json({ error: "Webhook secret is missing" }, { status: 500 })
  }

  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature") as string

    console.log("📝 Processing webhook with signature:", signature.substring(0, 10) + "...")

    let event
    try {
      // Use the current recommended approach for constructing events
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      console.log("✅ Webhook signature verified!")
      console.log(`📣 Event type: ${event.type}`)
    } catch (err: any) {
      console.error(`❌ Webhook signature verification failed: ${err.message}`)
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        console.log(`💰 Checkout session completed: ${session.id}`)

        // Update the order status
        try {
          await updateOrderWithPaymentStatus(session.id, "paid")
          console.log(`✅ Order status updated for session: ${session.id}`)
        } catch (error) {
          console.error(`❌ Failed to update order status: ${error}`)
        }

        // Additional logic for completed checkout
        const supabase = createServerSupabaseClient()

        // Get order details
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .select("*")
          .eq("stripe_session_id", session.id)
          .single()

        if (orderError) {
          console.error(`❌ Failed to fetch order: ${orderError.message}`)
        }

        if (order) {
          console.log(`📋 Found order: ${order.id}`)

          // Create a QR code entry for the order
          try {
            const uniqueCode = `QR${Math.random().toString(36).substring(2, 10).toUpperCase()}`
            const { data: qrCode, error: qrError } = await supabase
              .from("qr_codes")
              .insert({
                order_id: order.id,
                unique_code: uniqueCode,
                design_type: order.metadata?.plan || "premium",
                status: "manufacturing",
              })
              .select()
              .single()

            if (qrError) {
              console.error(`❌ Failed to create QR code: ${qrError.message}`)
            } else {
              console.log(`✅ Created QR code: ${uniqueCode} for order: ${order.id}`)
            }
          } catch (error) {
            console.error(`❌ Error creating QR code: ${error}`)
          }
        }

        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`❌ Payment failed: ${paymentIntent.id}`)

        // Find the session associated with this payment intent
        try {
          const sessions = await stripe.checkout.sessions.list({
            payment_intent: paymentIntent.id,
          })

          if (sessions.data.length > 0) {
            await updateOrderWithPaymentStatus(sessions.data[0].id, "failed")
            console.log(`✅ Order marked as failed for session: ${sessions.data[0].id}`)
          } else {
            console.log(`⚠️ No session found for payment intent: ${paymentIntent.id}`)
          }
        } catch (error) {
          console.error(`❌ Error processing failed payment: ${error}`)
        }

        break
      }

      default: {
        console.log(`⚠️ Unhandled event type: ${event.type}`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error(`❌ Stripe webhook error: ${error}`)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
