import type { ReactNode } from "react"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.createMemorial)

export default function CreateMemorialLayout({ children }: { children: ReactNode }) {
  return children
}