import { STORE_PRODUCTS } from "@/lib/store-products"

export type CheckoutProduct = {
  name: string
  price: number
  monthlyFee: number
}

export type CheckoutLineItem = {
  id: string
  quantity: number
}

export const CHECKOUT_PRODUCTS: Record<string, CheckoutProduct> = {
  ...Object.fromEntries(STORE_PRODUCTS.map((product) => [product.id, product])),
  "concierge-service": { name: "Concierge Memorial Service", price: 299.99, monthlyFee: 4.99 },
  "concierge-digital": { name: "Concierge Service - Digital Link", price: 299.99, monthlyFee: 4.99 },
}

export function resolveCheckoutItems(items: unknown): Array<CheckoutLineItem & CheckoutProduct> | null {
  if (!Array.isArray(items) || items.length === 0) return null

  const resolved = items.flatMap((item): Array<CheckoutLineItem & CheckoutProduct> => {
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

export function getCheckoutTotalCents(items: Array<CheckoutLineItem & CheckoutProduct>): number {
  return items.reduce((total, item) => total + Math.round(item.price * 100) * item.quantity, 0)
}
