import { DigitalLandingView } from "@/components/digital-landing-view"
import { digitalLandingPages } from "@/lib/digital-landing"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.obituaryQr)

export default function ObituaryQrPage() {
  return <DigitalLandingView page={digitalLandingPages.obituaryQr} />
}
