import { BuyerIntentView } from "@/components/buyer-intent-view"
import { longTailPages } from "@/lib/long-tail"
import { pageMetadata, publicPages } from "@/lib/seo"

const page = longTailPages.photoVideo

export const metadata = pageMetadata(publicPages.photoVideo)

export default function LongTailPage() {
  return <BuyerIntentView page={page} />
}
