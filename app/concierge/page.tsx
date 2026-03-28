import { Metadata } from "next"
import { ConciergePageClient } from "./page.client"

export const metadata: Metadata = {
  title: "Concierge Memorial Service | Memorial QR",
  description: "We build the legacy for you. Send us your memories, and our team will create a beautiful, interactive digital memorial with a custom QR code plaque.",
  openGraph: {
    title: "Memorial QR Concierge Service",
    description: "Professional memorial creation service - we handle everything",
    type: "website",
  },
}

export default function ConciergePage() {
  return <ConciergePageClient />
}
