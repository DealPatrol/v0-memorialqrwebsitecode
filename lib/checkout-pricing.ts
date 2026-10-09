import type { ConfiguredLine } from "@/lib/fulfillment-availability"
import { resolveConfiguredCheckoutItems } from "@/lib/fulfillment-availability"
import { CHECKOUT_CURRENCY } from "@/lib/site"

export type ServerCartTotal = { lines: ConfiguredLine[]; amountCents: number; currency: string }

/** Price comes only from lib/catalog.ts. Browser-sent amounts are never trusted. */
export function priceCart(items: unknown, env: Record<string, string | undefined> = process.env): ServerCartTotal | null {
  const lines = resolveConfiguredCheckoutItems(items, env)
  if (!lines) return null
  const amountCents = lines.reduce((total, line) => total + Math.round(line.price * 100) * line.quantity, 0)
  if (!Number.isInteger(amountCents) || amountCents <= 0) return null
  return { lines, amountCents, currency: CHECKOUT_CURRENCY }
}
