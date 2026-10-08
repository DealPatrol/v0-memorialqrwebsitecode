import { AdLandingView } from "@/components/ad-landing-view"
import { adLandingPages } from "@/lib/ad-landings"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.adPetPlaque)

export default function AdLandingPage() {
  return <AdLandingView page={adLandingPages.petPlaque} />
}
