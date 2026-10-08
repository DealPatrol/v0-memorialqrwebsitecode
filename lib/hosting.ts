/**
 * Hosting policy: MemorialsQR sells printed QR keepsakes. Each order includes
 * 10 years of hosting for its memorial page, starting on the order date.
 * There is no monthly plan and checkout never creates a subscription.
 */
export const HOSTING_INCLUDED_YEARS = 10
export const HOSTING_INCLUDED_LABEL = `${HOSTING_INCLUDED_YEARS} years of hosting included`

/** Returns a new Date `years` after `from` (UTC calendar years). */
export function addYears(from: Date, years: number): Date {
  const result = new Date(from.getTime())
  result.setUTCFullYear(result.getUTCFullYear() + years)
  return result
}

export type HostingTerms = {
  /** True when the order contains at least one physical keepsake. */
  includesPhysicalKeepsake: boolean
  /** ISO timestamp until which hosting is included. */
  hostingIncludedUntil: string
  hostingPlan: "included_10_years"
}

export function getHostingTerms(items: ReadonlyArray<{ ships?: boolean }>, orderDate: Date = new Date()): HostingTerms {
  return {
    includesPhysicalKeepsake: items.some((item) => item.ships === true),
    hostingIncludedUntil: addYears(orderDate, HOSTING_INCLUDED_YEARS).toISOString(),
    hostingPlan: "included_10_years",
  }
}
