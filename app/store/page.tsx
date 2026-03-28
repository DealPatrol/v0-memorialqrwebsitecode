import type { Metadata } from "next"
import { StoreClient } from "./store-client"

export const metadata: Metadata = {
  title: "Store - Memorial QR Products | Buy QR Memorial Plaques",
  description:
    "Shop our collection of QR memorial plaques and accessories. Silver, gold, and black plaques starting at $39.89. Free shipping on all orders.",
  keywords:
    "memorial QR plaque, QR code memorial, buy memorial plaque, memorial accessories, QR keychain, stone memorial",
  openGraph: {
    title: "Memorial QR Store - Shop QR Memorial Plaques",
    description:
      "Beautiful QR memorial plaques and accessories. Scan to visit their digital memorial. Starting at $39.89.",
    type: "website",
    url: "https://memorialsqr.com/store",
  },
  alternates: {
    canonical: "https://memorialsqr.com/store",
  },
}

export default function StorePage() {
  return <StoreClient />
}
