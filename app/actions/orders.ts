"use server"

import { createClient } from "@/lib/supabase/server"
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from "@/lib/email"

export interface CreateOrderData {
  customerEmail: string
  customerName: string
  customerPhone?: string
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    zip: string
    country?: string
  }
  paymentId?: string
  amountCents: number
  productType: string
  productName: string
  quantity?: number
  specialInstructions?: string
}

export async function createOrder(data: CreateOrderData) {
  try {
    const supabase = await createClient()

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_email: data.customerEmail,
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        shipping_address_line1: data.shippingAddress.line1,
        shipping_address_line2: data.shippingAddress.line2,
        shipping_city: data.shippingAddress.city,
        shipping_state: data.shippingAddress.state,
        shipping_zip: data.shippingAddress.zip,
        shipping_country: data.shippingAddress.country || "US",
        payment_id: data.paymentId,
        payment_status: data.paymentId ? "completed" : "pending",
        amount_cents: data.amountCents,
        product_type: data.productType,
        product_name: data.productName,
        quantity: data.quantity || 1,
        special_instructions: data.specialInstructions,
        status: "processing",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating order:", error)
      return { success: false, error: error.message }
    }

    console.log("[v0] Order created successfully:", order.order_number)

    const emailData = {
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      orderNumber: order.order_number,
      orderDate: new Date(order.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      productName: data.productName,
      amount: `$${(data.amountCents / 100).toFixed(2)}`,
      shippingAddress: data.shippingAddress,
    }

    // Send customer confirmation email (don't block on failure)
    sendOrderConfirmationEmail(emailData).catch((error) => {
      console.error("[v0] Failed to send customer confirmation email:", error)
    })

    // Send admin notification email (don't block on failure)
    sendAdminOrderNotification(emailData).catch((error) => {
      console.error("[v0] Failed to send admin notification email:", error)
    })

    return { success: true, order }
  } catch (error) {
    console.error("[v0] Exception creating order:", error)
    return { success: false, error: "Failed to create order" }
  }
}

export async function getOrderByNumber(orderNumber: string) {
  try {
    const supabase = await createClient()

    const { data: order, error } = await supabase.from("orders").select("*").eq("order_number", orderNumber).single()

    if (error) {
      console.error("[v0] Error fetching order:", error)
      return { success: false, error: error.message }
    }

    return { success: true, order }
  } catch (error) {
    console.error("[v0] Exception fetching order:", error)
    return { success: false, error: "Failed to fetch order" }
  }
}

export async function getAllOrders() {
  try {
    const supabase = await createClient()

    const { data: orders, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching orders:", error)
      return { success: false, error: error.message }
    }

    return { success: true, orders }
  } catch (error) {
    console.error("[v0] Exception fetching orders:", error)
    return { success: false, error: "Failed to fetch orders" }
  }
}

export async function updateOrderStatus(orderId: string, status: string, adminNotes?: string) {
  try {
    const supabase = await createClient()

    const updateData: any = { status }
    if (adminNotes) {
      updateData.admin_notes = adminNotes
    }

    const { data: order, error } = await supabase.from("orders").update(updateData).eq("id", orderId).select().single()

    if (error) {
      console.error("[v0] Error updating order:", error)
      return { success: false, error: error.message }
    }

    return { success: true, order }
  } catch (error) {
    console.error("[v0] Exception updating order:", error)
    return { success: false, error: "Failed to update order" }
  }
}

export async function linkOrderToMemorial(orderId: string, memorialId: string) {
  try {
    const supabase = await createClient()

    const { data: order, error } = await supabase
      .from("orders")
      .update({ memorial_id: memorialId })
      .eq("id", orderId)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error linking order to memorial:", error)
      return { success: false, error: error.message }
    }

    return { success: true, order }
  } catch (error) {
    console.error("[v0] Exception linking order to memorial:", error)
    return { success: false, error: "Failed to link order to memorial" }
  }
}
