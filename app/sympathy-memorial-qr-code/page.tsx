import { DigitalLandingView } from "@/components/digital-landing-view"
import { digitalLandingPages } from "@/lib/digital-landing"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.sympathyMemorialQr)

export default function SympathyMemorialQrPage() {
  return <DigitalLandingView page={digitalLandingPages.sympathy} />
}
