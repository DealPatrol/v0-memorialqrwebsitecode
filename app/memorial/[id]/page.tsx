import type { Metadata } from "next"
import { MemorialClientPage } from "./MemorialClientPage"

interface Memorial {
  id: string
  full_name: string
  slug: string
  biography: string | null
  birth_date: string | null
  death_date: string | null
  location: string | null
  profile_image_url: string | null
  theme: string | null // Added theme field
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const memorialId = params.id
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://memorialqr.com"

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

    return {
      title: `Memorial for ${memorialName} | Memorial QR`,
      description: memorialBio.slice(0, 155),
      openGraph: {
        title: `Memorial for ${memorialName}`,
        description: `Visit this memorial page to honor and remember ${memorialName}`,
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
        type: "website",
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
    }
  } catch (error) {
    return {
      title: "Memorial | Memorial QR",
      description: "Visit this memorial page",
    }
  }
}

export default function MemorialPage() {
  return <MemorialClientPage />
}
