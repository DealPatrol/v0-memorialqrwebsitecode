import { NextResponse } from "next/server"
import { linkOrderToMemorial } from "@/app/actions/orders"

export async function POST(req: Request) {
  try {
    const { orderId, memorialId } = await req.json()

    if (!orderId || !memorialId) {
      return NextResponse.json({ success: false, error: "Missing orderId or memorialId" }, { status: 400 })
    }

    const result = await linkOrderToMemorial(orderId, memorialId)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, order: result.order })
  } catch (error) {
    console.error("[v0] Error linking memorial to order:", error)
    return NextResponse.json({ success: false, error: "Failed to link memorial to order" }, { status: 500 })
  }
}
