import { DigitalLandingView } from "@/components/digital-landing-view"
import { digitalLandingPages } from "@/lib/digital-landing"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.petDigitalMemorialQr)

export default function PetDigitalMemorialQrPage() {
  return <DigitalLandingView page={digitalLandingPages.pet} />
}
