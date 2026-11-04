import { DIGITAL_MEMORIAL_PATH } from "@/lib/digital-memorial"
import {
  EXAMPLE_BIOGRAPHY,
  EXAMPLE_MEMORIAL_NAME,
  EXAMPLE_MEMORIAL_NOTICE,
  EXAMPLE_MEMORIAL_PATH,
  EXAMPLE_MESSAGE,
  EXAMPLE_PHOTO_LABEL,
  EXAMPLE_STORY,
} from "@/lib/example-memorial"
import { safeMediaUrl } from "@/lib/media/shared"
import { dedupePhotos, type GalleryPhoto } from "@/lib/memorial-photos"
import {
  EXAMPLE_HOLIDAY_PATH,
  holidayRemembrancePath,
} from "@/lib/memorial-urls"
import { HOLIDAY_SHARE_COPY } from "@/lib/holiday-share-copy"
import { assertMetadataLength } from "@/lib/seo"

const BRAND_SUFFIX = " | MemorialsQR"
const TITLE_MAX = 60
const DESCRIPTION_MAX = 155

export const CREATE_PAGE_PATH = DIGITAL_MEMORIAL_PATH
export const HELP_PATH = "/help"
export const PRIVACY_PATH = "/privacy-policy"

export const MEMORY_CARD_LIMIT = 12
export const SAMPLE_GALLERY_COUNT = 4

export const CHRISTMAS_IN_HEAVEN_LABEL = "Christmas in Heaven"
export const ORNAMENT_NOTE = "This page is linked from a Christmas in Heaven ornament."
export const SAMPLE_ORNAMENT_NOTE = "This example shows the page a Christmas in Heaven ornament can open."
export const SAMPLE_DATES_NOTE = "Dates you choose appear here. These are not a real lifespan."

/** Visible sentences. Kept together so tests can check they stay factual. */
export const HOLIDAY_COPY = {
  menu: "Menu",
  fullMemorial: "Full memorial page",
  help: "Help",
  home: "MemorialsQR home",
  memoriesHeading: "Holiday memories",
  galleryHeading: "Photo gallery",
  openFullPage: "Open the full memorial page",
  shareLabel: HOLIDAY_SHARE_COPY.shareLabel,
  emptyMemories: "Memories shared by family and friends appear here.",
  emptyPhotos: "Photos added by the family appear here.",
  sampleShareNote: "A family's page saves a memory from this button. This example is for looking only.",
  ownerRemovalNote: HOLIDAY_SHARE_COPY.ownerRemovalNote,
  savedMemory: HOLIDAY_SHARE_COPY.savedMemory,
  saveFailed: HOLIDAY_SHARE_COPY.saveFailed,
  createPage: "Create a remembrance page",
  privacy: "Privacy",
  unavailableTitle: "This remembrance page is not available",
  unavailableBody: "Help can look up this link with you.",
  photoPlaceholder: EXAMPLE_PHOTO_LABEL,
  yourName: HOLIDAY_SHARE_COPY.yourName,
  yourMemory: HOLIDAY_SHARE_COPY.yourMemory,
} as const

export type HolidayMemory = {
  id: string
  title: string | null
  body: string
  author: string | null
  createdAt: string | null
}

export type HolidayStoryRow = {
  id?: string | null
  title?: string | null
  content?: string | null
  author_name?: string | null
  created_at?: string | null
}

export type HolidayMessageRow = {
  id?: string | null
  content?: string | null
  author_name?: string | null
  created_at?: string | null
}

export type HolidayPhotoRow = {
  id?: string | null
  image_url?: string | null
  photo_url?: string | null
  caption?: string | null
}

export type HolidayMemorialRow = {
  id?: string | null
  slug?: string | null
  full_name?: string | null
  biography?: string | null
  birth_date?: string | null
  death_date?: string | null
  profile_image_url?: string | null
}

