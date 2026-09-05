type PrintifyTemplate = {
  blueprint_id: number
  print_provider_id: number
  variants: Array<{ id: number; price: number; is_enabled: boolean }>
  print_areas: Array<{
    variant_ids: number[]
    placeholders: Array<{ position: string; images: unknown[] }>
  }>
}

type FulfillmentAddress = {
  name: string
  email: string
  phone?: string | null
  address1: string
  address2?: string | null
  city: string
  region: string
  zip: string
  country: string
}

type FulfillmentRequest = {
  orderNumber: string
  quantity: number
  qrCodeUrl: string
  address: FulfillmentAddress
}

type PrintifyResponse = {
  id?: string
  [key: string]: unknown
}

export class PrintifyFulfillmentError extends Error {
  constructor(
    message: string,
    readonly fulfillmentId: string,
  ) {
    super(message)
    this.name = "PrintifyFulfillmentError"
  }
}

const PRINTIFY_API_URL = "https://api.printify.com/v1"

async function printifyRequest<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${PRINTIFY_API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "MemorialsQR/1.0",
      ...init?.headers,
    },
  })

  const body = await response.json()
  if (!response.ok) {
    throw new Error(`Printify request failed (${response.status}): ${JSON.stringify(body)}`)
  }
  return body as T
}

export async function fulfillVoiceKeychain(request: FulfillmentRequest) {
  const token = process.env.PRINTIFY_API_TOKEN
  const shopId = process.env.PRINTIFY_SHOP_ID
  const templateProductId = process.env.PRINTIFY_VOICE_KEYCHAIN_PRODUCT_ID

  if (!token || !shopId || !templateProductId) {
    return { status: "awaiting_configuration" as const, fulfillmentId: null }
  }

  const uploadedQr = await printifyRequest<PrintifyResponse>("/uploads/images.json", token, {
    method: "POST",
    body: JSON.stringify({
      file_name: `${request.orderNumber}-memorial-qr.png`,
      url: request.qrCodeUrl,
    }),
  })
  if (!uploadedQr.id) throw new Error("Printify did not return an uploaded QR image ID")

  const template = await printifyRequest<PrintifyTemplate>(
    `/shops/${shopId}/products/${templateProductId}.json`,
    token,
  )
  const configuredVariantId = Number(process.env.PRINTIFY_VOICE_KEYCHAIN_VARIANT_ID)
  const enabledVariants = template.variants.filter((variant) => variant.is_enabled)
  const selectedVariant =
    enabledVariants.find((variant) => variant.id === configuredVariantId) || enabledVariants[0]

  if (!selectedVariant) throw new Error("The configured Printify keychain template has no enabled variant")

  const product = await printifyRequest<PrintifyResponse>(`/shops/${shopId}/products.json`, token, {
    method: "POST",
    body: JSON.stringify({
      title: `Memorial QR Voice Keychain — ${request.orderNumber}`,
      description: "Personalized acrylic memorial keychain with a unique QR destination.",
      blueprint_id: template.blueprint_id,
      print_provider_id: template.print_provider_id,
      variants: enabledVariants.map((variant) => ({
        id: variant.id,
        price: variant.price,
        is_enabled: true,
      })),
      print_areas: template.print_areas.map((area) => ({
        variant_ids: area.variant_ids,
        placeholders: area.placeholders.map((placeholder) => ({
          position: placeholder.position,
          images: [{ id: uploadedQr.id, x: 0.5, y: 0.5, scale: 1, angle: 0 }],
        })),
      })),
    }),
  })
  if (!product.id) throw new Error("Printify did not return a personalized product ID")

  const order = await printifyRequest<PrintifyResponse>(`/shops/${shopId}/orders.json`, token, {
    method: "POST",
    body: JSON.stringify({
      external_id: request.orderNumber,
      label: request.orderNumber,
      line_items: [{ product_id: product.id, variant_id: selectedVariant.id, quantity: request.quantity }],
      shipping_method: Number(process.env.PRINTIFY_SHIPPING_METHOD || 1),
      send_shipping_notification: true,
      address_to: {
        first_name: request.address.name.split(" ")[0] || request.address.name,
        last_name: request.address.name.split(" ").slice(1).join(" ") || "-",
        email: request.address.email,
        phone: request.address.phone || undefined,
        country: request.address.country,
        region: request.address.region,
        address1: request.address.address1,
        address2: request.address.address2 || undefined,
        city: request.address.city,
        zip: request.address.zip,
      },
    }),
  })
  if (!order.id) throw new Error("Printify did not return an order ID")

  try {
    await printifyRequest(`/shops/${shopId}/orders/${order.id}/send_to_production.json`, token, {
      method: "POST",
      body: "{}",
    })
  } catch (error) {
    throw new PrintifyFulfillmentError(error instanceof Error ? error.message : String(error), order.id)
  }

  return { status: "sent_to_production" as const, fulfillmentId: order.id }
}
