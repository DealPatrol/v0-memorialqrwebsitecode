import { BuyerIntentView } from "@/components/buyer-intent-view"
import { buyerIntentPages } from "@/lib/buyer-intent"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.headstoneQr)

export default function HeadstoneQrPage() {
  return <BuyerIntentView page={buyerIntentPages.headstone} />
}
