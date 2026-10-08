import { BuyerIntentView } from "@/components/buyer-intent-view"
import { buyerIntentPages } from "@/lib/buyer-intent"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.plaqueQr)

export default function PlaqueQrPage() {
  return <BuyerIntentView page={buyerIntentPages.plaque} />
}
