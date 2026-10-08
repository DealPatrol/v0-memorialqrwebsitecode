import { giftIntentPages } from "@/lib/gift-intent"
import { memorialOgImage, ogContentType, ogSize } from "@/lib/og-card"

const page = giftIntentPages.mother

export const alt = page.h1
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return memorialOgImage({ kicker: "MemorialsQR", title: page.ogTitle, subtitle: page.ogSubtitle })
}
