import { BuyerIntentView } from "@/components/buyer-intent-view"
import { longTailPages } from "@/lib/long-tail"
import { pageMetadata, publicPages } from "@/lib/seo"

const page = longTailPages.farAway

export const metadata = pageMetadata(publicPages.farAway)

export default function LongTailPage() {
  return <BuyerIntentView page={page} />
}
