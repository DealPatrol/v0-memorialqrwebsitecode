import Image from "next/image"
import Link from "next/link"
import { pageMetadata, publicPages } from "@/lib/seo"
import { Calendar, Heart, MapPin } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MemorialPhotoGallery } from "@/components/memorial-photo-gallery"
import { MemorialMediaSections, type MusicRow, type VideoRow } from "@/components/memorial-media-sections"
import { selectPublicMedia } from "@/lib/media/server"
import { dedupePhotos, type GalleryPhoto } from "@/lib/memorial-photos"
import {
  GLENDA_LEGACY_PORTRAIT,
  GLENDA_MEMORIAL_CARD,
  GLENDA_MEMORIAL_ID,
  GLENDA_PHOTOS,
  GLENDA_PORTRAIT,
} from "@/lib/glenda-memorial"

const baseMetadata = pageMetadata(publicPages.glenda)
export const metadata = {
  ...baseMetadata,
  openGraph: {
    ...baseMetadata.openGraph,
    images: [{ url: "/memorials/glenda-kelso/glenda-memorial-card.jpg", alt: "Glenda Jane Kelso memorial card" }],
  },
}

// Re-check every 10 minutes for photos, videos and recordings the family adds (after approval).
export const revalidate = 600

async function loadFamilyUploads(): Promise<GalleryPhoto[]> {
  try {
    const rows = await selectPublicMedia("photos", GLENDA_MEMORIAL_ID, { limit: 200, ascending: true })
    return rows
      .filter((row) => typeof row.image_url === "string" && row.image_url && row.image_url !== GLENDA_LEGACY_PORTRAIT)
      .map((row) => ({
        id: String(row.id),
        src: row.image_url as string,
        caption: row.caption,
        uploadedBy: row.uploaded_by,
      }))
  } catch {
    return []
  }
}

/** Approved videos, voicemails and songs the family has shared on Glenda's memorial. */
async function loadFamilyMedia(): Promise<{ videos: VideoRow[]; music: MusicRow[] }> {
  const [videos, music] = await Promise.all([
    selectPublicMedia("videos", GLENDA_MEMORIAL_ID, { limit: 50 }).catch(() => []),
    selectPublicMedia("music", GLENDA_MEMORIAL_ID, { limit: 100 }).catch(() => []),
  ])
  return { videos: videos as VideoRow[], music: music as MusicRow[] }
}

export default async function GlendaKelsoMemorialPage() {
  const [uploads, media] = await Promise.all([loadFamilyUploads(), loadFamilyMedia()])
  const photos = dedupePhotos([...GLENDA_PHOTOS, ...uploads])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-16">
        <Card className="overflow-hidden border-purple-100 shadow-xl">
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-800 to-slate-900 px-6 py-14 text-center text-white">
            <Image
              src={GLENDA_MEMORIAL_CARD}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-top opacity-20 blur-sm"
              aria-hidden
            />
            <div className="relative">
              <div className="mx-auto mb-6 size-44 overflow-hidden rounded-full border-4 border-white/80 shadow-2xl md:size-52">
                <Image
                  src={GLENDA_PORTRAIT}
                  alt="Portrait of Glenda Jane Kelso"
                  width={416}
                  height={416}
                  sizes="208px"
                  className="size-full object-cover object-top"
                  priority
                />
              </div>
              <Heart className="mx-auto mb-3 size-8 text-purple-200" fill="currentColor" aria-hidden />
              <p className="mb-2 text-sm uppercase tracking-[0.25em] text-purple-100">In loving memory</p>
              <h1 className="text-4xl font-bold md:text-5xl">Glenda Jane Kelso</h1>
              <p className="mt-5 flex items-center justify-center gap-2 text-purple-100">
                <Calendar className="size-5" />
                July 27, 1952 – August 27, 2025
              </p>
              <p className="mt-2 flex items-center justify-center gap-2 text-purple-100">
                <MapPin className="size-5" />
                Cullman, AL
              </p>
            </div>
          </div>
          <CardContent className="space-y-6 p-8 text-lg leading-relaxed text-slate-700 md:p-12">
            <p>
              Glenda was the inspiration for Memorial QR. Her grandson, Cole Collins, remembers her as the best
              storyteller he ever knew—someone who made people laugh, offered gentle wisdom, and showed her love
              through stories.
            </p>
            <p>
              Cole created this memorial so family and friends have a lasting place to remember Glenda and the stories
              she shared.
            </p>
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button asChild>
                <Link href="/our-story">Read Cole&apos;s Story</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/store">Create Your Own</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8 border-purple-100 shadow-lg">
          <CardHeader>
            <CardTitle>Photo Memories</CardTitle>
          </CardHeader>
          <CardContent>
            <MemorialPhotoGallery photos={photos} />
          </CardContent>
        </Card>

        <div className="mt-8 space-y-8">
          <MemorialMediaSections
            memorialId={GLENDA_MEMORIAL_ID}
            initialVideos={media.videos}
            initialMusic={media.music}
            allowUploads
          />
        </div>
      </main>
    </div>
  )
}
