import type { Metadata } from "next"
import { SubscribeClient } from "./subscribe-client"

export const metadata: Metadata = {
  title: "Subscribe - Memorial QR",
  description: "Subscribe to keep your digital memorial active with unlimited QR scans and hosting.",
}

export default function SubscribePage() {
  return <SubscribeClient />
}
