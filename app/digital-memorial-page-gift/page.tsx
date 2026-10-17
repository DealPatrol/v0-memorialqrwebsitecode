import { DigitalLandingView } from "@/components/digital-landing-view"
import { digitalLandingPages } from "@/lib/digital-landing"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.digitalMemorialGift)

export default function DigitalMemorialGiftPage() {
  return <DigitalLandingView page={digitalLandingPages.pageGift} />
}
