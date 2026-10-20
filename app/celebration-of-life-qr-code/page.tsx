import { DigitalLandingView } from "@/components/digital-landing-view"
import { digitalLandingPages } from "@/lib/digital-landing"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.celebrationOfLifeQr)

export default function CelebrationOfLifeQrPage() {
  return <DigitalLandingView page={digitalLandingPages.celebrationQr} />
}
