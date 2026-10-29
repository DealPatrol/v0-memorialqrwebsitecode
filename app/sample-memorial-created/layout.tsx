import type React from "react"
import { utilityNoindex } from "@/lib/utility-noindex"

export const metadata = utilityNoindex(
  "/sample-memorial-created",
  "Sample Memorial | MemorialsQR",
  "A practice page after the sample memorial form. It is not a published memorial and is not listed in search.",
)

export default function SampleMemorialCreatedLayout({ children }: { children: React.ReactNode }) {
  return children
}
