import { ConciergePageClient } from "./page.client"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.concierge)

export default function ConciergePage() {
  return <ConciergePageClient />
}
