import type { ShipTo } from "@/lib/printful"
import { qrPixelSize, qrPlaceholderScale } from "@/lib/print-layout"
import type { QrSurface } from "@/lib/store-catalog"

export type PrintifyCallResult = {
  status: "submitted" | "failed" | "mocked"
  provider: "printify"
  fulfillmentId: string | null
  error?: string
  data?: unknown
  payload?: PrintifyBlueprintPayload
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

    return { status: "submitted", provider: "printify", fulfillmentId: order.id, payload: undefined }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Printify error"
    return { status: "failed", provider: "printify", fulfillmentId: null, error: message }
  }
}

export type BlueprintPrintLine = {
  title: string
  blueprintId: number | null
  printProviderId: string | null
  variantId: string | null
  quantity: number
  printFileUrl: string
  photoUrl?: string | null
  retailCents: number
  qrSurface?: QrSurface
  qrMinInches?: number
  printWidthInches?: number
}

export type PrintifyBlueprintPayload = {
  external_id: string
  label: string
  shipping_method: 1
  send_shipping_notification: true
  address_to: {
    first_name: string
    last_name: string
    email: string
    phone?: string
    country: "US"
    region: string
    address1: string
    address2?: string
    city: string
    zip: string
  }
  products: Array<{
    title: string
    blueprint_id: number | null
    print_provider_id: string | null
    variant_id: string | null
    quantity: number
    retail_cents: number
    photo_url: string | null
    print_file_url: string
    qr: {
      min_inches: number
      pixels: number
      contrast: "black-on-white"
      scale: number
      surface: QrSurface
    }
    insert: { print_file_url: string; min_inches: number; note: string } | null
  }>
}

function addressTo(recipient: ShipTo): PrintifyBlueprintPayload["address_to"] {
  const nameParts = recipient.name.trim().split(/\s+/)
  return {
    first_name: nameParts[0] || "Customer",
    last_name: nameParts.slice(1).join(" ") || "-",
    email: recipient.email,
    phone: recipient.phone || undefined,
    country: "US",
    region: recipient.state,
    address1: recipient.address1,
    address2: recipient.address2 || undefined,
    city: recipient.city,
    zip: recipient.zip,
  }
}

export function buildPrintifyBlueprintPayload(input: {
  orderNumber: string
  recipient: ShipTo
  items: BlueprintPrintLine[]
}): PrintifyBlueprintPayload {
  return {
    external_id: input.orderNumber,
    label: input.orderNumber,
    shipping_method: 1,
    send_shipping_notification: true,
    address_to: addressTo(input.recipient),
    products: input.items.map((item) => {
      const minInches = Math.max(1, item.qrMinInches ?? 1)
      const surface = item.qrSurface ?? "print"
      return {
        title: item.title,
        blueprint_id: item.blueprintId,
        print_provider_id: item.printProviderId,
        variant_id: item.variantId || null,
        quantity: item.quantity,
        retail_cents: item.retailCents,
        photo_url: item.photoUrl || null,
        print_file_url: item.printFileUrl,
        qr: {
          min_inches: minInches,
          pixels: qrPixelSize(minInches),
          contrast: "black-on-white" as const,
          scale: qrPlaceholderScale(minInches, item.printWidthInches ?? minInches),
          surface,
        },
        insert:
          surface === "card-insert"
            ? {
                print_file_url: item.printFileUrl,
                min_inches: minInches,
                note: "Pack this QR card. Do not shrink it below 1 inch. Black on white.",
              }
            : null,
      }
    }),
  }
}

export function blueprintOrderReady(token: string, shopId: string, items: BlueprintPrintLine[]): boolean {
  if (!token || !shopId || items.length === 0) return false
  return items.every(
    (item) =>
      item.blueprintId &&
      item.printProviderId &&
      /^[1-9]\d*$/.test(item.printProviderId) &&
      item.variantId &&
      /^[1-9]\d*$/.test(item.variantId) &&
      item.printFileUrl,
  )
}

/**
 * Submits blueprint-based Printify products. With no token, shop, provider, or
 * variant, the order payload is returned and nothing is sent.
 */
