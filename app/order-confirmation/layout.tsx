import type React from "react"
import { utilityNoindex } from "@/lib/utility-noindex"

export const metadata = utilityNoindex(
  "/order-confirmation",
  "Order Confirmation | MemorialsQR",
  "Details for a MemorialsQR order. Open this page from the link in your email.",
)

export default function OrderConfirmationLayout({ children }: { children: React.ReactNode }) {
  return children
}
