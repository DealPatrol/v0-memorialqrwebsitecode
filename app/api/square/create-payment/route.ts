import { NextResponse } from "next/server"
import { createHash } from "crypto"
import { priceCart } from "@/lib/checkout-pricing"
import { CHECKOUT_CURRENCY } from "@/lib/site"

export async function POST(req: Request) {
  try {
    const { sourceId, amount, orderId, items, verificationToken, customerEmail, customerName } = await req.json()

    // Validate inputs
    if (!sourceId || !orderId || typeof orderId !== "string") {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Check environment variables
    const accessToken = process.env.SQUARE_ACCESS_TOKEN
    const locationId = process.env.SQUARE_LOCATION_ID
    const environment = process.env.SQUARE_ENVIRONMENT || "sandbox"

    if (!accessToken || !locationId) {
      return NextResponse.json({ success: false, error: "Square not configured" }, { status: 500 })
    }

    // The charge is priced from lib/catalog.ts. The browser amount is only used to
    // catch a stale page, never to decide what the card is charged.
    const cart = priceCart(items)
    if (!cart) {
      return NextResponse.json({ success: false, error: "This product is not available" }, { status: 400 })
    }
    const amountInCents = cart.amountCents
    if (amount !== undefined && Math.round(Number.parseFloat(String(amount)) * 100) !== amountInCents) {
      return NextResponse.json(
        { success: false, error: "The price changed. Refresh the page and try again.", errorCode: "PRICE_MISMATCH" },
        { status: 409 },
      )
    }
    // Same card token + same cart => same key, so a double click or network retry cannot charge twice.
    const idempotencyKey = createHash("sha256")
      .update(`${orderId}:${sourceId}:${amountInCents}:${JSON.stringify(cart.lines.map((line) => [line.id, line.quantity]))}`)
      .digest("hex")
      .slice(0, 40)

    // Determine API URL
    const baseUrl =
      environment === "production" ? "https://connect.squareup.com" : "https://connect.squareupsandbox.com"

    let customerId = null
    let cardId = null

    if (customerEmail && customerName) {
      try {
        const [givenName, ...familyNameParts] = customerName.split(" ")
        const familyName = familyNameParts.join(" ")

        const customerResponse = await fetch(`${baseUrl}/v2/customers`, {
          method: "POST",
          headers: {
            "Square-Version": "2025-09-24",
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idempotency_key: `customer-${orderId}`,
            email_address: customerEmail,
            given_name: givenName,
            family_name: familyName,
          }),
        })

        const customerData = await customerResponse.json()

        if (customerResponse.ok && customerData.customer) {
          customerId = customerData.customer.id
          console.log("[v0] Square customer created:", customerId)

          const cardResponse = await fetch(`${baseUrl}/v2/cards`, {
            method: "POST",
            headers: {
              "Square-Version": "2025-09-24",
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idempotency_key: `card-${orderId}`,
              source_id: sourceId,
              card: {
                customer_id: customerId,
              },
            }),
          })

          const cardData = await cardResponse.json()

          if (cardResponse.ok && cardData.card) {
            cardId = cardData.card.id
            console.log("[v0] Card stored on file:", cardId)
          }
        }
      } catch (customerError) {
        console.error("[v0] Customer/Card creation error:", customerError)
        // Continue with payment even if customer creation fails
      }
    }

    // Call Square API
    const squareResponse = await fetch(`${baseUrl}/v2/payments`, {
      method: "POST",
      headers: {
        "Square-Version": "2024-12-18",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_id: sourceId,
        idempotency_key: idempotencyKey,
        amount_money: {
          amount: amountInCents,
          currency: CHECKOUT_CURRENCY,
        },
        location_id: locationId,
        reference_id: orderId,
        ...(customerId && { customer_id: customerId }),
      }),
    })

    const squareData = await squareResponse.json()

    if (!squareResponse.ok) {
      const errorDetail = squareData.errors?.[0]?.detail || "Payment failed"
      const errorCode = squareData.errors?.[0]?.code || "UNKNOWN"

      let userMessage = errorDetail
      if (errorCode === "INVALID_CARD_DATA") {
        userMessage = "Invalid card information. Please check your card details."
      } else if (errorCode === "CARD_DECLINED") {
        userMessage = "Your card was declined. Please try a different payment method."
      }

      return NextResponse.json(
        {
          success: false,
          error: userMessage,
          errorCode,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: squareData.payment?.id,
        status: squareData.payment?.status,
      },
      customerId,
      cardId,
    })
  } catch (error) {
    console.error("Payment error:", error)
    return NextResponse.json({ success: false, error: "Payment processing failed" }, { status: 500 })
  }
}
