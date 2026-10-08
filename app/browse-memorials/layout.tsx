import type { ReactNode } from "react"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.browse)

export default function BrowseMemorialsLayout({ children }: { children: ReactNode }) {
  return children
}
