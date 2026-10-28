import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { HolidayRemembranceView } from "@/components/holiday-remembrance-view"
import { MemorialPhotoGallery } from "@/components/memorial-photo-gallery"
import { HOLIDAY_COPY, holidayMetadataInput } from "@/lib/holiday-remembrance"
import { loadHolidayRemembrance } from "@/lib/holiday-remembrance-load"
import { pageMetadata } from "@/lib/seo"

export const dynamic = "force-dynamic"

const hiddenMetadata = {
  title: "Remembrance page | MemorialsQR",
  description: "This Christmas remembrance page is not available.",
  index: false as const,
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const hidden = pageMetadata({ ...hiddenMetadata, path: `/memorial/${params.id}/holiday` })
  try {
    const content = await loadHolidayRemembrance(params.id)
    if (!content) return hidden
    return pageMetadata(
      holidayMetadataInput({
        path: content.pagePath,
        fullName: content.fullName,
        sample: false,
      }),
    )
  } catch {
    return hidden
  }
}

export default async function HolidayRemembrancePage({ params }: { params: { id: string } }) {
  const content = await loadHolidayRemembrance(params.id)
  if (!content) notFound()
  return (
    <HolidayRemembranceView
      content={content}
      gallery={<MemorialPhotoGallery photos={content.photos} emptyMessage={HOLIDAY_COPY.emptyPhotos} />}
    />
  )
}
