import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log("[v0] Creating Square subscription...")

  try {
    const body = await req.json()
    const { customerId, cardId, planVariationId, orderId } = body

    // Validate inputs
    if (!customerId || !cardId || !planVariationId || !orderId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Check environment variables
    const accessToken = process.env.SQUARE_ACCESS_TOKEN
    const locationId = process.env.SQUARE_LOCATION_ID
    const environment = process.env.SQUARE_ENVIRONMENT || "sandbox"

    if (!accessToken || !locationId) {
      return NextResponse.json({ success: false, error: "Square not configured" }, { status: 500 })
    }

    // Generate idempotency key
    const idempotencyKey = `sub-${orderId}-${Date.now()}`

    // Determine API URL
    const baseUrl =
      environment === "production" ? "https://connect.squareup.com" : "https://connect.squareupsandbox.com"

    console.log("[v0] Creating subscription with Square API...")

    // Create subscription
    const subscriptionResponse = await fetch(`${baseUrl}/v2/subscriptions`, {
      method: "POST",
      headers: {
        "Square-Version": "2025-09-24",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idempotency_key: idempotencyKey,
        location_id: locationId,
        customer_id: customerId,
        plan_variation_id: planVariationId,
        card_id: cardId,
        start_date: new Date().toISOString().split("T")[0], // Start today
      }),
    })

    const subscriptionData = await subscriptionResponse.json()
    console.log("[v0] Square subscription response:", JSON.stringify(subscriptionData, null, 2))

    if (!subscriptionResponse.ok) {
      console.error("[v0] Square subscription error:", subscriptionData)
      return NextResponse.json(
        {
          success: false,
          error: subscriptionData.errors?.[0]?.detail || "Failed to create subscription",
        },
        { status: subscriptionResponse.status },
      )
    }

    console.log("[v0] Subscription created successfully:", subscriptionData.subscription?.id)

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscriptionData.subscription?.id,
        status: subscriptionData.subscription?.status,
        customerId: subscriptionData.subscription?.customer_id,
      },
    })
  } catch (error) {
    console.error("[v0] Subscription creation error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
