import { BuyerIntentView } from "@/components/buyer-intent-view"
import { longTailPages } from "@/lib/long-tail"
import { pageMetadata, publicPages } from "@/lib/seo"

const page = longTailPages.home

export const metadata = pageMetadata(publicPages.home)

export default function LongTailPage() {
  return <BuyerIntentView page={page} />
}
