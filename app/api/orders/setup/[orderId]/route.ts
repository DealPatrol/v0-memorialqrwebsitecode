import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function GET(_request: Request, { params }: { params: { orderId: string } }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Sign in to access this order" }, { status: 401 })
  }

  const serviceRole = createServiceRoleClient()
  const { data: order, error } = await serviceRole
    .from("orders")
    .select("id, customer_email, customer_name, product_name, user_id")
    .eq("id", params.orderId)
    .maybeSingle()

  const ownsOrder =
    order &&
    (order.user_id === user.id ||
      (user.email && order.customer_email.toLowerCase() === user.email.toLowerCase()))

  if (error || !ownsOrder) {
    return NextResponse.json({ error: "A matching paid order is required" }, { status: 403 })
  }

  return NextResponse.json({ order })
}
