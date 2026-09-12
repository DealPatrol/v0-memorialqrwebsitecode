import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { submitPrintfulOrder, type PrintfulItem } from "@/lib/printful"
import { submitPrintifyOrder, type PrintifyItem } from "@/lib/printify"
import type { PodOrderLineItem } from "@/lib/checkout-products"

export type DispatchResult = {
  success: boolean
  orderId: string
  fulfillmentStatus: string
  fulfillmentId?: string | null
  error?: string
  details?: Record<string, unknown>
}

export async function dispatchOrderFulfillment(
  orderId: string,
  overridePrintFileUrl?: string | null,
): Promise<DispatchResult> {
  const supabase = createServiceRoleClient()

  // Retrieve order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single()

  if (orderError || !order) {
    return {
      success: false,
      orderId,
      fulfillmentStatus: "failed",
      error: orderError?.message || "Order not found",
    }
  }

  if (order.payment_status !== "completed") {
    return {
      success: false,
      orderId,
      fulfillmentStatus: "payment_pending",
      error: "Order payment has not been completed",
    }
  }

  if (
    order.fulfillment_id ||
    ["dispatching", "submitted", "in_production", "shipped"].includes(order.fulfillment_status)
  ) {
    return {
      success: true,
      orderId,
      fulfillmentStatus: order.fulfillment_status,
      fulfillmentId: order.fulfillment_id,
    }
  }

  const printFileUrl = overridePrintFileUrl || order.print_file_url
  if (!printFileUrl) {
    return {
      success: false,
      orderId,
      fulfillmentStatus: "awaiting_print_file",
      error: "No QR print file URL available for this order",
    }
  }

  const lineItems: PodOrderLineItem[] = Array.isArray(order.line_items) ? order.line_items : []
  if (lineItems.length === 0) {
    await supabase.from("orders").update({ fulfillment_status: "awaiting_configuration" }).eq("id", order.id)
    return {
      success: false,
      orderId,
      fulfillmentStatus: "awaiting_configuration",
      error: "Order has no fulfillment line items",
    }
  }

  if (order.fulfillment_status !== "ready_for_fulfillment") {
    return {
      success: false,
      orderId,
      fulfillmentStatus: order.fulfillment_status || "awaiting_configuration",
      error: "Order is not ready for fulfillment",
    }
  }

  const { data: claimedOrder, error: claimError } = await supabase
    .from("orders")
    .update({ fulfillment_status: "dispatching" })
    .eq("id", order.id)
    .eq("fulfillment_status", "ready_for_fulfillment")
    .is("fulfillment_id", null)
    .select("id")
    .maybeSingle()

  if (claimError || !claimedOrder) {
    return {
      success: false,
      orderId,
      fulfillmentStatus: claimError ? "awaiting_configuration" : "dispatching",
      error: claimError?.message || "Order fulfillment is already being dispatched",
    }
  }

  const printfulItems = lineItems.filter((item) => item.fulfillment_provider === "printful")
  const printifyItems = lineItems.filter((item) => item.fulfillment_provider === "printify")

  const recipient = {
    name: order.customer_name || "Customer",
    address1: order.shipping_address_line1 || "",
    address2: order.shipping_address_line2 || null,
    city: order.shipping_city || "",
    state_code: order.shipping_state || null,
    region: order.shipping_state || null,
    country: order.shipping_country || "CA",
    country_code: order.shipping_country || "CA",
    zip: order.shipping_zip || "",
    email: order.customer_email || "",
    phone: order.customer_phone || null,
  }

  let finalFulfillmentId: string | null = null
  let finalStatus: string = "submitted"
  const dispatchDetails: Record<string, unknown> = {}

  // 1. Submit Printful items if any exist
  if (printfulItems.length > 0) {
    const items: PrintfulItem[] = printfulItems.map((item) => ({
      sync_variant_id: item.provider_template_id ? Number(item.provider_template_id) : undefined,
      quantity: item.quantity,
      print_file_url: printFileUrl,
    }))

    const printfulResult = await submitPrintfulOrder({
      orderNumber: order.order_number,
      recipient,
      items,
      autoConfirm: process.env.PRINTFUL_AUTO_CONFIRM === "true",
    })

    dispatchDetails.printful = printfulResult
    if (printfulResult.status === "awaiting_configuration") {
      finalStatus = "awaiting_configuration"
    } else if (printfulResult.status === "failed") {
      finalStatus = "failed"
    } else {
      finalFulfillmentId = printfulResult.fulfillmentId
    }
  }

  // 2. Submit Printify items if any exist
  if (printifyItems.length > 0) {
    const items: PrintifyItem[] = printifyItems.map((item) => ({
      productId: item.provider_template_id || null,
      variantId: process.env.PRINTIFY_DEFAULT_VARIANT_ID
        ? Number(process.env.PRINTIFY_DEFAULT_VARIANT_ID)
        : null,
      quantity: item.quantity,
      print_file_url: printFileUrl,
    }))

    const printifyResult = await submitPrintifyOrder({
      orderNumber: order.order_number,
      recipient,
      items,
      autoSendToProduction: process.env.PRINTIFY_AUTO_PRODUCTION === "true",
    })

    dispatchDetails.printify = printifyResult
    if (printifyResult.status === "awaiting_configuration") {
      if (finalStatus !== "failed") finalStatus = "awaiting_configuration"
    } else if (printifyResult.status === "failed") {
      finalStatus = "failed"
    } else {
      finalFulfillmentId = finalFulfillmentId || printifyResult.fulfillmentId
    }
  }

  // Update order record
  const updatePayload = {
    fulfillment_status: finalStatus,
    fulfillment_id: finalFulfillmentId,
    fulfillment_data: {
      ...(typeof order.fulfillment_data === "object" ? order.fulfillment_data : {}),
      dispatched_at: new Date().toISOString(),
      details: dispatchDetails,
    },
    print_file_url: printFileUrl,
  }

  const { error: updateError } = await supabase.from("orders").update(updatePayload).eq("id", order.id)
  if (updateError) {
    return {
      success: false,
      orderId,
      fulfillmentStatus: "dispatching",
      fulfillmentId: finalFulfillmentId,
      error: updateError.message,
      details: dispatchDetails,
    }
  }

  return {
    success: finalStatus !== "failed",
    orderId,
    fulfillmentStatus: finalStatus,
    fulfillmentId: finalFulfillmentId,
    details: dispatchDetails,
  }
}
