import { DigitalLandingView } from "@/components/digital-landing-view"
import { digitalLandingPages } from "@/lib/digital-landing"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.dogMemorialQr)

export default function DogMemorialQrPage() {
  return <DigitalLandingView page={digitalLandingPages.dog} />
}
