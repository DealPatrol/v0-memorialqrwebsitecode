import type { ShipTo } from "@/lib/printful"

export type PrintifyCallResult = {
  status: "submitted" | "failed"
  provider: "printify"
  fulfillmentId: string | null
  error?: string
  data?: unknown
}

export type PrintifyLine = {
  templateProductId: string
  variantId: string
  quantity: number
  printFileUrl: string
  retailCents: number
  title: string
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>

const PRINTIFY_API_URL = "https://api.printify.com/v1"

async function printifyFetch<T>(
  fetchImpl: FetchLike,
  token: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetchImpl(`${PRINTIFY_API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "MemorialsQR-POD/1.0",
      ...init?.headers,
    },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(`Printify request failed (${response.status}): ${JSON.stringify(body)}`)
  }
  return body as T
}

type TemplateProduct = {
  blueprint_id?: number
  print_provider_id?: number
  print_areas?: Array<{
    placeholders?: Array<{
      position?: string
      images?: Array<{ x?: number; y?: number; scale?: number; angle?: number }>
    }>
  }>
}

function printPlacement(template: TemplateProduct): { position: string; x: number; y: number; scale: number; angle: number } {
  const placeholder = template.print_areas?.[0]?.placeholders?.[0]
  const image = placeholder?.images?.[0]
  return {
    position: placeholder?.position || "front",
    x: image?.x ?? 0.5,
    y: image?.y ?? 0.5,
    scale: image?.scale ?? 1,
    angle: image?.angle ?? 0,
  }
}

export async function submitPrintifyOrder(
  input: {
    orderNumber: string
    recipient: ShipTo
    items: PrintifyLine[]
    token: string
    shopId: string
  },
  fetchImpl: FetchLike = fetch,
): Promise<PrintifyCallResult> {
  if (!input.token || !input.shopId) {
    return {
      status: "failed",
      provider: "printify",
      fulfillmentId: null,
      error: "PRINTIFY_API_TOKEN or PRINTIFY_SHOP_ID is not configured",
    }
  }
  if (input.items.length === 0) {
    return { status: "failed", provider: "printify", fulfillmentId: null, error: "No Printify items to submit" }
  }

  try {
    const lineItems: Array<{ product_id: string; variant_id: number; quantity: number }> = []

    for (const item of input.items) {
      const template = await printifyFetch<TemplateProduct>(
        fetchImpl,
        input.token,
        `/shops/${input.shopId}/products/${item.templateProductId}.json`,
      )
      if (!template.blueprint_id || !template.print_provider_id) {
        return {
          status: "failed",
          provider: "printify",
          fulfillmentId: null,
          error: `Printify product ${item.templateProductId} is missing blueprint_id or print_provider_id`,
        }
      }

      const uploaded = await printifyFetch<{ id?: string }>(fetchImpl, input.token, "/uploads/images.json", {
        method: "POST",
        body: JSON.stringify({
          file_name: `${input.orderNumber}-${item.variantId}.png`,
          url: item.printFileUrl,
        }),
      })
      if (!uploaded.id) {
        return { status: "failed", provider: "printify", fulfillmentId: null, error: "Printify did not return an uploaded image id" }
      }

      const placement = printPlacement(template)
      const created = await printifyFetch<{ id?: string }>(
        fetchImpl,
        input.token,
        `/shops/${input.shopId}/products.json`,
        {
          method: "POST",
          body: JSON.stringify({
            title: item.title,
            description: `Memorial QR for ${input.orderNumber}`,
            blueprint_id: template.blueprint_id,
            print_provider_id: template.print_provider_id,
            variants: [{ id: Number(item.variantId), price: item.retailCents, is_enabled: true }],
            print_areas: [
              {
                variant_ids: [Number(item.variantId)],
                placeholders: [
                  {
                    position: placement.position,
                    images: [
                      {
                        id: uploaded.id,
                        x: placement.x,
                        y: placement.y,
                        scale: placement.scale,
                        angle: placement.angle,
                      },
                    ],
                  },
                ],
              },
            ],
          }),
        },
      )
      if (!created.id) {
        return { status: "failed", provider: "printify", fulfillmentId: null, error: "Printify did not return a product id" }
      }

      lineItems.push({
        product_id: created.id,
        variant_id: Number(item.variantId),
        quantity: item.quantity,
      })
    }

    const nameParts = input.recipient.name.trim().split(/\s+/)
    const firstName = nameParts[0] || "Customer"
    const lastName = nameParts.slice(1).join(" ") || "-"

    const order = await printifyFetch<{ id?: string }>(
      fetchImpl,
      input.token,
      `/shops/${input.shopId}/orders.json`,
      {
        method: "POST",
        body: JSON.stringify({
          external_id: input.orderNumber,
          label: input.orderNumber,
          line_items: lineItems,
          shipping_method: 1,
          send_shipping_notification: true,
          address_to: {
            first_name: firstName,
            last_name: lastName,
            email: input.recipient.email,
            phone: input.recipient.phone || undefined,
            country: "US",
            region: input.recipient.state,
            address1: input.recipient.address1,
            address2: input.recipient.address2 || undefined,
            city: input.recipient.city,
            zip: input.recipient.zip,
          },
        }),
      },
    )
    if (!order.id) {
      return { status: "failed", provider: "printify", fulfillmentId: null, error: "Printify did not return an order id" }
    }

    try {
      await printifyFetch(fetchImpl, input.token, `/shops/${input.shopId}/orders/${order.id}/send_to_production.json`, {
        method: "POST",
        body: "{}",
      })
    } catch (productionError) {
      const message = productionError instanceof Error ? productionError.message : "Printify production request failed"
      return {
        status: "failed",
        provider: "printify",
        fulfillmentId: order.id,
        error: `Printify created order ${order.id} but did not send it to production: ${message}`,
      }
    }

    return { status: "submitted", provider: "printify", fulfillmentId: order.id }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Printify error"
    return { status: "failed", provider: "printify", fulfillmentId: null, error: message }
  }
}
