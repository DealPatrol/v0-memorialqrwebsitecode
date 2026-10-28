import { DigitalLandingView } from "@/components/digital-landing-view"
import { digitalLandingPages } from "@/lib/digital-landing"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.catMemorialQr)

export default function CatMemorialQrPage() {
  return <DigitalLandingView page={digitalLandingPages.cat} />
}
