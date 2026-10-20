import { DigitalLandingView } from "@/components/digital-landing-view"
import { digitalLandingPages } from "@/lib/digital-landing"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.memorialSlideshowQr)

export default function MemorialSlideshowQrPage() {
  return <DigitalLandingView page={digitalLandingPages.slideshowQr} />
}
