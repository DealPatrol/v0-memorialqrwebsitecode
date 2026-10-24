import { digitalLandingList } from "@/lib/digital-landing"
import { DIGITAL_MEMORIAL_PATH } from "@/lib/digital-memorial"
import { EXAMPLE_MEMORIAL_PATH } from "@/lib/example-memorial"
import { KEEPSAKE_COLLECTION_PATH } from "@/lib/keepsake-collection"
import { sympathyGiftList } from "@/lib/sympathy-gift-pages"

/** Session key for the first digital-memorial selling page in this browser tab. */
export const DIGITAL_LANDING_STORAGE_KEY = "mqr_digital_landing"

/** Pet hub. The primary button buys the digital memorial, so the visit is a selling page. */
export const PET_MEMORIAL_HUB_PATH = "/pet-memorials"

const sellingPaths = new Set<string>([
  DIGITAL_MEMORIAL_PATH,
  EXAMPLE_MEMORIAL_PATH,
  KEEPSAKE_COLLECTION_PATH,
  PET_MEMORIAL_HUB_PATH,
  ...digitalLandingList.map((page) => page.path),
  ...sympathyGiftList.map((page) => page.path),
])

export function isDigitalSellingPath(path: string | null | undefined): path is string {
  return typeof path === "string" && sellingPaths.has(path)
}

/**
 * Keep the first selling page in the tab. A later click to the product page,
 * the example, or checkout does not replace the SEO page that started the visit.
 */
export function resolveDigitalLanding(stored: string | null, pathname: string): string | null {
  if (isDigitalSellingPath(stored)) return stored
  if (isDigitalSellingPath(pathname)) return pathname
  return null
}
