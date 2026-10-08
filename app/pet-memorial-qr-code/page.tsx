import { BuyerIntentView } from "@/components/buyer-intent-view"
import { buyerIntentPages } from "@/lib/buyer-intent"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.petQr)

export default function PetQrPage() {
  return <BuyerIntentView page={buyerIntentPages.pet} />
}
