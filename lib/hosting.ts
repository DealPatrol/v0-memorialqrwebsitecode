import { HOSTING_MONTHLY_PRICE } from "@/lib/pricing"

/**
 * Hosting policy:
 * - Any physical keepsake includes 10 years of basic hosting for its memorial page,
 *   starting on the order date. Physical orders never create a monthly subscription.
 * - Digital-only memorials (no physical product) are billed monthly.
 * - After the included 10 years, hosting can be renewed at the then-current monthly rate.
 */
export const HOSTING_INCLUDED_YEARS = 10
export const HOSTING_MONTHLY_PRICE_CENTS = Math.round(HOSTING_MONTHLY_PRICE * 100)

/** Returns a new Date `years` after `from` (UTC calendar years). */
export function addYears(from: Date, years: number): Date {
  const result = new Date(from.getTime())
  result.setUTCFullYear(result.getUTCFullYear() + years)
  return result
}

export type HostingTerms = {
  /** True when the order contains at least one physical keepsake. */
  includesPhysicalKeepsake: boolean
  /** Monthly hosting charge to set up at checkout (0 for physical orders). */
  monthlyAmountCents: number
  /** ISO timestamp until which basic hosting is included, or null for digital-only. */
  hostingIncludedUntil: string | null
  hostingPlan: "included_10_years" | "digital_monthly"
}

export function getHostingTerms(
  items: ReadonlyArray<{ hostingIncludedYears?: number }>,
  orderDate: Date = new Date(),
): HostingTerms {
  const includedYears = Math.max(0, ...items.map((item) => item.hostingIncludedYears ?? 0))

  if (includedYears > 0) {
    return {
      includesPhysicalKeepsake: true,
      monthlyAmountCents: 0,
      hostingIncludedUntil: addYears(orderDate, includedYears).toISOString(),
      hostingPlan: "included_10_years",
    }
  }

  return {
    includesPhysicalKeepsake: false,
    monthlyAmountCents: HOSTING_MONTHLY_PRICE_CENTS,
    hostingIncludedUntil: null,
    hostingPlan: "digital_monthly",
  }
}
