import type { ReactNode } from "react"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.contact)

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children
}
