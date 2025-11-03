import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/email"

export async function POST(req: Request) {
  console.log("[v0] Webhook received from Square")

  try {
    const body = await req.json()
    const { type, data } = body

    console.log("[v0] Webhook type:", type)

    // Handle subscription payment events
    if (type === "subscription.charged") {
      await handleSubscriptionCharged(data)
    } else if (type === "subscription.payment_failed") {
      await handleSubscriptionPaymentFailed(data)
    } else if (type === "subscription.canceled") {
      await handleSubscriptionCanceled(data)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Webhook processing error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

async function handleSubscriptionCharged(data: any) {
  console.log("[v0] Processing subscription charge:", data.id)

  const supabase = await createClient()
  const subscriptionId = data.object?.subscription?.id
  const invoiceId = data.id

  if (!subscriptionId) {
    console.error("[v0] No subscription ID in webhook data")
    return
  }

  // Find the order associated with this subscription
  const { data: order } = await supabase.from("orders").select("*").eq("subscription_id", subscriptionId).single()

  if (!order) {
    console.error("[v0] No order found for subscription:", subscriptionId)
    return
  }

  // Record the payment
  await supabase.from("subscription_payments").insert({
    order_id: order.id,
    subscription_id: subscriptionId,
    payment_id: invoiceId,
    amount_cents: order.monthly_amount_cents || 499,
    currency: "USD",
    status: "completed",
    processed_at: new Date().toISOString(),
  })

  // Send confirmation email to customer
  await sendEmail({
    to: order.customer_email,
    subject: "Memorial QR - Monthly Payment Received",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2D1B4E;">Payment Received</h2>
        <p>Hi ${order.customer_name},</p>
        <p>We've successfully processed your monthly payment of $4.99 for your Memorial QR hosting and maintenance.</p>
        <p><strong>Order Number:</strong> ${order.order_number}</p>
        <p><strong>Amount:</strong> $4.99</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p>Your memorial will continue to be hosted and maintained without interruption.</p>
        <p>Thank you for your continued trust in Memorial QR.</p>
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          If you have any questions, please contact us at ${process.env.ADMIN_EMAIL}
        </p>
      </div>
    `,
  })

  console.log("[v0] Subscription payment recorded successfully")
}

async function handleSubscriptionPaymentFailed(data: any) {
  console.log("[v0] Processing failed subscription payment:", data.id)

  const supabase = await createClient()
  const subscriptionId = data.object?.subscription?.id

  if (!subscriptionId) return

  // Find the order
  const { data: order } = await supabase.from("orders").select("*").eq("subscription_id", subscriptionId).single()

  if (!order) return

  // Record the failed payment
  await supabase.from("subscription_payments").insert({
    order_id: order.id,
    subscription_id: subscriptionId,
    amount_cents: order.monthly_amount_cents || 499,
    currency: "USD",
    status: "failed",
    failure_reason: data.object?.errors?.[0]?.detail || "Payment declined",
    processed_at: new Date().toISOString(),
  })

  // Send notification email
  await sendEmail({
    to: order.customer_email,
    subject: "Memorial QR - Payment Failed",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #DC2626;">Payment Failed</h2>
        <p>Hi ${order.customer_name},</p>
        <p>We were unable to process your monthly payment of $4.99 for your Memorial QR subscription.</p>
        <p><strong>Order Number:</strong> ${order.order_number}</p>
        <p><strong>Reason:</strong> ${data.object?.errors?.[0]?.detail || "Payment declined"}</p>
        <p>Please update your payment method to avoid service interruption.</p>
        <p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account/billing" 
             style="display: inline-block; background: #2D1B4E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
            Update Payment Method
          </a>
        </p>
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          If you have questions, contact us at ${process.env.ADMIN_EMAIL}
        </p>
      </div>
    `,
  })

  console.log("[v0] Failed payment notification sent")
}

async function handleSubscriptionCanceled(data: any) {
  console.log("[v0] Processing subscription cancellation:", data.id)

  const supabase = await createClient()
  const subscriptionId = data.object?.subscription?.id

  if (!subscriptionId) return

  // Update order status
  await supabase.from("orders").update({ status: "subscription_canceled" }).eq("subscription_id", subscriptionId)

  console.log("[v0] Subscription marked as canceled")
}
