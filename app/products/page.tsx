import type { Metadata } from "next"
import { ProductsClient } from "./products-client"

export const metadata: Metadata = {
  title: "Memorial QR Plaque - Premium QR Code Memorial Product | Memorial QR",
  description:
    "Premium aluminum memorial plaque with custom QR code. Weather-resistant, laser-engraved, includes lifetime digital memorial hosting. $149 with free shipping & 5-year guarantee.",
  keywords:
    "memorial QR plaque, QR code headstone, memorial plaque with QR code, weatherproof memorial plaque, digital memorial product, engraved QR code",
  openGraph: {
    title: "Memorial QR Plaque - Weather-Resistant with Lifetime Digital Memorial",
    description:
      "Premium aluminum plaque with custom QR code linking to a lifetime digital memorial. Weather-resistant, laser-engraved, with 5-year guarantee.",
    type: "product",
    url: "https://memorialsqr.com/products",
    images: [
      {
        url: "https://memorialsqr.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Memorial QR Plaque Product",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Memorial QR Plaque - $149",
    description: "Weather-resistant • Laser-engraved • Lifetime memorial hosting • 5-year guarantee",
    images: ["https://memorialsqr.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://memorialsqr.com/products",
  },
}

export default function ProductsPage() {
  return <ProductsClient />
}
