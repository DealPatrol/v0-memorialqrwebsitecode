import { SympathyGiftView } from "@/components/sympathy-gift-view"
import { pageMetadata, publicPages } from "@/lib/seo"
import { sympathyGiftPages } from "@/lib/sympathy-gift-pages"

export const metadata = pageMetadata(publicPages.sympathyGiftMother)

export default function SympathyGiftLossOfMotherPage() {
  return <SympathyGiftView page={sympathyGiftPages.mother} />
}
