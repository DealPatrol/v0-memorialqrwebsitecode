import { SympathyGiftView } from "@/components/sympathy-gift-view"
import { pageMetadata, publicPages } from "@/lib/seo"
import { sympathyGiftPages } from "@/lib/sympathy-gift-pages"

export const metadata = pageMetadata(publicPages.petLossSympathyGift)

export default function PetLossSympathyGiftPage() {
  return <SympathyGiftView page={sympathyGiftPages.pet} />
}
