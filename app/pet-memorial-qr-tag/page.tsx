import { DigitalLandingView } from "@/components/digital-landing-view"
import { digitalLandingPages } from "@/lib/digital-landing"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.petMemorialQrTag)

export default function PetMemorialQrTagPage() {
  return <DigitalLandingView page={digitalLandingPages.tag} />
}
