import { BuyerIntentView } from "@/components/buyer-intent-view"
import { giftIntentList, giftIntentPages } from "@/lib/gift-intent"
import { pageMetadata, publicPages } from "@/lib/seo"

const page = giftIntentPages.friend

export const metadata = pageMetadata(publicPages.friendGift)

export default function FriendGiftPage() {
  return (
    <BuyerIntentView
      page={page}
      related={giftIntentList.filter((item) => item.id !== page.id)}
      relatedHeading="Other remembrance gifts"
    />
  )
}
