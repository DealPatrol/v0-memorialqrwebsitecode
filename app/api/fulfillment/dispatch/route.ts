import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { dispatchOrderFulfillment } from "@/lib/fulfillment-dispatcher"

export async function POST(req: NextRequest) {
  try {
    const { orderId, printFileUrl } = await req.json()

    if (!orderId) {
      return NextResponse.json({ success: false, error: "orderId is required" }, { status: 400 })
    }

    // Authenticate user or check admin / service role
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const serviceRole = createServiceRoleClient()
    const { data: order, error: orderError } = await serviceRole
      .from("orders")
      .select("id, user_id, customer_email, payment_status")
      .eq("id", orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    // Ensure order is owned by authenticated user or admin
    if (user) {
      const orderEmail = order.customer_email?.toLowerCase()
      const userEmail = user.email?.toLowerCase()
      const isOwner = order.user_id === user.id || (Boolean(orderEmail) && orderEmail === userEmail)
      if (!isOwner) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
      }
    }

    const result = await dispatchOrderFulfillment(orderId, printFileUrl)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("[Fulfillment Dispatch] Error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to dispatch fulfillment" },
      { status: 500 },
    )
  }
}
