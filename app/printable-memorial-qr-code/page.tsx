import { DigitalLandingView } from "@/components/digital-landing-view"
import { digitalLandingPages } from "@/lib/digital-landing"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.printableMemorialQr)

export default function PrintableMemorialQrPage() {
  return <DigitalLandingView page={digitalLandingPages.printable} />
}
