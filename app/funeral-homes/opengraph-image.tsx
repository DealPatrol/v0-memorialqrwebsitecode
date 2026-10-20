import { memorialOgImage, ogContentType, ogSize } from "@/lib/og-card"

export const alt = "Funeral home partners"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return memorialOgImage({
    kicker: "MemorialsQR",
    title: "For funeral homes",
    subtitle: "A partner inquiry. Families can order a digital memorial today.",
  })
}
