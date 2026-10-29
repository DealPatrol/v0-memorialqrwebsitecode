import { CONCIERGE_PRODUCTS, DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import {
  DIGITAL_MEMORIAL_CHECKOUT_PATH,
  DIGITAL_MEMORIAL_DESCRIPTION,
  DIGITAL_MEMORIAL_PATH,
} from "@/lib/digital-memorial"
import { getListedKeepsakes, getSellableKeepsakes } from "@/lib/fulfillment-availability"
import type { EnvSource } from "@/lib/fulfillment-readiness"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { MERCHANT_FEED_PATH } from "@/lib/merchant-feed"
import { publicPages } from "@/lib/seo"
import { formatUsd, SITE_NAME, SITE_URL, SUPPORT_EMAIL } from "@/lib/site"

const KEY_PAGE_IDS = [
  "home",
  "digitalMemorial",
  "exampleMemorial",
  "keepsakes",
  "store",
  "concierge",
  "pricing",
  "howItWorks",
  "faq",
  "contact",
  "blog",
  "guides",
  "sympathyGifts",
  "funeralHomes",
  "petMemorials",
  "humanMemorials",
  "terms",
  "privacy",
] as const satisfies readonly (keyof typeof publicPages)[]

function checkoutUrl(productId: string): string {
  return `${SITE_URL}/checkout/simple?product=${productId}`
}

function section(title: string, lines: string[]): string {
  if (lines.length === 0) return ""
  return `## ${title}\n\n${lines.join("\n")}\n`
}

/**
 * /llms.txt for answer engines. Prices come from the catalog.
 * Product and FAQ JSON-LD stays on the pages; this file points at them.
 */
export function buildLlmsTxt(env: EnvSource = process.env): string {
  const forSale = getSellableKeepsakes(env)
  const waiting = getListedKeepsakes(env).filter((product) => !product.available)
  const plaqueNote = waiting.length
    ? "The metal plaques are on the waitlist and are not for sale."
    : "The metal plaques listed under products checkout can charge can be ordered."

  const products = [
    `- [${DIGITAL_MEMORIAL_PRODUCT.name}](${SITE_URL}${DIGITAL_MEMORIAL_PATH}): ${formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)}, paid once. ${DIGITAL_MEMORIAL_DESCRIPTION} Checkout: ${SITE_URL}${DIGITAL_MEMORIAL_CHECKOUT_PATH}`,
    ...forSale.map(
      (product) =>
        `- [${product.name}](${SITE_URL}/store/${product.id}): ${formatUsd(product.price)}, paid once. ${product.description} Shipping to a United States address is included in the price. Checkout: ${checkoutUrl(product.id)}`,
    ),
  ]

  const services = CONCIERGE_PRODUCTS.map(
    (product) =>
      `- [${product.name}](${SITE_URL}/concierge): ${formatUsd(product.price)}, paid once. We build the memorial page and email the link. Nothing is shipped. This is a service, so it is not in the Google product feed. Checkout: ${checkoutUrl(product.id)}`,
  )

  const waitlist = waiting.map(
    (product) =>
      `- [${product.name}](${SITE_URL}/store/${product.id}): Catalog price ${formatUsd(product.price)}. On the waitlist and not for sale. Checkout will not charge it, and it is not in the product feed.`,
  )

  const pages = KEY_PAGE_IDS.map((id) => {
    const page = publicPages[id]
    const url = page.path === "/" ? SITE_URL : `${SITE_URL}${page.path}`
    return `- [${page.title}](${url}): ${page.description}`
  })

  return `# ${SITE_NAME}

> ${SITE_NAME} (${SITE_URL}) sells an online memorial page and a QR code you can print or share. The digital memorial page is ${formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)}, paid once, and nothing is shipped for that order. ${plaqueNote} Hosting for ${HOSTING_INCLUDED_YEARS} years is included, with no monthly fee.

${SITE_NAME} is a US business in Hanceville, Alabama. Email ${SUPPORT_EMAIL}. Prices below are the catalog amounts checkout charges. Product and FAQ structured data is on the product pages. This file does not repeat those questions or offers.

${section("Products checkout can charge", products)}
${section("Services", services)}
${section("On the waitlist", waitlist)}
${section("Key pages", pages)}
${section("Product feed", [
  `- [Google Merchant Center feed](${SITE_URL}${MERCHANT_FEED_PATH}): XML for products checkout can charge right now, at the catalog price. Waitlist plaques are excluded. Concierge services are excluded.`,
  `- [Sitemap](${SITE_URL}/sitemap.xml)`,
])}
`
}
