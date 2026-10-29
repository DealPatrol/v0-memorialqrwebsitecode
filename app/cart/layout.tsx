import type React from "react"
import { utilityNoindex } from "@/lib/utility-noindex"

export const metadata = utilityNoindex(
  "/cart",
  "Your Cart | MemorialsQR",
  "Review items in your MemorialsQR cart. This page is not listed in search.",
)

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children
}
