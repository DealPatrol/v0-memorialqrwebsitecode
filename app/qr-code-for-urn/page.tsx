import { CremationQrView } from "@/components/cremation-qr-view"
import { cremationQrPages } from "@/lib/cremation-qr-pages"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.urnQr)

export default function UrnQrPage() {
  return <CremationQrView page={cremationQrPages.urn} />
}
