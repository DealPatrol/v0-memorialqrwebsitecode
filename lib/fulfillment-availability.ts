import {
  CONCIERGE_PRODUCTS,
  getManualKeepsake,
  getPodProduct,
  isKeepsakeComingSoon,
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
  /** False when the page is live but checkout refuses it (coming soon). */
  available: boolean
}

const SUPPLIER_IMAGE = "/memorial-qr-code-products.jpg"
const SUPPLIER_IMAGE_ALT = "QR memorial keepsake"

function keepsakeFromManual(product: ManualKeepsake, env: EnvSource): SellableKeepsake {
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
    available: !isKeepsakeComingSoon(product.id, env),
  }
}

function keepsakeFromPod(product: PodProduct, env: EnvSource): SellableKeepsake {
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
    available: !isKeepsakeComingSoon(product.id, env),
  }
}

/** Every keepsake with a public page, including coming-soon ones. Not for checkout, feeds, or offers. */
export function getListedKeepsakes(env: EnvSource = process.env): SellableKeepsake[] {
  return [
    ...MANUAL_KEEPSAKES.map((product) => keepsakeFromManual(product, env)),
    ...getSellablePodProducts(env).map((product) => keepsakeFromPod(product, env)),
  ]
}

export function getListedKeepsake(id: string, env: EnvSource = process.env): SellableKeepsake | undefined {
  return getListedKeepsakes(env).find((product) => product.id === id)
}

/** Keepsakes a buyer can actually order. Coming-soon keepsakes are excluded. */
export function getSellableKeepsakes(env: EnvSource = process.env): SellableKeepsake[] {
  return getListedKeepsakes(env).filter((product) => product.available)
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

    if (isKeepsakeComingSoon(item.id, env)) return null

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
