import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MemorialClientPage } from "./MemorialClientPage"
import { isIndexableMemorial } from "@/lib/memorial-indexing"
import { lookupMemorial } from "@/lib/memorial-lookup"
import { assertMetadataLength, pageMetadata } from "@/lib/seo"

function clip(value: string, max: number): string {
  if (value.length <= max) return value
  return `${value.slice(0, max - 1).trimEnd()}…`
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const memorialPath = `/memorial/${params.id}`
  const lookup = await lookupMemorial(params.id)
  if (lookup.status === "missing") {
    return {
      title: "Memorial not found | MemorialsQR",
      description: "This memorial page does not exist.",
      robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
      },
    }
  }

  const hidden = pageMetadata({
    title: "Private Memorial | MemorialsQR",
    description: "This memorial page is not published for search.",
    path: memorialPath,
    index: false,
  })

  const memorial = lookup.memorial
  if (lookup.status === "unknown" || !memorial || !isIndexableMemorial(memorial)) return hidden

  const name = typeof memorial.full_name === "string" && memorial.full_name.trim() ? memorial.full_name.trim() : "a loved one"
  const title = clip(`Memorial for ${name} | MemorialsQR`, 60)
  const biography = typeof memorial.biography === "string" ? memorial.biography.trim() : ""
  const description = clip(
    biography || `Online memorial page for ${name}, with photos, stories, and messages.`,
    155,
  )
  assertMetadataLength(title, description, memorialPath)
    const metadata = pageMetadata({ title, description, path: memorialPath, index: true })
    const image = typeof memorial.profile_image_url === "string" ? memorial.profile_image_url : undefined

    return {
      ...metadata,
      openGraph: {
        ...metadata.openGraph,
        images: image ? [{ url: image, alt: title }] : undefined,
      },
    }
}

export default async function MemorialPage({ params }: { params: { id: string } }) {
  const lookup = await lookupMemorial(params.id)
  if (lookup.status === "missing") notFound()
  return <MemorialClientPage />
}
