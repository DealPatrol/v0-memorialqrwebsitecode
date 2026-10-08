import { getSellableKeepsake } from "@/lib/fulfillment-availability"
import {
  KEEPSAKE_HANDLING_MAX_DAYS,
  KEEPSAKE_HANDLING_MIN_DAYS,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site"

/** Public Google Merchant Center feed. Only the handmade plaque is listed. */
export const MERCHANT_FEED_PATH = "/merchant-feed.xml"

const PLAQUE_ID = "qr-memorial-plaque"

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]!)
}

export function plaqueForMerchantFeed() {
  return getSellableKeepsake(PLAQUE_ID, {})
}

/**
 * RSS 2.0 feed with Google's product namespace.
 * The plaque has no GTIN, so identifier_exists is no and g:gtin is omitted.
 * Shipping is included in the price, so the shipping charge is 0.00 USD.
 */
export function buildMerchantFeedXml(): string {
  const product = plaqueForMerchantFeed()
  const item = product
    ? `<item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(product.description)}</g:description>
      <g:link>${escapeXml(`${SITE_URL}/store/${product.id}`)}</g:link>
      <g:image_link>${escapeXml(`${SITE_URL}${product.image}`)}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${product.price.toFixed(2)} USD</g:price>
      <g:brand>${escapeXml(SITE_NAME)}</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>no</g:identifier_exists>
      <g:shipping>
        <g:country>US</g:country>
        <g:service>Standard</g:service>
        <g:price>0.00 USD</g:price>
      </g:shipping>
      <g:min_handling_time>${KEEPSAKE_HANDLING_MIN_DAYS}</g:min_handling_time>
      <g:max_handling_time>${KEEPSAKE_HANDLING_MAX_DAYS}</g:max_handling_time>
    </item>`
    : ""

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>QR Memorial Plaque available to buy from ${escapeXml(SITE_NAME)}.</description>
    ${item}
  </channel>
</rss>
`
}
