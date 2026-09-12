import type { PodOrderLineItem } from "@/lib/checkout-products"

const POD_ORDER_COLUMNS = [
  "line_items",
  "fulfillment_provider",
  "fulfillment_id",
  "fulfillment_status",
  "fulfillment_data",
  "print_file_url",
] as const

type DatabaseError = {
  code?: string
  message?: string
}

export function getConfiguredTemplateId(environmentName: string): string | null {
  return process.env[environmentName] || null
}

export function getFulfillmentProvider(lineItems: PodOrderLineItem[]): string | null {
  const providers = new Set(lineItems.map((item) => item.fulfillment_provider))

  if (providers.size === 0) return null
  if (providers.size > 1) return "mixed"

  return providers.values().next().value ?? null
}

export function isMissingPodOrderSchema(error: unknown): boolean {
  if (!error || typeof error !== "object") return false

  const { code, message } = error as DatabaseError
  if (code !== "PGRST204" && code !== "42703") return false

  const normalizedMessage = message?.toLowerCase() || ""
  return POD_ORDER_COLUMNS.some((column) => normalizedMessage.includes(column))
}
