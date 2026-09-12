import { STORE_PRODUCTS } from "@/lib/store-products"

export type FulfillmentProvider = "printful" | "printify"

export type CheckoutProduct = {
  name: string
  price: number
  monthlyFee: number
  fulfillment?: {
    provider: FulfillmentProvider
    product: string
    templateIdEnvironment: string
  }
}

export type CheckoutLineItem = {
  id: string
  quantity: number
}

export type ResolvedCheckoutLineItem = CheckoutLineItem & CheckoutProduct

export type PodOrderLineItem = {
  sku: string
  product_name: string
  quantity: number
  unit_amount_cents: number
  line_total_cents: number
  currency: "CAD"
  fulfillment_provider: FulfillmentProvider
  fulfillment_product: string
  provider_template_id: string | null
}

export const CHECKOUT_PRODUCTS: Record<string, CheckoutProduct> = {
  ...Object.fromEntries(
    STORE_PRODUCTS.map((product) => [
      product.id,
      {
        name: product.name,
        price: product.price,
        monthlyFee: product.monthlyFee,
        fulfillment: {
          provider: product.provider === "Printful" ? "printful" : "printify",
          product: product.fulfillmentProduct,
          templateIdEnvironment: product.templateIdEnvironment,
        },
      },
    ]),
  ),
  "concierge-service": { name: "Concierge Memorial Service", price: 299.99, monthlyFee: 4.99 },
  "concierge-digital": { name: "Concierge Service - Digital Link", price: 299.99, monthlyFee: 4.99 },
}

export function resolveCheckoutItems(items: unknown): ResolvedCheckoutLineItem[] | null {
  if (!Array.isArray(items) || items.length === 0) return null

  const resolved = items.flatMap((item): ResolvedCheckoutLineItem[] => {
    if (!item || typeof item !== "object" || !("id" in item) || typeof item.id !== "string") return []

    const product = CHECKOUT_PRODUCTS[item.id]
    if (!product) return []

    const rawQuantity = "quantity" in item && typeof item.quantity === "number" ? item.quantity : 1
    const quantity = Math.floor(rawQuantity)
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 99) return []

    return [{ id: item.id, quantity, ...product }]
  })

  return resolved.length === items.length ? resolved : null
}

export function getCheckoutTotalCents(items: ResolvedCheckoutLineItem[]): number {
  return items.reduce((total, item) => total + Math.round(item.price * 100) * item.quantity, 0)
}

export function createPodOrderLineItems(
  items: ResolvedCheckoutLineItem[],
  getTemplateId: (environmentName: string) => string | null = () => null,
): PodOrderLineItem[] {
  return items.flatMap((item) => {
    if (!item.fulfillment) return []

    const unitAmountCents = Math.round(item.price * 100)

    return [
      {
        sku: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_amount_cents: unitAmountCents,
        line_total_cents: unitAmountCents * item.quantity,
        currency: "CAD",
        fulfillment_provider: item.fulfillment.provider,
        fulfillment_product: item.fulfillment.product,
        provider_template_id: getTemplateId(item.fulfillment.templateIdEnvironment),
      },
    ]
  })
}
