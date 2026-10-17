import { DigitalLandingView } from "@/components/digital-landing-view"
import { digitalLandingPages } from "@/lib/digital-landing"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.createMemorialQrOnline)

export default function CreateMemorialQrOnlinePage() {
  return <DigitalLandingView page={digitalLandingPages.createOnline} />
}
