import { BuyerIntentView } from "@/components/buyer-intent-view"
import { graveQrPages } from "@/lib/grave-qr-pages"
import { longTailPages } from "@/lib/long-tail"
import { pageMetadata, publicPages } from "@/lib/seo"

const page = longTailPages.cemetery
const selling = graveQrPages.cemetery

export const metadata = pageMetadata(publicPages.cemetery)

export default function LongTailPage() {
  return (
    <BuyerIntentView
      page={page}
      digitalOffer={{ href: selling.path, note: selling.guideNote, linkLabel: selling.guideLinkLabel }}
    />
  )
}
