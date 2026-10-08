import { memorialOgImage, ogContentType, ogSize } from "@/lib/og-card"

export const alt = "Funeral home partners"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return memorialOgImage({
    kicker: "MemorialsQR",
    title: "For funeral homes",
    subtitle: "Ask about offering a QR memorial plaque to the families you serve.",
  })
}
