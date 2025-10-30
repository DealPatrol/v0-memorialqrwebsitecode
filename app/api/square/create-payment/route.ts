import { type NextRequest, NextResponse } from "next/server"
import { getSquareClient } from "@/lib/square"

export async function POST(request: NextRequest) {
  console.log("[v0] Square payment API called")

  try {
    if (!process.env.SQUARE_ACCESS_TOKEN) {
      console.error("[v0] Missing SQUARE_ACCESS_TOKEN")
      return NextResponse.json({ success: false, error: "Square access token not configured" }, { status: 500 })
    }

    if (!process.env.SQUARE_LOCATION_ID) {
      console.error("[v0] Missing SQUARE_LOCATION_ID")
      return NextResponse.json({ success: false, error: "Square location ID not configured" }, { status: 500 })
    }

    const body = await request.json()
    console.log("[v0] Request body:", { ...body, sourceId: "***" })

    const { sourceId, amount, currency = "USD", orderId } = body

    if (!sourceId || !amount) {
      console.error("[v0] Missing required fields:", { sourceId: !!sourceId, amount: !!amount })
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Initializing Square client")
    const squareClient = getSquareClient()
    const { paymentsApi } = squareClient

    console.log("[v0] Creating payment with amount:", amount)
    const payment = await paymentsApi.createPayment({
      sourceId,
      amountMoney: {
        amount: BigInt(Math.round(amount * 100)), // Convert to cents
        currency,
      },
      idempotencyKey: crypto.randomUUID(),
      locationId: process.env.SQUARE_LOCATION_ID,
      referenceId: orderId,
    })

    console.log("[v0] Payment successful:", payment.result.payment?.id)
    return NextResponse.json({
      success: true,
      payment: payment.result.payment,
    })
  } catch (error: any) {
    console.error("[v0] Square payment error:", error)
    console.error("[v0] Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack?.split("\n").slice(0, 3).join("\n"),
    })

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Payment processing failed",
        details: error.errors || undefined,
      },
      { status: 500 },
    )
  }
}
