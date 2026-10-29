import { DIGITAL_MEMORIAL_PRODUCT, MANUAL_KEEPSAKES, POD_PRODUCTS } from "@/lib/catalog"
import {
  DIGITAL_MEMORIAL_DESCRIPTION,
  DIGITAL_MEMORIAL_IMAGE,
  DIGITAL_MEMORIAL_PATH,
} from "@/lib/digital-memorial"
import { getSellableKeepsakes, type SellableKeepsake } from "@/lib/fulfillment-availability"
import type { EnvSource } from "@/lib/fulfillment-readiness"
import { googleProductCategory, hasGoogleProductCategory } from "@/lib/google-product-category"
import {
  absoluteAssetUrl,
  KEEPSAKE_HANDLING_MAX_DAYS,
  KEEPSAKE_HANDLING_MIN_DAYS,
  KEEPSAKE_SHIPPING_PRICE_USD,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site"

/** Public Google Merchant Center feed. Same ids and prices as checkout. */
export const MERCHANT_FEED_PATH = "/merchant-feed.xml"

/** Every catalog product that can enter the feed needs a taxonomy path. */
export function catalogIdsMissingGoogleCategory(): string[] {
  const ids = [
    DIGITAL_MEMORIAL_PRODUCT.id,
    ...POD_PRODUCTS.map((product) => product.id),
    ...MANUAL_KEEPSAKES.map((product) => product.id),
  ]
  return ids.filter((id) => !hasGoogleProductCategory(id))
}

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]!)
}

/** Physical keepsakes checkout will charge right now. Coming-soon plaques and unconfigured supplier products stay out. */
export function keepsakesForMerchantFeed(env: EnvSource = process.env): SellableKeepsake[] {
  return getSellableKeepsakes(env)
}

function includeHandlingTime(provider: SellableKeepsake["provider"]): boolean {
  switch (provider) {
    case "manual":
      return true
    case "printful":
    case "printify":
      return false
    default: {
      const exhaustive: never = provider
      return exhaustive
    }
  }
}

function feedItem(product: SellableKeepsake): string {
  const handling = includeHandlingTime(product.provider)
    ? `
      <g:min_handling_time>${KEEPSAKE_HANDLING_MIN_DAYS}</g:min_handling_time>
      <g:max_handling_time>${KEEPSAKE_HANDLING_MAX_DAYS}</g:max_handling_time>`
    : ""

  return `<item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(product.description)}</g:description>
      <g:link>${escapeXml(`${SITE_URL}/store/${product.id}`)}</g:link>
      <g:image_link>${escapeXml(absoluteAssetUrl(product.image))}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${product.price.toFixed(2)} USD</g:price>
      <g:brand>${escapeXml(SITE_NAME)}</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>${escapeXml(googleProductCategory(product.id))}</g:google_product_category>
      <g:shipping>
        <g:country>US</g:country>
        <g:price>${KEEPSAKE_SHIPPING_PRICE_USD} USD</g:price>
      </g:shipping>${handling}
    </item>`
}

/**
 * The digital memorial is always for sale. Nothing is shipped, so delivery is immediate
 * and the shipping price is zero. Concierge stays out: it is a service, not a Shopping product.
 */
function digitalFeedItem(): string {
  return `<item>
      <g:id>${escapeXml(DIGITAL_MEMORIAL_PRODUCT.id)}</g:id>
      <g:title>${escapeXml(DIGITAL_MEMORIAL_PRODUCT.name)}</g:title>
      <g:description>${escapeXml(DIGITAL_MEMORIAL_DESCRIPTION)}</g:description>
      <g:link>${escapeXml(`${SITE_URL}${DIGITAL_MEMORIAL_PATH}`)}</g:link>
      <g:image_link>${escapeXml(absoluteAssetUrl(DIGITAL_MEMORIAL_IMAGE))}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${DIGITAL_MEMORIAL_PRODUCT.price.toFixed(2)} USD</g:price>
      <g:brand>${escapeXml(SITE_NAME)}</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>${escapeXml(googleProductCategory(DIGITAL_MEMORIAL_PRODUCT.id))}</g:google_product_category>
      <g:product_type>Digital memorial page</g:product_type>
      <g:shipping>
        <g:country>US</g:country>
        <g:service>Digital delivery</g:service>
        <g:price>0.00 USD</g:price>
        <g:min_handling_time>0</g:min_handling_time>
        <g:max_handling_time>0</g:max_handling_time>
        <g:min_transit_time>0</g:min_transit_time>
        <g:max_transit_time>0</g:max_transit_time>
      </g:shipping>
    </item>`
}

/**
 * RSS 2.0 feed with Google's product namespace.
 * Prices come from the catalog checkout charges.
 * The digital memorial is always included. Waitlist plaques and unconfigured supplier products stay out.
 * The concierge service stays out.
 * No GTIN exists, so identifier_exists is no and g:gtin is omitted.
 * Shipping is included in the price for United States addresses on physical keepsakes.
 * Handling time is included only for handmade plaques, where the site states 7 to 10 business days.
 * The 30-day refund is a Merchant Center account setting and Product JSON-LD, not a feed label.
 */
export function buildMerchantFeedXml(env: EnvSource = process.env): string {
  const items = [digitalFeedItem(), ...keepsakesForMerchantFeed(env).map(feedItem)].join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>Products ${escapeXml(SITE_NAME)} can sell right now.</description>
    ${items}
  </channel>
</rss>
`
}
