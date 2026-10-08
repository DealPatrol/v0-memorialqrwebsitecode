import { BuyerIntentView } from "@/components/buyer-intent-view"
import { buyerIntentPages } from "@/lib/buyer-intent"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.programQr)

export default function FuneralProgramQrPage() {
  return <BuyerIntentView page={buyerIntentPages.program} />
}
