export type PrintfulRecipient = {
  name: string
  address1: string
  address2?: string | null
  city: string
  state_code?: string | null
  country_code: string
  zip: string
  email: string
  phone?: string | null
}

export type PrintfulItem = {
  sync_variant_id?: number
  variant_id?: number
  quantity: number
  print_file_url: string
}

export type PrintfulFulfillmentRequest = {
  orderNumber: string
  recipient: PrintfulRecipient
  items: PrintfulItem[]
  autoConfirm?: boolean
}

export type PrintfulFulfillmentResult = {
  status: "submitted" | "awaiting_configuration" | "failed"
  provider: "printful"
  fulfillmentId: string | null
  error?: string
  data?: unknown
}

const PRINTFUL_API_URL = "https://api.printful.com"

export async function submitPrintfulOrder(
  request: PrintfulFulfillmentRequest,
): Promise<PrintfulFulfillmentResult> {
  const token = process.env.PRINTFUL_API_TOKEN

  if (!token) {
    console.warn("[Printful] PRINTFUL_API_TOKEN not configured. Order queued for manual fulfillment.")
    return {
      status: "awaiting_configuration",
      provider: "printful",
      fulfillmentId: null,
      error: "PRINTFUL_API_TOKEN is not configured",
    }
  }

  try {
    const payload = {
      external_id: request.orderNumber,
      recipient: {
        name: request.recipient.name,
        address1: request.recipient.address1,
        address2: request.recipient.address2 || undefined,
        city: request.recipient.city,
        state_code: request.recipient.state_code || undefined,
        country_code: request.recipient.country_code || "US",
        zip: request.recipient.zip,
        phone: request.recipient.phone || undefined,
        email: request.recipient.email,
      },
      items: request.items.map((item) => ({
        ...(item.sync_variant_id ? { sync_variant_id: item.sync_variant_id } : {}),
        ...(item.variant_id ? { variant_id: item.variant_id } : {}),
        quantity: item.quantity,
        files: [
          {
            type: "default",
            url: item.print_file_url,
          },
        ],
      })),
    }

    const confirmQuery = request.autoConfirm ? "?confirm=1" : ""
    const response = await fetch(`${PRINTFUL_API_URL}/orders${confirmQuery}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "MemorialsQR-POD/1.0",
      },
      body: JSON.stringify(payload),
    })

    const body = await response.json()

    if (!response.ok) {
      console.error("[Printful] Order creation failed:", body)
      return {
        status: "failed",
        provider: "printful",
        fulfillmentId: null,
        error: body?.error?.message || `Printful request failed with status ${response.status}`,
        data: body,
      }
    }

    const orderId = body?.result?.id ? String(body.result.id) : null
    return {
      status: "submitted",
      provider: "printful",
      fulfillmentId: orderId,
      data: body.result,
    }
  } catch (error: any) {
    console.error("[Printful] Exception submitting order:", error)
    return {
      status: "failed",
      provider: "printful",
      fulfillmentId: null,
      error: error.message || "Unknown Printful network error",
    }
  }
}
