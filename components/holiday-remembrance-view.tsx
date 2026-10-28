import type { ReactNode } from "react"
import Link from "next/link"
import { HolidayShareMemory } from "@/components/holiday-share-memory"
import { MemorialPhotoFallback } from "@/components/memorial-photo-fallback"
import {
  CHRISTMAS_IN_HEAVEN_LABEL,
  CREATE_PAGE_PATH,
  HELP_PATH,
  HOLIDAY_COPY,
  PRIVACY_PATH,
  SAMPLE_GALLERY_COUNT,
  type HolidayRemembrance,
} from "@/lib/holiday-remembrance"

type Props = {
  content: HolidayRemembrance
  /** Approved-photo gallery for a real memorial. The sample page uses placeholders instead. */
  gallery?: ReactNode
}

export function HolidayRemembranceView({ content, gallery }: Props) {
  return (
    <div className="min-h-screen bg-[#efe8dc] text-[#3d2c29]" data-testid="holiday-remembrance">
      <div className="mx-auto min-h-screen max-w-md bg-[#fbf7f2] shadow-sm">
        <header className="flex items-center justify-between gap-3 bg-[#5c5148] px-4 py-2 text-xs text-[#f6f0e6]">
          <p className="min-w-0 truncate">
            memorialsqr.com{content.pagePath}
            {content.sample ? " (Sample page)" : ""}
          </p>
          <details className="relative shrink-0">
            <summary className="cursor-pointer list-none rounded px-1 py-0.5 [&::-webkit-details-marker]:hidden">
              {HOLIDAY_COPY.menu}
            </summary>
            <nav className="absolute right-0 z-20 mt-2 w-52 rounded-md border border-[#e4d3b8] bg-white p-1 text-sm text-[#3d2c29] shadow-md">
              <Link className="block rounded px-3 py-2 hover:bg-[#f6f0e6]" href={content.fullMemorialPath}>
                {HOLIDAY_COPY.fullMemorial}
              </Link>
              <Link className="block rounded px-3 py-2 hover:bg-[#f6f0e6]" href={HELP_PATH}>
                {HOLIDAY_COPY.help}
              </Link>
              <Link className="block rounded px-3 py-2 hover:bg-[#f6f0e6]" href="/">
                {HOLIDAY_COPY.home}
              </Link>
            </nav>
          </details>
        </header>

        <main className="px-4 pb-10 pt-4">
          {content.sampleNotice ? (
            <p className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-950">
              {content.sampleNotice}
            </p>
          ) : null}

          <div className="overflow-hidden rounded-md border border-[#e4d3b8] bg-[#f3ecdf]">
            {content.heroImageUrl ? (
              // Family photos can live on hosts outside next/image remotePatterns.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={content.heroImageUrl}
                alt={`Photo of ${content.fullName}`}
                width={800}
                height={448}
                className="h-56 w-full object-cover"
              />
            ) : (
              <MemorialPhotoFallback name={content.fullName} variant="cover" className="h-56 w-full" />
            )}
          </div>

          <p className="mt-6 text-center font-script text-4xl leading-none text-[#7a2434]">{CHRISTMAS_IN_HEAVEN_LABEL}</p>
          <h1 className="mt-2 text-balance text-center font-serif text-3xl leading-tight" data-testid="holiday-heading">
            {content.heading}
          </h1>
          {content.years ? <p className="mt-2 text-center tracking-wide text-stone-600">{content.years}</p> : null}
          {content.datesNote ? <p className="mt-2 text-center text-sm text-stone-600">{content.datesNote}</p> : null}

          {content.familyNote ? (
            <p className="mt-5 rounded-md border border-[#e4d3b8] bg-white px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
              {content.familyNote}
            </p>
          ) : null}

          <section className="mt-8" aria-labelledby="holiday-memories-heading">
            <h2 id="holiday-memories-heading" className="font-serif text-xl">
              {HOLIDAY_COPY.memoriesHeading}
            </h2>
            {content.memories.length > 0 ? (
              <ul className="mt-3 flex gap-3 overflow-x-auto pb-2" data-testid="holiday-memories">
                {content.memories.map((memory) => (
                  <li key={memory.id} className="w-44 shrink-0 snap-start">
                    <article className="h-full rounded-md border border-[#e4d3b8] bg-white p-3">
                      {memory.title ? <h3 className="text-sm font-semibold">{memory.title}</h3> : null}
                      <p className="mt-1 line-clamp-6 text-sm leading-relaxed text-stone-700">{memory.body}</p>
                      {memory.author ? <p className="mt-2 truncate text-xs text-stone-500">{memory.author}</p> : null}
                    </article>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-stone-600">{HOLIDAY_COPY.emptyMemories}</p>
            )}
          </section>

          <section className="mt-6" aria-label={HOLIDAY_COPY.shareLabel}>
            {content.shareEnabled && content.memorialId ? (
              <HolidayShareMemory memorialId={content.memorialId} />
            ) : (
              <div data-testid="holiday-share">
                <p className="rounded-md bg-[#e6dfd2] px-4 py-3 text-center text-sm font-medium">{HOLIDAY_COPY.shareLabel}</p>
                <p className="mt-2 text-center text-sm leading-relaxed text-stone-600">{HOLIDAY_COPY.sampleShareNote}</p>
                <p className="mt-1 text-center text-sm leading-relaxed text-stone-600">{HOLIDAY_COPY.ownerRemovalNote}</p>
              </div>
            )}
          </section>

          <section className="mt-8" aria-labelledby="holiday-gallery-heading">
            <h2 id="holiday-gallery-heading" className="font-serif text-xl">
              {HOLIDAY_COPY.galleryHeading}
            </h2>
            {content.sample ? (
              <ul className="mt-3 grid grid-cols-4 gap-2" data-testid="holiday-gallery">
                {Array.from({ length: SAMPLE_GALLERY_COUNT }, (_, index) => (
                  <li
                    key={`sample-photo-${index}`}
                    className="flex aspect-[3/4] items-center justify-center rounded-md border border-dashed border-[#ddc9a8] bg-[#f3ecdf] p-1.5 text-center text-[10px] leading-snug text-stone-500"
                  >
                    {HOLIDAY_COPY.photoPlaceholder}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3" data-testid="holiday-gallery">
                {gallery ?? <p className="text-sm text-stone-600">{HOLIDAY_COPY.emptyPhotos}</p>}
              </div>
            )}
          </section>

          <p
            className="mt-8 rounded-md border border-[#e4d3b8] bg-white px-4 py-3 text-center text-sm leading-relaxed"
            data-testid="holiday-ornament"
          >
            {content.ornamentNote}
          </p>

          <p className="mt-4 text-center text-sm">
            <Link href={content.fullMemorialPath} className="underline decoration-[#c4a574] underline-offset-4">
              {HOLIDAY_COPY.openFullPage}
            </Link>
          </p>
        </main>

        <footer className="bg-[#5c5148] px-4 py-4 text-center text-sm text-[#f6f0e6]">
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href={CREATE_PAGE_PATH} className="hover:text-white">
              {HOLIDAY_COPY.createPage}
            </Link>
            <Link href={HELP_PATH} className="hover:text-white">
              {HOLIDAY_COPY.help}
            </Link>
            <Link href={PRIVACY_PATH} className="hover:text-white">
              {HOLIDAY_COPY.privacy}
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  )
}
