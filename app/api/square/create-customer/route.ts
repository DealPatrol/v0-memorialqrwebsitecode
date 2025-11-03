import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log("[v0] Creating Square customer...")

  try {
    const body = await req.json()
    const { email, givenName, familyName, phoneNumber } = body

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    const accessToken = process.env.SQUARE_ACCESS_TOKEN
    const environment = process.env.SQUARE_ENVIRONMENT || "sandbox"

    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Square not configured" }, { status: 500 })
    }

    const baseUrl =
      environment === "production" ? "https://connect.squareup.com" : "https://connect.squareupsandbox.com"

    const idempotencyKey = `customer-${email}-${Date.now()}`

    const response = await fetch(`${baseUrl}/v2/customers`, {
      method: "POST",
      headers: {
        "Square-Version": "2025-09-24",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idempotency_key: idempotencyKey,
        email_address: email,
        given_name: givenName,
        family_name: familyName,
        phone_number: phoneNumber,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("[v0] Square customer creation error:", data)
      return NextResponse.json(
        {
          success: false,
          error: data.errors?.[0]?.detail || "Failed to create customer",
        },
        { status: response.status },
      )
    }

    console.log("[v0] Square customer created:", data.customer?.id)

    return NextResponse.json({
      success: true,
      customer: {
        id: data.customer?.id,
        email: data.customer?.email_address,
      },
    })
  } catch (error) {
    console.error("[v0] Customer creation error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
