export type GalleryPhoto = {
  id: string
  src: string
  caption?: string | null
  uploadedBy?: string | null
}

/** Soft, non-person default background used when a memorial has no photo yet. */
export const MEMORIAL_DEFAULT_BACKGROUND = "/memorial-defaults/soft-floral-sky.svg"

/** One or two initials for the monogram fallback ("Janice & Earl Melton" -> "JM"). */
export function memorialInitials(name: string | null | undefined): string {
  const words = (name ?? "")
    .replace(/\(.*?\)/g, " ")
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}]/gu, ""))
    .filter(Boolean)
  if (words.length === 0) return ""
  const first = words[0][0]
  const last = words.length > 1 ? words[words.length - 1][0] : ""
  return `${first}${last}`.toUpperCase()
}

/** Drop repeated image URLs (the same photo is sometimes saved more than once). */
export function dedupePhotos<T extends { src: string }>(photos: T[]): T[] {
  const seen = new Set<string>()
  return photos.filter((photo) => {
    const key = photo.src.trim()
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}
