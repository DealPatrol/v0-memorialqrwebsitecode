import { obituaryPage as page } from "@/lib/obituary"
import { memorialOgImage, ogContentType, ogSize } from "@/lib/og-card"

export const alt = page.h1
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return memorialOgImage({ kicker: "MemorialsQR", title: page.ogTitle, subtitle: page.ogSubtitle })
}
