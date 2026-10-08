import { BuyerIntentView } from "@/components/buyer-intent-view"
import { buyerIntentPages } from "@/lib/buyer-intent"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.urnQr)

export default function UrnQrPage() {
  return <BuyerIntentView page={buyerIntentPages.urn} />
}
