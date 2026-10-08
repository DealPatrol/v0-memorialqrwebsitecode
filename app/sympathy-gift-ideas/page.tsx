import { BuyerIntentView } from "@/components/buyer-intent-view"
import { giftIntentList, giftIntentPages } from "@/lib/gift-intent"
import { pageMetadata, publicPages } from "@/lib/seo"

const page = giftIntentPages.sympathy

export const metadata = pageMetadata(publicPages.sympathyGifts)

export default function SympathyGiftPage() {
  return (
    <BuyerIntentView
      page={page}
      related={giftIntentList.filter((item) => item.id !== page.id)}
      relatedHeading="Other remembrance gifts"
    />
  )
}
