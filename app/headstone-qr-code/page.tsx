import { GraveQrView } from "@/components/grave-qr-view"
import { graveQrPages } from "@/lib/grave-qr-pages"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.headstoneQrPrint)

export default function HeadstoneQrPrintPage() {
  return <GraveQrView page={graveQrPages.headstone} />
}
