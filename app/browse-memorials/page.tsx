import type { Metadata } from "next"
import { BrowseMemorialsClient } from "./BrowseMemorialsClient"
import { createClient } from "@/lib/supabase/client"
import Script from "next/script"
import { BreadcrumbSchema } from "@/components/seo/structured-data"

type Memorial = {
  id: string
  full_name: string
  birth_date: string | null
  death_date: string | null
  location: string | null
  biography: string | null
  profile_image_url: string | null
  slug: string
  created_at: string
}

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Browse Memorial Examples | See Beautiful Digital Memorials | Memorial QR",
  description:
    "Explore sample digital memorials created with Memorial QR. See photos, videos, stories, and QR code plaques honoring loved ones. Get inspired for your own memorial.",
  keywords:
    "sample memorials, memorial examples, digital memorial examples, QR memorial samples, online memorial pages, memorial inspiration, obituary examples, tribute pages",
  openGraph: {
    title: "Sample Digital Memorials - Browse Real Examples",
    description:
      "See beautiful memorial pages created by families. Explore photos, videos, stories, and QR code plaques that keep memories alive forever.",
    type: "website",
    url: "https://memorialsqr.com/browse-memorials",
    images: [
      {
        url: "https://memorialsqr.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sample Memorial Pages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Sample Digital Memorials",
    description: "See real examples of beautiful memorial pages with photos, videos, and QR codes",
    images: ["https://memorialsqr.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://memorialsqr.com/browse-memorials",
  },
}

function CollectionPageSchema({ memorials }: { memorials: Memorial[] }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://memorialsqr.com"

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${baseUrl}/browse-memorials#collectionpage`,
    name: "Browse Digital Memorials",
    description:
      "Explore beautiful digital memorials created with Memorial QR. See photos, videos, stories, and QR code plaques honoring loved ones.",
    url: `${baseUrl}/browse-memorials`,
    isPartOf: {
      "@id": `${baseUrl}/#website`,
    },
    about: {
      "@type": "Thing",
      name: "Digital Memorials",
    },
    numberOfItems: memorials.length,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: memorials.length,
      itemListElement: memorials.slice(0, 10).map((memorial, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "WebPage",
          name: `Memorial for ${memorial.full_name}`,
          url: `${baseUrl}/memorial/${memorial.slug || memorial.id}`,
        },
      })),
    },
  }

  return (
    <Script
      id="collection-page-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default async function BrowseMemorials() {
  const supabase = createClient()
  let memorials: Memorial[] = []

  try {
    const { data, error } = await supabase.from("memorials").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching memorials:", error)
    } else {
      memorials = data || []
    }
  } catch (error) {
    console.error("Error in fetchMemorials:", error)
  }

  return (
    <>
      <CollectionPageSchema memorials={memorials} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://memorialsqr.com" },
          { name: "Browse Memorials", url: "https://memorialsqr.com/browse-memorials" },
        ]}
      />
      <BrowseMemorialsClient memorials={memorials} />
    </>
  )
}
