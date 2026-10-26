import { GraveQrView } from "@/components/grave-qr-view"
import { graveQrPages } from "@/lib/grave-qr-pages"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.graveMarkerQrOrder)

export default function GraveMarkerQrOrderPage() {
  return <GraveQrView page={graveQrPages.graveMarker} />
}
