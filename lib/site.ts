/** Public site configuration. One place for the domain, currency, and support inbox. */

export const SITE_URL = "https://memorialsqr.com"

export const SITE_NAME = "MemorialsQR"

/** memorialsqr.com publishes MX records (Google and Amazon SES), so this inbox is the support address. */
export const SUPPORT_EMAIL = "support@memorialsqr.com"

export const CHECKOUT_CURRENCY = "USD"
export const CHECKOUT_COUNTRY = "US"

export const US_SHIPPING_COPY = "Ships anywhere in the United States from Alabama."

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)} USD`
}
