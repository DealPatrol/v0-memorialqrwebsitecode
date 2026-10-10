import { getListedKeepsake } from "@/lib/fulfillment-availability"
import { memorialOgImage, ogContentType, ogSize } from "@/lib/og-card"
import { formatUsd, KEEPSAKE_HANDLING_TIME } from "@/lib/site"

export const alt = "QR memorial keepsake"
export const size = ogSize
export const contentType = ogContentType
export const dynamic = "force-dynamic"

export default function Image({ params }: { params: { id: string } }) {
  const product = getListedKeepsake(params.id)
  return memorialOgImage({
    kicker: product ? formatUsd(product.price) : "MemorialsQR",
    title: product?.name ?? "QR memorial keepsake",
    subtitle:
      product?.provider === "manual"
        ? `Made to order. We ship within ${KEEPSAKE_HANDLING_TIME}.`
        : "Ships to United States addresses. Hosting included.",
  })
}
