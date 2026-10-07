import {
  CONCIERGE_PRODUCTS,
  DIGITAL_MEMORIAL,
  getPodProduct,
  type CheckoutProduct,
  type FulfillmentProvider,
  type PodProduct,
} from "@/lib/catalog"
import {
  configuredPodProducts,
  envValue,
  isDigitalSubscriptionConfigured,
  type EnvSource,
} from "@/lib/fulfillment-readiness"

export type SellableProduct = CheckoutProduct & {
  ships: boolean
  provider: FulfillmentProvider | null
  description?: string
  features?: string[]
  category?: PodProduct["category"]
}

export type ConfiguredLine = CheckoutProduct & {
  quantity: number
  ships: boolean
  provider: FulfillmentProvider | null
  syncVariantId: string | null
  templateProductId: string | null
  variantId: string | null
}

/** Digital products sold without a supplier. The monthly page needs a Square plan id. */
function digitalProducts(env: EnvSource): CheckoutProduct[] {
  return isDigitalSubscriptionConfigured(env) ? [DIGITAL_MEMORIAL, ...CONCIERGE_PRODUCTS] : [...CONCIERGE_PRODUCTS]
}

export function listSellableProducts(env: EnvSource = process.env): SellableProduct[] {
  const digital = digitalProducts(env).map((product) => ({
    ...product,
    ships: false,
    provider: null,
  }))
  const physical = configuredPodProducts(env).map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    monthlyFee: product.monthlyFee,
    hostingIncludedYears: product.hostingIncludedYears,
    ships: true,
    provider: product.provider,
    description: product.description,
    features: product.features,
    category: product.category,
  }))
  return [...physical, ...digital]
}

export function getSellablePodProducts(env: EnvSource = process.env): PodProduct[] {
  return configuredPodProducts(env)
}

/** Rejects the whole cart if any id is unknown or its supplier env is missing. */
export function resolveConfiguredCheckoutItems(items: unknown, env: EnvSource = process.env): ConfiguredLine[] | null {
  if (!Array.isArray(items) || items.length === 0) return null

  const digitalCatalog = digitalProducts(env)
  const resolved: ConfiguredLine[] = []
  for (const item of items) {
    if (!item || typeof item !== "object" || !("id" in item) || typeof item.id !== "string") return null
    const rawQuantity = "quantity" in item && typeof item.quantity === "number" ? item.quantity : 1
    const quantity = Math.floor(rawQuantity)
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 99) return null

    const digital = digitalCatalog.find((product) => product.id === item.id)
    if (digital) {
      resolved.push({
        ...digital,
        quantity,
        ships: false,
        provider: null,
        syncVariantId: null,
        templateProductId: null,
        variantId: null,
      })
      continue
    }

    const pod = getPodProduct(item.id)
    const sellable = pod ? configuredPodProducts(env).some((product) => product.id === pod.id) : false
    if (!pod || !sellable) return null

    resolved.push({
      id: pod.id,
      name: pod.name,
      price: pod.price,
      monthlyFee: pod.monthlyFee,
      hostingIncludedYears: pod.hostingIncludedYears,
      quantity,
      ships: true,
      provider: pod.provider,
      syncVariantId: pod.provider === "printful" ? envValue(env, pod.templateEnv) : null,
      templateProductId: pod.provider === "printify" ? envValue(env, pod.templateEnv) : null,
      variantId: pod.variantEnv ? envValue(env, pod.variantEnv) : null,
    })
  }

  return resolved.length === items.length ? resolved : null
}

/**
 * Where "Create a Memorial Page" goes. With a Square plan configured it opens the
 * monthly checkout; without one it falls back to the free page builder.
 */
export function memorialStartHref(env: EnvSource = process.env): string {
  return isDigitalSubscriptionConfigured(env) ? `/checkout/simple?product=${DIGITAL_MEMORIAL.id}` : "/create-memorial"
}
