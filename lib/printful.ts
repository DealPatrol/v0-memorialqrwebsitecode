export type SupplierCallResult = {
  status: "submitted" | "failed"
  provider: "printful"
  fulfillmentId: string | null
  error?: string
  data?: unknown
}

export type PrintfulLine = {
  syncVariantId: string
  quantity: number
  printFileUrl: string
}

export type ShipTo = {
  name: string
  address1: string
  address2?: string | null
  city: string
  state: string
  zip: string
  email: string
  phone?: string | null
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>

const PRINTFUL_API_URL = "https://api.printful.com"

export async function submitPrintfulOrder(
  input: {
    orderNumber: string
    recipient: ShipTo
    items: PrintfulLine[]
    token: string
  },
  fetchImpl: FetchLike = fetch,
): Promise<SupplierCallResult> {
  if (!input.token) {
    return { status: "failed", provider: "printful", fulfillmentId: null, error: "PRINTFUL_API_TOKEN is not configured" }
  }
  if (input.items.length === 0) {
    return { status: "failed", provider: "printful", fulfillmentId: null, error: "No Printful items to submit" }
  }

  const payload = {
    external_id: input.orderNumber,
    recipient: {
      name: input.recipient.name,
      address1: input.recipient.address1,
      address2: input.recipient.address2 || undefined,
      city: input.recipient.city,
      state_code: input.recipient.state,
      country_code: "US",
      zip: input.recipient.zip,
      email: input.recipient.email,
      phone: input.recipient.phone || undefined,
    },
    items: input.items.map((item) => ({
      sync_variant_id: Number(item.syncVariantId),
      quantity: item.quantity,
      files: [{ type: "default", url: item.printFileUrl }],
    })),
  }

  try {
    const response = await fetchImpl(`${PRINTFUL_API_URL}/orders?confirm=1`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${input.token}`,
        "Content-Type": "application/json",
        "User-Agent": "MemorialsQR-POD/1.0",
      },
      body: JSON.stringify(payload),
    })
    const body = await response.json().catch(() => ({}))
    if (!response.ok) {
      return {
        status: "failed",
        provider: "printful",
        fulfillmentId: null,
        error: body?.error?.message || `Printful request failed with status ${response.status}`,
        data: body,
      }
    }

    const orderId = body?.result?.id ? String(body.result.id) : null
    const supplierStatus = String(body?.result?.status || "")
    if (!orderId || supplierStatus === "draft") {
      return {
        status: "failed",
        provider: "printful",
        fulfillmentId: orderId,
        error: supplierStatus === "draft" ? "Printful left the order as a draft" : "Printful did not return an order id",
        data: body?.result,
      }
    }

    return { status: "submitted", provider: "printful", fulfillmentId: orderId, data: body.result }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Printful error"
    return { status: "failed", provider: "printful", fulfillmentId: null, error: message }
  }
}
