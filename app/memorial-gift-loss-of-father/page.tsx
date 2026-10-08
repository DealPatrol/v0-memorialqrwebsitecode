import { BuyerIntentView } from "@/components/buyer-intent-view"
import { giftIntentList, giftIntentPages } from "@/lib/gift-intent"
import { pageMetadata, publicPages } from "@/lib/seo"

const page = giftIntentPages.father

export const metadata = pageMetadata(publicPages.fatherGift)

export default function FatherGiftPage() {
  return (
    <BuyerIntentView
      page={page}
      related={giftIntentList.filter((item) => item.id !== page.id)}
      relatedHeading="Other remembrance gifts"
    />
  )
}
