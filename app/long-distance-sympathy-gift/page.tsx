import { SympathyGiftView } from "@/components/sympathy-gift-view"
import { pageMetadata, publicPages } from "@/lib/seo"
import { sympathyGiftPages } from "@/lib/sympathy-gift-pages"

export const metadata = pageMetadata(publicPages.longDistanceSympathyGift)

export default function LongDistanceSympathyGiftPage() {
  return <SympathyGiftView page={sympathyGiftPages.distance} />
}
