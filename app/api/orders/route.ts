import { type NextRequest, NextResponse } from "next/server"
import { createOrder } from "@/app/actions/orders"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = await createOrder({
      customerEmail: body.customerEmail,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      shippingAddress: body.shippingAddress,
      paymentId: body.paymentId,
      amountCents: body.amountCents,
      productType: body.productType,
      productName: body.productName,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Link order to memorial if memorialId provided
    if (body.memorialId && result.order) {
      const { linkOrderToMemorial } = await import("@/app/actions/orders")
      await linkOrderToMemorial(result.order.id, body.memorialId)
    }

    return NextResponse.json({ order: result.order }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Exception creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
