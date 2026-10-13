import { SITE_URL } from "@/lib/site"

export function memorialSlugForOrder(orderNumber: string): string {
  return orderNumber.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

export function memorialPageUrl(slug: string): string {
  return `${SITE_URL}/memorial/${slug}`
}

/** QR codes open the short link, which redirects to the memorial. */
export function qrScanUrl(code: string): string {
  return `${SITE_URL}/q/${code}`
}

export function printFileUrl(slug: string): string {
  return `${SITE_URL}/api/print-file/${slug}`
}
