import { DIGITAL_MEMORIAL } from "@/lib/catalog"
import { getHostingTerms, type HostingTerms } from "@/lib/hosting"

type QuoteLine = {
  id: string
  price: number
  monthlyFee: number
  quantity: number
  ships: boolean
  hostingIncludedYears?: number
}

export type CheckoutQuote = {
  /** Charged today, computed from the server catalog. */
  totalCents: number
  hostingTerms: HostingTerms
  /** True when checkout must set up the monthly Square subscription. */
  needsSubscription: boolean
  monthlyAmountCents: number
}

export type QuoteResult = { ok: true; quote: CheckoutQuote } | { ok: false; error: string }

/** Server-side price and hosting rules for one checkout. Client amounts are never trusted. */
export function quoteCheckout(lines: ReadonlyArray<QuoteLine>, orderDate: Date = new Date()): QuoteResult {
  if (lines.length === 0) return { ok: false, error: "Your cart is empty" }

  const digitalPage = lines.find((line) => line.id === DIGITAL_MEMORIAL.id)
  const shipsPhysical = lines.some((line) => line.ships)
  if (digitalPage && digitalPage.quantity !== 1) {
    return { ok: false, error: "Check out one monthly memorial page at a time" }
  }
  if (digitalPage && shipsPhysical) {
    return {
      ok: false,
      error: "Keepsakes already include 10 years of hosting. Remove the monthly memorial page from this order.",
    }
  }

  const totalCents = lines.reduce((sum, line) => sum + Math.round(line.price * 100) * line.quantity, 0)
  if (!Number.isInteger(totalCents) || totalCents <= 0) return { ok: false, error: "Invalid order total" }

  const hostingTerms = getHostingTerms(lines, orderDate)
  const needsSubscription = !hostingTerms.includesPhysicalKeepsake && lines.some((line) => line.monthlyFee > 0)
  return {
    ok: true,
    quote: {
      totalCents,
      hostingTerms,
      needsSubscription,
      monthlyAmountCents: needsSubscription ? hostingTerms.monthlyAmountCents : 0,
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
