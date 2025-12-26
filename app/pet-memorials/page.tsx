import type { Metadata } from "next"
import { PetMemorialsClient } from "./pet-memorials-client"

export const metadata: Metadata = {
  title: "Pet Memorial QR Codes | Honor Your Beloved Pet | Memorial QR",
  description:
    "Create a lasting digital tribute for your beloved pet. QR code picture frames, custom sketch posters, garden stones, and memorial tags to honor dogs, cats, and all pets.",
  keywords: [
    "pet memorial",
    "dog memorial",
    "cat memorial",
    "pet remembrance",
    "pet QR code",
    "pet tribute",
    "rainbow bridge memorial",
    "pet loss",
    "pet memorial frame",
    "pet sketch portrait",
  ],
  openGraph: {
    title: "Pet Memorial QR Codes | Honor Your Beloved Pet",
    description: "Create a lasting digital tribute for your beloved pet with QR code memorials.",
    url: "https://memorialsqr.com/pet-memorials",
    type: "website",
    images: [
      {
        url: "/pet-memorial-dog-cat-rainbow-bridge.jpg",
        width: 1200,
        height: 630,
        alt: "Pet Memorial QR Products",
      },
    ],
  },
  alternates: {
    canonical: "https://memorialsqr.com/pet-memorials",
  },
}

export default function PetMemorialsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProductCollection",
            name: "Pet Memorial QR Products",
            description:
              "QR code memorials for beloved pets including picture frames, sketch posters, garden stones, and tags.",
            url: "https://memorialsqr.com/pet-memorials",
            provider: {
              "@type": "Organization",
              name: "Memorial QR",
              url: "https://memorialsqr.com",
            },
          }),
        }}
      />
      <PetMemorialsClient />
    </>
  )
}
