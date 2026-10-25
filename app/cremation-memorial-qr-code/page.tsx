import { CremationQrView } from "@/components/cremation-qr-view"
import { cremationQrPages } from "@/lib/cremation-qr-pages"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.cremationMemorialQr)

export default function CremationMemorialQrPage() {
  return <CremationQrView page={cremationQrPages.cremation} />
}
