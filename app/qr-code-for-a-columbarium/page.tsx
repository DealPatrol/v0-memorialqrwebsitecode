import { CremationQrView } from "@/components/cremation-qr-view"
import { cremationQrPages } from "@/lib/cremation-qr-pages"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.columbarium)

export default function ColumbariumQrPage() {
  return <CremationQrView page={cremationQrPages.columbarium} />
}
