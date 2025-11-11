import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log("[v0] Saving card on file...")

  try {
    const body = await req.json()
    const { customerId, sourceId } = body

    if (!customerId || !sourceId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const accessToken = process.env.SQUARE_ACCESS_TOKEN
    const environment = process.env.SQUARE_ENVIRONMENT || "sandbox"

    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Square not configured" }, { status: 500 })
    }

    const baseUrl =
      environment === "production" ? "https://connect.squareup.com" : "https://connect.squareupsandbox.com"

    const idempotencyKey = `card-${customerId}-${Date.now()}`

    const response = await fetch(`${baseUrl}/v2/cards`, {
      method: "POST",
      headers: {
        "Square-Version": "2025-09-24",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idempotency_key: idempotencyKey,
        source_id: sourceId,
        card: {
          customer_id: customerId,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("[v0] Square card creation error:", data)
      return NextResponse.json(
        {
          success: false,
          error: data.errors?.[0]?.detail || "Failed to save card",
        },
        { status: response.status },
      )
    }

    console.log("[v0] Card saved:", data.card?.id)

    return NextResponse.json({
      success: true,
      card: {
        id: data.card?.id,
        last4: data.card?.last_4,
        brand: data.card?.card_brand,
      },
    })
  } catch (error) {
    console.error("[v0] Card creation error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
