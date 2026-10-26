import { GraveQrView } from "@/components/grave-qr-view"
import { graveQrPages } from "@/lib/grave-qr-pages"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.cemeteryQrPrint)

export default function CemeteryQrPrintPage() {
  return <GraveQrView page={graveQrPages.cemetery} />
}
