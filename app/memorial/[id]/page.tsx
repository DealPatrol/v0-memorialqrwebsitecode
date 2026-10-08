import type { Metadata } from "next"
import { MemorialClientPage } from "./MemorialClientPage"
import { isIndexableMemorial } from "@/lib/memorial-indexing"
import { assertMetadataLength, pageMetadata } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"

function clip(value: string, max: number): string {
  if (value.length <= max) return value
  return `${value.slice(0, max - 1).trimEnd()}…`
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const memorialPath = `/memorial/${params.id}`
  const hidden = pageMetadata({
    title: "Private Memorial | MemorialsQR",
    description: "This memorial page is not published for search.",
    path: memorialPath,
    index: false,
  })

  try {
    const response = await fetch(`${SITE_URL}/api/memorials/${params.id}`, { cache: "no-store" })
    if (!response.ok) return hidden
    const payload = (await response.json()) as { memorial?: Record<string, unknown> }
    const memorial = payload.memorial
    if (!memorial || !isIndexableMemorial(memorial)) return hidden

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
  } catch {
    return hidden
  }
}

export default function MemorialPage() {
  return <MemorialClientPage />
}
