import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { CHECKOUT_CURRENCY } from "@/lib/site"
import { resolveConfiguredCheckoutItems } from "@/lib/fulfillment-availability"
import { quoteCheckout } from "@/lib/checkout-quote"
import { createSquareCustomer, createSquarePayment, getSquareConfig, saveCardFromPayment } from "@/lib/square-api"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Charges the card token for the server-computed cart total.
 * When the cart needs monthly hosting, a Square customer is created first and the card
 * is saved from the completed payment so /api/checkout/process can start the subscription.
 */
export async function POST(req: Request) {
  try {
    const { sourceId, verificationToken, items, orderId, customerEmail, customerName } = await req.json()

    if (!sourceId || typeof sourceId !== "string") {
      return NextResponse.json({ success: false, error: "Missing card details" }, { status: 400 })
    }
    if (!customerEmail || typeof customerEmail !== "string" || !EMAIL_PATTERN.test(customerEmail)) {
      return NextResponse.json({ success: false, error: "Enter a valid email address" }, { status: 400 })
    }

    const resolvedItems = resolveConfiguredCheckoutItems(items)
    if (!resolvedItems) {
      return NextResponse.json({ success: false, error: "This product is not available" }, { status: 400 })
    }
    const quoted = quoteCheckout(resolvedItems)
    if (!quoted.ok) {
      return NextResponse.json({ success: false, error: quoted.error }, { status: 400 })
    }
    const { quote } = quoted

    const square = getSquareConfig()
    if (!square) {
      return NextResponse.json({ success: false, error: "Square not configured" }, { status: 500 })
    }

    const referenceId = typeof orderId === "string" && orderId ? orderId : `order_${Date.now()}`

    let customerId: string | null = null
    if (quote.needsSubscription) {
      const customer = await createSquareCustomer(square, {
        email: customerEmail,
        name: typeof customerName === "string" ? customerName : undefined,
        idempotencyKey: randomUUID(),
        referenceId,
      })
      if (!customer.ok) {
        console.error("[checkout] Square customer creation failed before charging:", customer.error)
        return NextResponse.json(
          { success: false, error: "We could not set up monthly billing. Your card was not charged. Please try again." },
          { status: 502 },
        )
      }
      customerId = customer.data.customer.id
    }

    const payment = await createSquarePayment(square, {
      sourceId,
      verificationToken: typeof verificationToken === "string" ? verificationToken : undefined,
      amountCents: quote.totalCents,
      currency: CHECKOUT_CURRENCY,
      idempotencyKey: randomUUID(),
      referenceId,
      customerId,
      buyerEmail: customerEmail,
      note: resolvedItems.map((item) => `${item.id} x${item.quantity}`).join(", "),
    })

    if (!payment.ok) {
      let userMessage = payment.error || "Payment failed"
      if (payment.code === "INVALID_CARD_DATA") userMessage = "Invalid card information. Please check your card details."
      if (payment.code === "CARD_DECLINED") userMessage = "Your card was declined. Please try a different payment method."
      return NextResponse.json({ success: false, error: userMessage, errorCode: payment.code || "UNKNOWN" }, { status: 400 })
    }

    let cardId: string | null = null
    if (quote.needsSubscription && customerId) {
      const card = await saveCardFromPayment(square, {
        paymentId: payment.data.payment.id,
        customerId,
        idempotencyKey: randomUUID(),
      })
      if (card.ok) {
        cardId = card.data.card.id
      } else {
        // The charge succeeded. Checkout records the order and flags the missing subscription.
        console.error("[checkout] Card could not be saved after payment:", card.error)
      }
    }

    return NextResponse.json({
      success: true,
      payment: { id: payment.data.payment.id, status: payment.data.payment.status },
      customerId,
      cardId,
    })
  } catch (error) {
    console.error("Payment error:", error)
    return NextResponse.json({ success: false, error: "Payment processing failed" }, { status: 500 })
  }
}
