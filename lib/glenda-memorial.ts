import type { GalleryPhoto } from "@/lib/memorial-photos"

export const GLENDA_MEMORIAL_ID = "7e8ba3b6-1b26-4a25-af05-0833d89154e5"

/** Clean crop of Glenda's portrait from her memorial card (no text, no QR code). */
export const GLENDA_PORTRAIT = "/memorials/glenda-kelso/glenda-portrait.webp"

/** Her full memorial card (portrait, white flowers, QR code). */
export const GLENDA_MEMORIAL_CARD = "/memorials/glenda-kelso/glenda-memorial-card.webp"

/** Older path still saved as her profile photo in the database; now serves the same clean portrait. */
export const GLENDA_LEGACY_PORTRAIT = "/glenda-memorial-portrait.jpeg"

/**
 * Family photos of Glenda. These always render, even if the database is
 * unreachable; photos added later through the memorial page are merged in.
 */
export const GLENDA_PHOTOS: GalleryPhoto[] = [
  { id: "glenda-card", src: GLENDA_MEMORIAL_CARD, caption: "In loving memory: Glenda's memorial card" },
  { id: "glenda-christmas-daughter", src: "/glenda-christmas-daughter.jpeg", caption: "Christmas morning with her daughter" },
  { id: "glenda-garden-couple", src: "/glenda-garden-couple.jpeg", caption: "With her beloved husband" },
  { id: "glenda-restaurant-couple", src: "/glenda-restaurant-couple.jpeg", caption: "Anniversary dinner" },
  { id: "glenda-beach-walk", src: "/glenda-beach-walk.jpeg", caption: "Beach walk with family" },
  { id: "glenda-family-baseball", src: "/glenda-family-baseball.jpeg", caption: "Family baseball game" },
  {
    id: "glenda-remi",
    src: "https://snsqshzbd56zqypk.public.blob.vercel-storage.com/memorials/glenda-kelso/1759938363707-IMG_1941.jpeg",
    caption: "Remi and Maw Maw",
  },
  {
    id: "glenda-lynn",
    src: "https://snsqshzbd56zqypk.public.blob.vercel-storage.com/memorials/glenda-kelso/1760657124320-IMG_2169.jpeg",
    caption: "Lynn holding Glenda's hand",
  },
  { id: "glenda-hospital-visit", src: "/glenda-hospital-visit.jpeg", caption: "Family by her side" },
  { id: "glenda-hospital-bedside", src: "/glenda-hospital-bedside.jpeg", caption: "Holding her hand" },
  {
    id: "glenda-flowers",
    src: "https://snsqshzbd56zqypk.public.blob.vercel-storage.com/memorials/glenda-kelso/1760050391289-IMG_5811.jpeg",
    caption: "Flowers for Glenda",
  },
]
