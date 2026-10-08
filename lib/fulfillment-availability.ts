import {
  CONCIERGE_PRODUCTS,
  getManualKeepsake,
  getPodProduct,
  MANUAL_KEEPSAKES,
  type CheckoutProduct,
  type FulfillmentProvider,
  type ManualKeepsake,
  type PodProduct,
  type StoreCategory,
} from "@/lib/catalog"
import { configuredPodProducts, envValue, type EnvSource } from "@/lib/fulfillment-readiness"

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

export type SellableKeepsake = {
  id: string
  name: string
  price: number
  provider: FulfillmentProvider
  category: StoreCategory
  description: string
  features: string[]
  image: string
  imageAlt: string
}

const SUPPLIER_IMAGE = "/memorial-qr-code-products.jpg"
const SUPPLIER_IMAGE_ALT = "QR memorial keepsake"

function keepsakeFromManual(product: ManualKeepsake): SellableKeepsake {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    provider: product.provider,
    category: product.category,
    description: product.description,
    features: product.features,
    image: product.image,
    imageAlt: product.imageAlt,
  }
}

function keepsakeFromPod(product: PodProduct): SellableKeepsake {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    provider: product.provider,
    category: product.category,
    description: product.description,
    features: product.features,
    image: SUPPLIER_IMAGE,
    imageAlt: SUPPLIER_IMAGE_ALT,
  }
}

/** Manual keepsakes are always listed. Printful and Printify keepsakes need their env vars. */
export function getSellableKeepsakes(env: EnvSource = process.env): SellableKeepsake[] {
  return [...MANUAL_KEEPSAKES.map(keepsakeFromManual), ...getSellablePodProducts(env).map(keepsakeFromPod)]
}

export function getSellableKeepsake(id: string, env: EnvSource = process.env): SellableKeepsake | undefined {
  return getSellableKeepsakes(env).find((product) => product.id === id)
}

export function listSellableProducts(env: EnvSource = process.env): SellableProduct[] {
  const digital = CONCIERGE_PRODUCTS.map((product) => ({
    ...product,
    ships: false,
    provider: null,
  }))
  const physical = getSellableKeepsakes(env).map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
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

  const resolved: ConfiguredLine[] = []
  for (const item of items) {
    if (!item || typeof item !== "object" || !("id" in item) || typeof item.id !== "string") return null
    const rawQuantity = "quantity" in item && typeof item.quantity === "number" ? item.quantity : 1
    const quantity = Math.floor(rawQuantity)
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 99) return null

    const digital = CONCIERGE_PRODUCTS.find((product) => product.id === item.id)
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

    const manual = getManualKeepsake(item.id)
    if (manual) {
      resolved.push({
        id: manual.id,
        name: manual.name,
        price: manual.price,
        quantity,
        ships: true,
        provider: "manual",
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
