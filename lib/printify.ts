export type PrintifyRecipient = {
  name: string
  address1: string
  address2?: string | null
  city: string
  region?: string | null
  country: string
  zip: string
  email: string
  phone?: string | null
}

export type PrintifyItem = {
  productId?: string | null
  variantId?: number | null
  quantity: number
  print_file_url: string
}

export type PrintifyFulfillmentRequest = {
  orderNumber: string
  recipient: PrintifyRecipient
  items: PrintifyItem[]
  autoSendToProduction?: boolean
}

export type PrintifyFulfillmentResult = {
  status: "submitted" | "awaiting_configuration" | "failed"
  provider: "printify"
  fulfillmentId: string | null
  error?: string
  data?: unknown
}

const PRINTIFY_API_URL = "https://api.printify.com/v1"

async function printifyRequest<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${PRINTIFY_API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "MemorialsQR-POD/1.0",
      ...init?.headers,
    },
  })

  const body = await response.json()
  if (!response.ok) {
    throw new Error(`Printify request failed (${response.status}): ${JSON.stringify(body)}`)
  }
  return body as T
}

export async function uploadImageToPrintify(
  fileName: string,
  imageUrl: string,
  token: string,
): Promise<string> {
  const res = await printifyRequest<{ id: string }>("/uploads/images.json", token, {
    method: "POST",
    body: JSON.stringify({
      file_name: fileName,
      url: imageUrl,
    }),
  })

  if (!res.id) {
    throw new Error("Printify did not return an uploaded image ID")
  }
  return res.id
}

export async function submitPrintifyOrder(
  request: PrintifyFulfillmentRequest,
): Promise<PrintifyFulfillmentResult> {
  const token = process.env.PRINTIFY_API_TOKEN
  const shopId = process.env.PRINTIFY_SHOP_ID

  if (!token || !shopId) {
    console.warn("[Printify] Missing PRINTIFY_API_TOKEN or PRINTIFY_SHOP_ID. Order queued for fulfillment.")
    return {
      status: "awaiting_configuration",
      provider: "printify",
      fulfillmentId: null,
      error: "PRINTIFY_API_TOKEN or PRINTIFY_SHOP_ID is not configured",
    }
  }

  try {
    const orderLineItems: Array<{ product_id: string; variant_id: number; quantity: number }> = []

    for (const item of request.items) {
      if (!item.productId || !item.variantId) {
        console.warn("[Printify] Missing product_id or variant_id for line item, skipping direct API submission")
        continue
      }

      orderLineItems.push({
        product_id: item.productId,
        variant_id: item.variantId,
        quantity: item.quantity,
      })
    }

    if (orderLineItems.length === 0) {
      return {
        status: "awaiting_configuration",
        provider: "printify",
        fulfillmentId: null,
        error: "No configured Printify template product/variant IDs available for items in this order",
      }
    }

    const nameParts = request.recipient.name.trim().split(" ")
    const firstName = nameParts[0] || "Customer"
    const lastName = nameParts.slice(1).join(" ") || "-"

    const payload = {
      external_id: request.orderNumber,
      label: request.orderNumber,
      line_items: orderLineItems,
      shipping_method: Number(process.env.PRINTIFY_SHIPPING_METHOD || 1),
      send_shipping_notification: true,
      address_to: {
        first_name: firstName,
        last_name: lastName,
        email: request.recipient.email,
        phone: request.recipient.phone || undefined,
        country: request.recipient.country || "US",
        region: request.recipient.region || undefined,
        address1: request.recipient.address1,
        address2: request.recipient.address2 || undefined,
        city: request.recipient.city,
        zip: request.recipient.zip,
      },
    }

    const orderRes = await printifyRequest<{ id: string }>(
      `/shops/${shopId}/orders.json`,
      token,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    )

    if (!orderRes.id) {
      throw new Error("Printify did not return an order ID")
    }

    if (request.autoSendToProduction) {
      try {
        await printifyRequest(`/shops/${shopId}/orders/${orderRes.id}/send_to_production.json`, token, {
          method: "POST",
          body: "{}",
        })
      } catch (prodError) {
        console.warn("[Printify] Order created but could not send to production immediately:", prodError)
      }
    }

    return {
      status: "submitted",
      provider: "printify",
      fulfillmentId: orderRes.id,
      data: orderRes,
    }
  } catch (error: any) {
    console.error("[Printify] Exception submitting order:", error)
    return {
      status: "failed",
      provider: "printify",
      fulfillmentId: null,
      error: error.message || "Unknown Printify error",
    }
  }
}
