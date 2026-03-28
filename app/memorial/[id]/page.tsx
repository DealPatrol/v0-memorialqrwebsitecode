import type { Metadata } from "next"
import { MemorialClientPage } from "./MemorialClientPage"
import Script from "next/script"

interface Memorial {
  id: string
  full_name: string
  slug: string
  biography: string | null
  birth_date: string | null
  death_date: string | null
  location: string | null
  profile_image_url: string | null
  theme: string | null
}

function MemorialPersonSchema({ memorial }: { memorial: Memorial | null }) {
  if (!memorial) return null

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://memorialsqr.com"

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: memorial.full_name,
    description: memorial.biography || `Memorial page for ${memorial.full_name}`,
    image: memorial.profile_image_url || `${baseUrl}/og-image.jpg`,
    url: `${baseUrl}/memorial/${memorial.slug || memorial.id}`,
    birthDate: memorial.birth_date || undefined,
    deathDate: memorial.death_date || undefined,
    address: memorial.location
      ? {
          "@type": "PostalAddress",
          addressLocality: memorial.location,
        }
      : undefined,
  }

  // Filter out undefined values
  const cleanSchema = JSON.parse(JSON.stringify(schema))

  return (
    <Script
      id="memorial-person-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  )
}

function MemorialWebPageSchema({ memorial }: { memorial: Memorial | null }) {
  if (!memorial) return null

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://memorialsqr.com"

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}/memorial/${memorial.slug || memorial.id}#webpage`,
    name: `Memorial for ${memorial.full_name}`,
    description: memorial.biography || `Visit this memorial page to honor and remember ${memorial.full_name}`,
    url: `${baseUrl}/memorial/${memorial.slug || memorial.id}`,
    isPartOf: {
      "@id": `${baseUrl}/#website`,
    },
    about: {
      "@type": "Person",
      name: memorial.full_name,
    },
    mainEntity: {
      "@type": "Person",
      name: memorial.full_name,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Browse Memorials",
          item: `${baseUrl}/browse-memorials`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `Memorial for ${memorial.full_name}`,
          item: `${baseUrl}/memorial/${memorial.slug || memorial.id}`,
        },
      ],
    },
  }

  return (
    <Script
      id="memorial-webpage-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const memorialId = params.id
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://memorialsqr.com"

    // Fetch memorial data for accurate metadata
    const memorial = await fetch(`${baseUrl}/api/memorials/${memorialId}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .catch(() => null)

    const memorialName = memorial?.memorial?.full_name || "Loved One"
    const memorialBio =
      memorial?.memorial?.biography || `Visit this memorial page to honor and remember ${memorialName}`
    const memorialImage = memorial?.memorial?.profile_image_url || `${baseUrl}/og-image.jpg`
    const memorialUrl = `${baseUrl}/memorial/${memorialId}`
    const birthDate = memorial?.memorial?.birth_date
    const deathDate = memorial?.memorial?.death_date
    const location = memorial?.memorial?.location

    const dateInfo =
      birthDate && deathDate ? ` (${new Date(birthDate).getFullYear()} - ${new Date(deathDate).getFullYear()})` : ""

    return {
      title: `Memorial for ${memorialName}${dateInfo} | Memorial QR`,
      description: memorialBio.slice(0, 155),
      keywords: `${memorialName} memorial, ${memorialName} obituary, ${memorialName} tribute, ${location || ""} memorial, digital memorial, QR code memorial, remembrance`,
      openGraph: {
        title: `Memorial for ${memorialName}`,
        description: `Visit this memorial page to honor and remember ${memorialName}. View photos, videos, and share memories.`,
        url: memorialUrl,
        siteName: "Memorial QR",
        images: [
          {
            url: memorialImage,
            width: 1200,
            height: 630,
            alt: `Memorial for ${memorialName}`,
          },
        ],
        locale: "en_US",
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        title: `Memorial for ${memorialName}`,
        description: `Visit this memorial page to honor and remember ${memorialName}`,
        images: [memorialImage],
      },
      alternates: {
        canonical: memorialUrl,
      },
      robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    }
  } catch (error) {
    return {
      title: "Memorial | Memorial QR",
      description: "Visit this memorial page to honor and remember your loved one",
    }
  }
}

export default async function MemorialPage({ params }: { params: { id: string } }) {
  let memorial: Memorial | null = null

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://memorialsqr.com"
    const response = await fetch(`${baseUrl}/api/memorials/${params.id}`, {
      cache: "no-store",
    })
    const data = await response.json()
    memorial = data?.memorial || null
  } catch (error) {
    console.error("Error fetching memorial for schema:", error)
  }

  return (
    <>
      <MemorialPersonSchema memorial={memorial} />
      <MemorialWebPageSchema memorial={memorial} />
      <MemorialClientPage />
    </>
  )
}
