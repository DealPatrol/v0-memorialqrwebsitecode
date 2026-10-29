import type React from "react"
import { utilityNoindex } from "@/lib/utility-noindex"

export const metadata = utilityNoindex(
  "/order-success",
  "Order Received | MemorialsQR",
  "Confirmation after a MemorialsQR order. Open this page from the link in your email.",
)

export default function OrderSuccessLayout({ children }: { children: React.ReactNode }) {
  return children
}