export type HolidayRemembrance = {
  sample: boolean
  memorialId: string | null
  fullName: string
  heading: string
  years: string | null
  datesNote: string | null
  familyNote: string | null
  heroImageUrl: string | null
  memories: HolidayMemory[]
  photos: GalleryPhoto[]
  pagePath: string
  fullMemorialPath: string
  shareEnabled: boolean
  ornamentNote: string
  sampleNotice: string | null
}

export function remembranceGivenName(fullName: string): string {
  const cleaned = fullName.replace(/\s+/g, " ").trim()
  if (!cleaned || /^in loving memory$/i.test(cleaned)) return ""
  const first = cleaned.split(" ")[0] ?? ""
  if (!/\p{L}/u.test(first)) return ""
  return first
}

export function remembranceHeading(fullName: string): string {
  const given = remembranceGivenName(fullName)
  if (!given) return "Remembering them this Christmas"
  return `Remembering ${given} this Christmas`
}

export function remembranceYears(
  birthDate: string | null | undefined,
  deathDate: string | null | undefined,
): string | null {
  const birth = yearFromDate(birthDate)
  const death = yearFromDate(deathDate)
  if (birth && death) return `${birth} – ${death}`
  return birth ?? death
}

function yearFromDate(value: string | null | undefined): string | null {
  if (!value) return null
  const match = value.match(/\b(\d{4})\b/)
  if (!match) return null
  const year = Number(match[1])
  if (year < 1000 || year > 2100) return null
  return match[1]
}

function blankToNull(value: string | null | undefined): string | null {
  if (!value) return null
  const cleaned = value.trim()
  return cleaned ? cleaned : null
}

/** Skip stock placeholders so the hero does not pretend a person is pictured. */
export function usableMemorialImage(value: unknown): string | null {
  const url = safeMediaUrl(value)
  if (!url || url.includes("placeholder")) return null
  return url
}

function memoryFromParts(
  id: string,
  title: string | null | undefined,
  body: string | null | undefined,
  author: string | null | undefined,
  createdAt: string | null | undefined,
): HolidayMemory | null {
  const text = blankToNull(body)
  if (!text) return null
  return {
    id,
    title: blankToNull(title),
    body: text,
    author: blankToNull(author),
    createdAt: blankToNull(createdAt),
  }
}

function memoryTime(value: string | null): number {
  if (!value) return 0
  const time = Date.parse(value)
  return Number.isNaN(time) ? 0 : time
}

/** Stories and messages on one row, newest first. Empty bodies are left out. */
export function holidayMemories(stories: HolidayStoryRow[], messages: HolidayMessageRow[]): HolidayMemory[] {
  const cards: HolidayMemory[] = []
  stories.forEach((story, index) => {
    const card = memoryFromParts(
      `story:${story.id || index}`,
      story.title,
      story.content,
      story.author_name,
      story.created_at,
    )
    if (card) cards.push(card)
  })
  messages.forEach((message, index) => {
    const card = memoryFromParts(
      `message:${message.id || index}`,
      null,
      message.content,
      message.author_name,
      message.created_at,
    )
    if (card) cards.push(card)
  })
  return cards.sort((a, b) => memoryTime(b.createdAt) - memoryTime(a.createdAt)).slice(0, MEMORY_CARD_LIMIT)
}

function holidayPhotos(rows: HolidayPhotoRow[]): GalleryPhoto[] {
  const mapped: GalleryPhoto[] = []
  rows.forEach((row, index) => {
    const src = usableMemorialImage(row.image_url) ?? usableMemorialImage(row.photo_url)
    if (!src) return
    mapped.push({
      id: row.id || `photo-${index}`,
      src,
      caption: blankToNull(row.caption),
    })
  })
  return dedupePhotos(mapped)
}

