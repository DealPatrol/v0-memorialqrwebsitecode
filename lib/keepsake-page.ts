import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { formatUsd, SITE_NAME } from "@/lib/site"

function clip(value: string, max: number): string {
  if (value.length <= max) return value
  return `${value.slice(0, max - 1).trimEnd()}…`
}

/** Title and description for /store/[id]. Descriptions stay within the site's 155-character limit. */
export function keepsakePageCopy(product: { id: string; name: string; price: number }): {
  title: string
  description: string
  path: string
} {
  const path = `/store/${product.id}`
  const title = clip(`${product.name} | ${SITE_NAME}`, 60)
  const description = clip(
    `${product.name} is ${formatUsd(product.price)} once. Shipping is included, with ${HOSTING_INCLUDED_YEARS} years of hosting. Ships in the United States.`,
    155,
  )
  return { title, description, path }
}
