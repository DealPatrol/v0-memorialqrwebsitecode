import { BuyerIntentView } from "@/components/buyer-intent-view"
import { buyerIntentPages } from "@/lib/buyer-intent"
import { graveQrPages } from "@/lib/grave-qr-pages"
import { pageMetadata, publicPages } from "@/lib/seo"

const selling = graveQrPages.plaque

export const metadata = pageMetadata(publicPages.plaqueQr)

export default function PlaqueQrPage() {
  return (
    <BuyerIntentView
      page={buyerIntentPages.plaque}
      digitalOffer={{ href: selling.path, note: selling.guideNote, linkLabel: selling.guideLinkLabel }}
    />
  )
}
