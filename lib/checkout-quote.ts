import { getHostingTerms, type HostingTerms } from "@/lib/hosting"

type QuoteLine = {
  id: string
  price: number
  quantity: number
  ships: boolean
}

export type CheckoutQuote = {
  /** Charged today, computed from the server catalog. This is the only charge. */
  totalCents: number
  hostingTerms: HostingTerms
}

export type QuoteResult = { ok: true; quote: CheckoutQuote } | { ok: false; error: string }

/** Server-side price and hosting rules for one checkout. Client amounts are never trusted. */
export function quoteCheckout(lines: ReadonlyArray<QuoteLine>, orderDate: Date = new Date()): QuoteResult {
  if (lines.length === 0) return { ok: false, error: "Your cart is empty" }

  const totalCents = lines.reduce((sum, line) => sum + Math.round(line.price * 100) * line.quantity, 0)
  if (!Number.isInteger(totalCents) || totalCents <= 0) return { ok: false, error: "Invalid order total" }

  return {
    ok: true,
    quote: {
      totalCents,
      hostingTerms: getHostingTerms(lines, orderDate),
    },
  }
}

/** True only for a completed USD payment at our location for exactly the expected amount. */
export function paymentMatchesQuote(
  payment: { status?: string; amount_money?: { amount: number; currency: string }; location_id?: string },
  expectedCents: number,
  locationId: string,
  currency = "USD",
): boolean {
  return (
    payment.status === "COMPLETED" &&
    payment.amount_money?.amount === expectedCents &&
    payment.amount_money?.currency === currency &&
    payment.location_id === locationId
  )
}
