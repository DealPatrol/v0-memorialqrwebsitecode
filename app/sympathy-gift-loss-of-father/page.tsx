import { SympathyGiftView } from "@/components/sympathy-gift-view"
import { pageMetadata, publicPages } from "@/lib/seo"
import { sympathyGiftPages } from "@/lib/sympathy-gift-pages"

export const metadata = pageMetadata(publicPages.sympathyGiftFather)

export default function SympathyGiftLossOfFatherPage() {
  return <SympathyGiftView page={sympathyGiftPages.father} />
}
