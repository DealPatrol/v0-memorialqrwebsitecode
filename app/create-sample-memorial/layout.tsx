import type React from "react"
import { utilityNoindex } from "@/lib/utility-noindex"

export const metadata = utilityNoindex(
  "/create-sample-memorial",
  "Sample Memorial Form | MemorialsQR",
  "A practice form for a sample memorial. It does not create a published page and is not listed in search.",
)

export default function CreateSampleMemorialLayout({ children }: { children: React.ReactNode }) {
  return children
}