export async function submitPrintifyBlueprintOrder(
  input: {
    orderNumber: string
    recipient: ShipTo
    items: BlueprintPrintLine[]
    token: string
    shopId: string
  },
  fetchImpl: FetchLike = fetch,
): Promise<PrintifyCallResult> {
  const payload = buildPrintifyBlueprintPayload(input)
  if (!blueprintOrderReady(input.token, input.shopId, input.items)) {
    return {
      status: "mocked",
      provider: "printify",
      fulfillmentId: null,
      error: "Printify credentials or blueprint variant ids are not set. The order payload was saved and not submitted.",
      payload,
    }
  }

  try {
    const lineItems: Array<{ product_id: string; variant_id: number; quantity: number }> = []
    for (const item of input.items) {
      const uploads: string[] = []
      const files = item.qrSurface === "card-insert" && item.photoUrl ? [item.photoUrl, item.printFileUrl] : [item.photoUrl, item.printFileUrl].filter((url): url is string => Boolean(url))
      const uniqueFiles = [...new Set(files)]
      for (const url of uniqueFiles) {
        const uploaded = await printifyFetch<{ id?: string }>(fetchImpl, input.token, "/uploads/images.json", {
          method: "POST",
          body: JSON.stringify({ file_name: `${input.orderNumber}-${uploads.length}.png`, url }),
        })
        if (!uploaded.id) {
          return { status: "failed", provider: "printify", fulfillmentId: null, error: "Printify did not return an uploaded image id", payload }
        }
        uploads.push(uploaded.id)
      }
      const qrFile = uploads[uploads.length - 1]
      const photoFile = uploads.length > 1 ? uploads[0] : null
      const productSpec = payload.products.find((product) => product.title === item.title && product.blueprint_id === item.blueprintId)
      const scale = productSpec?.qr.scale ?? 1
      const images =
        item.qrSurface === "card-insert"
          ? [
              ...(photoFile ? [{ id: photoFile, x: 0.5, y: 0.45, scale: 0.9, angle: 0 }] : []),
              { id: qrFile, x: 0.5, y: 0.55, scale, angle: 0 },
            ]
          : [
              ...(photoFile ? [{ id: photoFile, x: 0.5, y: 0.4, scale: 0.8, angle: 0 }] : []),
              { id: qrFile, x: item.qrSurface === "cover" ? 0.5 : 0.82, y: 0.84, scale, angle: 0 },
            ]
      const created = await printifyFetch<{ id?: string }>(fetchImpl, input.token, `/shops/${input.shopId}/products.json`, {
        method: "POST",
        body: JSON.stringify({
          title: item.title,
          description: `Memorial QR for ${input.orderNumber}. QR is black on white and at least ${productSpec?.qr.min_inches ?? 1} inches.`,
          blueprint_id: item.blueprintId,
          print_provider_id: Number(item.printProviderId),
          variants: [{ id: Number(item.variantId), price: item.retailCents, is_enabled: true }],
          print_areas: [
            {
              variant_ids: [Number(item.variantId)],
              placeholders: [{ position: "front", images }],
            },
          ],
        }),
      })
      if (!created.id) {
        return { status: "failed", provider: "printify", fulfillmentId: null, error: "Printify did not return a product id", payload }
      }
      lineItems.push({ product_id: created.id, variant_id: Number(item.variantId), quantity: item.quantity })
    }

    const order = await printifyFetch<{ id?: string }>(fetchImpl, input.token, `/shops/${input.shopId}/orders.json`, {
      method: "POST",
      body: JSON.stringify({
        external_id: payload.external_id,
        label: payload.label,
        line_items: lineItems,
        shipping_method: payload.shipping_method,
        send_shipping_notification: payload.send_shipping_notification,
        address_to: payload.address_to,
      }),
    })
    if (!order.id) {
      return { status: "failed", provider: "printify", fulfillmentId: null, error: "Printify did not return an order id", payload }
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
        payload,
      }
    }
    return { status: "submitted", provider: "printify", fulfillmentId: order.id, payload }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Printify error"
    return { status: "failed", provider: "printify", fulfillmentId: null, error: message, payload }
  }
}
