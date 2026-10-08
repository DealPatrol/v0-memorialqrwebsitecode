/** Public site configuration. One place for the domain, currency, and support inbox. */

export const SITE_URL = "https://memorialsqr.com"

export const SITE_NAME = "MemorialsQR"

/** memorialsqr.com publishes MX records (Google and Amazon SES), so this inbox is the support address. */
export const SUPPORT_EMAIL = "support@memorialsqr.com"

export const CHECKOUT_CURRENCY = "USD"
export const CHECKOUT_COUNTRY = "US"

export const US_SHIPPING_COPY = "Ships anywhere in the United States from Alabama."

/**
 * Handling time for the hand-made QR Memorial Plaque, before the carrier takes it.
 * Business days. Carrier transit is not included.
 */
export const KEEPSAKE_HANDLING_MIN_DAYS = 7
export const KEEPSAKE_HANDLING_MAX_DAYS = 10
export const KEEPSAKE_HANDLING_TIME = `${KEEPSAKE_HANDLING_MIN_DAYS} to ${KEEPSAKE_HANDLING_MAX_DAYS} business days`

export const KEEPSAKE_SHIPPING_COPY = `Made to order in Alabama. We ship within ${KEEPSAKE_HANDLING_TIME} to United States addresses. Shipping is included in the price. Carrier transit starts after it ships.`

export const SAMPLE_MEMORIAL_PATH = "/memorial/glenda-kelso"
export const SAMPLE_MEMORIAL_NAME = "Glenda Jane Kelso"

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)} USD`
}