export function buildHolidayRemembrance(
  row: HolidayMemorialRow,
  stories: HolidayStoryRow[],
  messages: HolidayMessageRow[],
  photos: HolidayPhotoRow[],
): HolidayRemembrance | null {
  const id = blankToNull(row.id)
  const slug = blankToNull(row.slug)
  const key = (slug && holidayRemembrancePath(slug) ? slug : null) ?? (id && holidayRemembrancePath(id) ? id : null)
  if (!key) return null
  const pagePath = holidayRemembrancePath(key)
  if (!pagePath) return null
  const fullMemorialPath = `/memorial/${key}`
  const fullName = blankToNull(row.full_name) ?? "In Loving Memory"
  const gallery = holidayPhotos(photos)
  return {
    sample: false,
    memorialId: id,
    fullName,
    heading: remembranceHeading(fullName),
    years: remembranceYears(row.birth_date, row.death_date),
    datesNote: null,
    familyNote: blankToNull(row.biography),
    heroImageUrl: usableMemorialImage(row.profile_image_url) ?? gallery[0]?.src ?? null,
    memories: holidayMemories(stories, messages),
    photos: gallery,
    pagePath,
    fullMemorialPath,
    shareEnabled: Boolean(id),
    ornamentNote: ORNAMENT_NOTE,
    sampleNotice: null,
  }
}

export function exampleHolidayRemembrance(): HolidayRemembrance {
  return {
    sample: true,
    memorialId: null,
    fullName: EXAMPLE_MEMORIAL_NAME,
    heading: remembranceHeading(EXAMPLE_MEMORIAL_NAME),
    years: null,
    datesNote: SAMPLE_DATES_NOTE,
    familyNote: EXAMPLE_BIOGRAPHY,
    heroImageUrl: null,
    memories: [
      {
        id: "example-story",
        title: EXAMPLE_STORY.title,
        body: EXAMPLE_STORY.body,
        author: null,
        createdAt: null,
      },
      {
        id: "example-message",
        title: null,
        body: EXAMPLE_MESSAGE.body,
        author: EXAMPLE_MESSAGE.author,
        createdAt: null,
      },
    ],
    photos: [],
    pagePath: EXAMPLE_HOLIDAY_PATH,
    fullMemorialPath: EXAMPLE_MEMORIAL_PATH,
    shareEnabled: false,
    ornamentNote: SAMPLE_ORNAMENT_NOTE,
    sampleNotice: EXAMPLE_MEMORIAL_NOTICE,
  }
}

export function holidayDocumentTitle(fullName: string, sample: boolean): string {
  const prefix = sample ? "Example: " : ""
  const heading = remembranceHeading(fullName)
  const combined = `${prefix}${heading}${BRAND_SUFFIX}`
  if (combined.length <= TITLE_MAX) return combined
  const room = TITLE_MAX - BRAND_SUFFIX.length - prefix.length
  const shortened = room <= 1 ? "…" : `${heading.slice(0, Math.max(0, room - 1)).trimEnd()}…`
  const title = `${prefix}${shortened}${BRAND_SUFFIX}`
  return title.length <= TITLE_MAX ? title : title.slice(0, TITLE_MAX)
}

export function holidayDocumentDescription(fullName: string, sample: boolean): string {
  if (sample) {
    return `Example Christmas remembrance page. ${EXAMPLE_MEMORIAL_NAME} is not a real person.`
  }
  const name = fullName.replace(/\s+/g, " ").trim() || "a loved one"
  const text = `A Christmas remembrance page for ${name}, with photos and memories shared by the family.`
  if (text.length <= DESCRIPTION_MAX) return text
  return `${text.slice(0, DESCRIPTION_MAX - 1).trimEnd()}…`
}

export function holidayMetadataInput(args: { path: string; fullName: string; sample: boolean }) {
  const title = holidayDocumentTitle(args.fullName, args.sample)
  const description = holidayDocumentDescription(args.fullName, args.sample)
  assertMetadataLength(title, description, args.path)
  return {
    title,
    description,
    path: args.path,
    index: false as const,
  }
}
