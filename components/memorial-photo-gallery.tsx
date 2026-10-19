"use client"

import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { dedupePhotos, type GalleryPhoto } from "@/lib/memorial-photos"

type Props = {
  photos: GalleryPhoto[]
  /** How many tiles to show before "Show all". Keeps long galleries light. */
  initialCount?: number
  /** Called when an image fails to load, so the page can flag it. */
  onImageError?: (photo: GalleryPhoto) => void
  emptyMessage?: string
}

/**
 * Responsive memorial photo grid that stays fast with dozens of photos:
 * duplicate URLs are dropped, tiles are square and lazy-loaded, extra photos
 * are revealed in batches, and a lightbox shows the full image with prev/next.
 */
export function MemorialPhotoGallery({
  photos,
  initialCount = 12,
  onImageError,
  emptyMessage = "No photos yet. Be the first to share a memory!",
}: Props) {
  const [broken, setBroken] = useState<Set<string>>(new Set())
  const [visibleCount, setVisibleCount] = useState(initialCount)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const items = useMemo(
    () => dedupePhotos(photos).filter((photo) => !photo.src.startsWith("blob:") && !broken.has(photo.id)),
    [photos, broken],
  )
  const visible = items.slice(0, visibleCount)
  const remaining = items.length - visible.length
  const current = openIndex !== null ? items[openIndex] : undefined

  const markBroken = (photo: GalleryPhoto) => {
    setBroken((prev) => new Set(prev).add(photo.id))
    onImageError?.(photo)
  }

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((index) => (index === null || items.length === 0 ? index : (index + delta + items.length) % items.length))
    },
    [items.length],
  )

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1)
      if (event.key === "ArrowLeft") step(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [openIndex, step])

  if (items.length === 0) {
    return <p className="py-8 text-center text-slate-500">{emptyMessage}</p>
  }

  return (
    <div>
      <p className="mb-3 text-sm text-slate-500">
        {items.length} photo{items.length === 1 ? "" : "s"}
      </p>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4" data-testid="memorial-photo-gallery">
        {visible.map((photo, index) => (
          <li key={photo.id}>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group relative block aspect-square w-full overflow-hidden rounded-lg bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              aria-label={`Open photo ${index + 1} of ${items.length}${photo.caption ? `: ${photo.caption}` : ""}`}
            >
              <Image
                src={photo.src}
                alt={photo.caption || "Memorial photo"}
                fill
                sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 48vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                loading={index < 4 ? "eager" : "lazy"}
                onError={() => markBroken(photo)}
              />
              {photo.caption ? (
                <span className="absolute inset-x-0 bottom-0 line-clamp-2 bg-gradient-to-t from-black/70 to-transparent px-2 pb-1.5 pt-6 text-left text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {photo.caption}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      {remaining > 0 ? (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button variant="outline" onClick={() => setVisibleCount((count) => count + initialCount)}>
            Show {Math.min(remaining, initialCount)} more
          </Button>
          {remaining > initialCount ? (
            <Button variant="ghost" onClick={() => setVisibleCount(items.length)}>
              Show all {items.length}
            </Button>
          ) : null}
        </div>
      ) : null}

      <Dialog open={openIndex !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <DialogContent className="max-w-4xl gap-3 border-none bg-slate-950 p-3 text-white sm:p-4 [&>button:last-child]:text-white">
          <DialogTitle className="sr-only">
            Photo {openIndex !== null ? openIndex + 1 : ""} of {items.length}
          </DialogTitle>
          <DialogDescription className="sr-only">{current?.caption || "Memorial photo"}</DialogDescription>
          {current ? (
            <>
              <div className="relative h-[70vh] w-full">
                <Image
                  key={current.id}
                  src={current.src}
                  alt={current.caption || "Memorial photo"}
                  fill
                  sizes="(min-width: 1024px) 900px, 100vw"
                  className="object-contain"
                  onError={() => markBroken(current)}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Button variant="secondary" size="icon" onClick={() => step(-1)} aria-label="Previous photo">
                  <ChevronLeft className="size-5" />
                </Button>
                <div className="min-w-0 flex-1 text-center text-sm">
                  {current.caption ? <p className="truncate">{current.caption}</p> : null}
                  {current.uploadedBy ? <p className="text-xs text-slate-400">Added by {current.uploadedBy}</p> : null}
                  <p className="text-xs text-slate-400">
                    {(openIndex ?? 0) + 1} / {items.length}
                  </p>
                </div>
                <Button variant="secondary" size="icon" onClick={() => step(1)} aria-label="Next photo">
                  <ChevronRight className="size-5" />
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
