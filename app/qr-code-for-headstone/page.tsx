import { BuyerIntentView } from "@/components/buyer-intent-view"
import { buyerIntentPages } from "@/lib/buyer-intent"
import { graveQrPages } from "@/lib/grave-qr-pages"
import { pageMetadata, publicPages } from "@/lib/seo"

const selling = graveQrPages.headstone

export const metadata = pageMetadata(publicPages.headstoneQr)

export default function HeadstoneQrPage() {
  return (
    <BuyerIntentView
      page={buyerIntentPages.headstone}
      digitalOffer={{ href: selling.path, note: selling.guideNote, linkLabel: selling.guideLinkLabel }}
    />
  )
}
