import { createClient } from "@/lib/supabase/server"

export interface OrderItem {
  productId: string
  quantity: number
  name: string
  priceInCents: number
}

export interface OrderFulfillmentData {
  sessionId: string
  customerId: string
  customerEmail: string
  customerName: string
  totalInCents: number
  items: OrderItem[]
  shippingAddress?: {
    name: string
    email: string
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  status: "pending" | "processing" | "shipped" | "delivered"
  memorialId?: string
}

/**
 * Process a completed order and store it in the database
 * Called when Stripe webhook confirms successful payment
 */
export async function processOrder(orderData: OrderFulfillmentData) {
  try {
    const supabase = await createClient()

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`

    // Insert order into database
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        stripe_session_id: orderData.sessionId,
        customer_email: orderData.customerEmail,
        customer_name: orderData.customerName,
        total_cents: orderData.totalInCents,
        items: orderData.items,
        shipping_address: orderData.shippingAddress,
        status: "processing", // Start as processing
        memorial_id: orderData.memorialId || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Order processing error:", error.message)
      throw error
    }

    console.log("[v0] Order processed successfully:", orderNumber)

    return {
      success: true,
      orderNumber,
      order,
    }
  } catch (error) {
    console.error("[v0] Failed to process order:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process order",
    }
  }
}

/**
 * Update order status (e.g., shipped, delivered)
 */
export async function updateOrderStatus(
  orderNumber: string,
  status: "pending" | "processing" | "shipped" | "delivered",
) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("order_number", orderNumber)
      .select()
      .single()

    if (error) throw error

    console.log(`[v0] Order ${orderNumber} updated to ${status}`)
    return { success: true, order: data }
  } catch (error) {
    console.error("[v0] Failed to update order status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update order status",
    }
  }
}

/**
 * Get order by order number
 */
export async function getOrderByNumber(orderNumber: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .single()

    if (error) throw error

    return { success: true, order: data }
  } catch (error) {
    console.error("[v0] Failed to fetch order:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch order",
    }
  }
}

/**
 * Get orders by customer email
 */
export async function getOrdersByCustomerEmail(email: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_email", email)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, orders: data }
  } catch (error) {
    console.error("[v0] Failed to fetch orders:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch orders",
    }
  }
}

/**
 * Link an order to a memorial (useful for orders that include memorial items)
 */
export async function linkOrderToMemorial(orderNumber: string, memorialId: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("orders")
      .update({ memorial_id: memorialId })
      .eq("order_number", orderNumber)
      .select()
      .single()

    if (error) throw error

    console.log(`[v0] Order ${orderNumber} linked to memorial ${memorialId}`)
    return { success: true, order: data }
  } catch (error) {
    console.error("[v0] Failed to link order to memorial:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to link order to memorial",
    }
  }
}
