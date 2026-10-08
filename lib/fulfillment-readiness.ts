import { POD_PRODUCTS, type PodProduct } from "@/lib/catalog"

export type EnvSource = Record<string, string | undefined>

export function envValue(env: EnvSource, name: string): string {
  return env[name]?.trim() ?? ""
}

/** Template and variant ids must be digits. Tokens and Printify product ids just need a value. */
export function isEnvValueUsable(name: string, value: string): boolean {
  if (!value) return false
  if (name.endsWith("_VARIANT_ID") || name.endsWith("_TEMPLATE_ID")) {
    return /^[1-9]\d*$/.test(value)
  }
  return true
}

export function missingRequiredEnv(product: PodProduct, env: EnvSource): string[] {
  return product.requiredEnv.filter((name) => !isEnvValueUsable(name, envValue(env, name)))
}

export function isPodProductConfigured(product: PodProduct, env: EnvSource): boolean {
  return missingRequiredEnv(product, env).length === 0
}

export function configuredPodProducts(env: EnvSource): PodProduct[] {
  return POD_PRODUCTS.filter((product) => isPodProductConfigured(product, env))
}

