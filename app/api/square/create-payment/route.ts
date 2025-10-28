import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log("[v0] === PAYMENT API CALLED ===")

  try {
    const body = await req.json()
    console.log("[v0] Request body received:", body)

    const { sourceId, amount, orderId } = body

    // Validate inputs
    if (!sourceId || !amount || !orderId) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Check environment variables
    const accessToken = process.env.SQUARE_ACCESS_TOKEN
    const locationId = process.env.SQUARE_LOCATION_ID
    const environment = process.env.SQUARE_ENVIRONMENT || "sandbox"

    console.log("[v0] Environment check:", {
      hasAccessToken: !!accessToken,
      hasLocationId: !!locationId,
      environment,
    })

    if (!accessToken || !locationId) {
      console.log("[v0] Missing Square credentials")
      return NextResponse.json({ success: false, error: "Square not configured" }, { status: 500 })
    }

    // Generate idempotency key
    const idempotencyKey = `${orderId}-${Date.now()}-${Math.random().toString(36).substring(7)}`
    console.log("[v0] Generated idempotency key:", idempotencyKey)

    // Convert amount to cents
    const amountInCents = Math.round(amount * 100)
    console.log("[v0] Amount in cents:", amountInCents)

    // Determine API URL
    const baseUrl =
      environment === "production" ? "https://connect.squareup.com" : "https://connect.squareupsandbox.com"

    console.log("[v0] Calling Square API at:", `${baseUrl}/v2/payments`)

    // Call Square API
    const squareResponse = await fetch(`${baseUrl}/v2/payments`, {
      method: "POST",
      headers: {
        "Square-Version": "2025-09-24",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_id: sourceId,
        idempotency_key: idempotencyKey,
        amount_money: {
          amount: amountInCents,
          currency: "USD",
        },
        location_id: locationId,
        reference_id: orderId,
      }),
    })

    console.log("[v0] Square response status:", squareResponse.status)

    const squareData = await squareResponse.json()
    console.log("[v0] Square response data:", JSON.stringify(squareData, null, 2))

    if (!squareResponse.ok) {
      console.log("[v0] Square API error")
      return NextResponse.json(
        {
          success: false,
          error: squareData.errors?.[0]?.detail || "Payment failed",
        },
        { status: squareResponse.status },
      )
    }

    console.log("[v0] Payment successful!")

    return NextResponse.json({
      success: true,
      payment: {
        id: squareData.payment?.id,
        status: squareData.payment?.status,
        amount: squareData.payment?.amount_money,
        orderId: squareData.payment?.reference_id,
      },
    })
  } catch (error) {
    console.error("[v0] PAYMENT ERROR:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
