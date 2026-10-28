import { digitalLandingPages } from "@/lib/digital-landing"
import { memorialOgImage, ogContentType, ogSize } from "@/lib/og-card"

const page = digitalLandingPages.tag

export const alt = page.h1
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return memorialOgImage({ kicker: "MemorialsQR", title: page.ogTitle, subtitle: page.ogSubtitle })
}
