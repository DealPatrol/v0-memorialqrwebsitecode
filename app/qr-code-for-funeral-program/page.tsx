import { DigitalLandingView } from "@/components/digital-landing-view"
import { digitalLandingPages } from "@/lib/digital-landing"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.funeralProgramDigital)

export default function QrCodeForFuneralProgramPage() {
  return <DigitalLandingView page={digitalLandingPages.funeralProgram} />
}
