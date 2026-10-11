import { MANUAL_KEEPSAKES, POD_PRODUCTS } from "@/lib/catalog"
import { getSellableKeepsakes, type SellableKeepsake } from "@/lib/fulfillment-availability"
import type { EnvSource } from "@/lib/fulfillment-readiness"
import {
  absoluteAssetUrl,
  KEEPSAKE_HANDLING_MAX_DAYS,
  KEEPSAKE_HANDLING_MIN_DAYS,
  KEEPSAKE_SHIPPING_PRICE_USD,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site"

/** Public Google Merchant Center feed. Same ids and prices as Square checkout. */
export const MERCHANT_FEED_PATH = "/merchant-feed.xml"

/**
 * Official Google product taxonomy paths. Numeric ids are accepted too;
 * the path is what a person reviewing the feed can check.
 * Photo blocks have no exact taxonomy entry; picture frames is the closest real one.
 */
const GOOGLE_PRODUCT_CATEGORY: Record<string, string> = {
  "keep-card":
    "Arts & Entertainment > Hobbies & Creative Arts > Arts & Crafts > Art & Crafting Materials > Embellishments & Trims > Decorative Stickers",
  "memorial-coaster": "Home & Garden > Kitchen & Dining > Barware > Coasters",
  "acrylic-keyring": "Apparel & Accessories > Handbag & Wallet Accessories > Keychains",
  "voice-keychain": "Apparel & Accessories > Handbag & Wallet Accessories > Keychains",
  "slate-plaque": "Home & Garden > Decor > Decorative Plaques",
  "pet-tag": "Animals & Pet Supplies > Pet Supplies > Pet ID Tags",
  "photo-block": "Home & Garden > Decor > Picture Frames",
  "qr-memorial-plaque": "Home & Garden > Decor > Decorative Plaques",
  "pet-memorial-plaque": "Home & Garden > Decor > Decorative Plaques",
}

export function googleProductCategory(id: string): string {
  const category = GOOGLE_PRODUCT_CATEGORY[id]
  if (!category) {
    throw new Error(`Missing Google product category for ${id}`)
  }
  return category
}

/** Every catalog keepsake id must have a taxonomy path before it can be sold into the feed. */
export function catalogIdsMissingGoogleCategory(): string[] {
  const ids = [...POD_PRODUCTS.map((product) => product.id), ...MANUAL_KEEPSAKES.map((product) => product.id)]
  return ids.filter((id) => !GOOGLE_PRODUCT_CATEGORY[id])
}

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]!)
}

/** Keepsakes Square will charge right now. Coming-soon plaques and unconfigured supplier products stay out. */
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
 * RSS 2.0 feed with Google's product namespace.
 * Prices come from getSellableKeepsakes, the same catalog checkout uses.
 * No GTIN exists, so identifier_exists is no and g:gtin is omitted.
 * Shipping is included in the price for United States addresses.
 * Handling time is included only for handmade plaques, where the site states 7 to 10 business days.
 * The 30-day refund is a Merchant Center account setting and Product JSON-LD, not a feed label.
 */
export function buildMerchantFeedXml(env: EnvSource = process.env): string {
  const items = keepsakesForMerchantFeed(env).map(feedItem).join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>Keepsakes ${escapeXml(SITE_NAME)} can sell right now.</description>
    ${items}
  </channel>
</rss>
`
}
