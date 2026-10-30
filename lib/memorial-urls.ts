import { SITE_URL } from "@/lib/site"

export function memorialSlugForOrder(orderNumber: string): string {
  return orderNumber.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

export function memorialPageUrl(slug: string): string {
  return `${SITE_URL}/memorial/${slug}`
}

export function printFileUrl(slug: string): string {
  return `${SITE_URL}/api/print-file/${slug}`
}

/** Path segment for the Christmas remembrance view of a memorial. */
export const HOLIDAY_REMEMBRANCE_SEGMENT = "holiday"

/**
 * Sample remembrance page. A literal, so site chrome can recognize it without
 * importing the example-memorial module (that module pulls the catalog).
 * scripts/holiday-remembrance.test.ts checks it still matches EXAMPLE_MEMORIAL_PATH.
 */
export const EXAMPLE_HOLIDAY_PATH = "/example-memorial/holiday"

/**
 * URL shape to print on a Christmas in Heaven ornament.
 * Replace <slug> with the memorial slug (the same one used in memorialPageUrl).
 */
export const HOLIDAY_ORNAMENT_QR_TEMPLATE = `${SITE_URL}/memorial/<slug>/${HOLIDAY_REMEMBRANCE_SEGMENT}`

const MEMORIAL_KEY = /^[A-Za-z0-9][A-Za-z0-9_-]{0,160}$/

/** `/memorial/<slug>/holiday`, or null when the slug is not safe to put in a path. */
export function holidayRemembrancePath(slugOrId: string): string | null {
  const key = slugOrId.trim()
  if (!MEMORIAL_KEY.test(key)) return null
  return `/memorial/${key}/${HOLIDAY_REMEMBRANCE_SEGMENT}`
}

/** Absolute URL for an ornament QR code. Null when the slug is not safe to print. */
export function holidayRemembranceUrl(slugOrId: string): string | null {
  const path = holidayRemembrancePath(slugOrId)
  return path ? `${SITE_URL}${path}` : null
}

/** True for the sample remembrance page and for `/memorial/<slug>/holiday`. */
export function isHolidayRemembrancePath(pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname
  if (path === EXAMPLE_HOLIDAY_PATH) return true
  return new RegExp(`^/memorial/[^/]+/${HOLIDAY_REMEMBRANCE_SEGMENT}$`).test(path)
}
