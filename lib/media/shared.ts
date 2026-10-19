/**
 * Media rules shared by the browser and the server: size limits, accepted
 * formats, and which formats need converting before every browser can play them.
 * Pure (no Node or DOM APIs) so it can be unit tested and imported anywhere.
 */
import { extractYouTubeId } from "@/lib/youtube"

export type MediaType = "photo" | "video" | "audio" | "profile"
export type AudioKind = "song" | "voicemail"
/** Value of the `kind` column on `music` (YouTube links can be a song or a video). */
export type MusicKind = AudioKind | "video"
export type ModerationStatus = "pending" | "approved" | "rejected"

const MB = 1024 * 1024

export const MEDIA_LIMITS: Record<MediaType, number> = {
  photo: 15 * MB,
  profile: 15 * MB,
  video: 100 * MB,
  audio: 20 * MB,
}

export function formatLimit(type: MediaType): string {
  return `${Math.round(MEDIA_LIMITS[type] / MB)}MB`
}

/** Extension -> content type, used when the browser reports an empty type (common for .amr/.3gp/.mov on Android/Windows). */
const EXTENSION_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
  avif: "image/avif",
  mp4: "video/mp4",
  m4v: "video/x-m4v",
  mov: "video/quicktime",
  qt: "video/quicktime",
  webm: "video/webm",
  "3gp": "video/3gpp",
  "3gpp": "video/3gpp",
  "3g2": "video/3gpp2",
  avi: "video/x-msvideo",
  mkv: "video/x-matroska",
  wmv: "video/x-ms-wmv",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  aac: "audio/aac",
  wav: "audio/wav",
  ogg: "audio/ogg",
  oga: "audio/ogg",
  opus: "audio/ogg",
  amr: "audio/amr",
  awb: "audio/amr-wb",
  caf: "audio/x-caf",
  aif: "audio/aiff",
  aiff: "audio/aiff",
  flac: "audio/flac",
  wma: "audio/x-ms-wma",
}

export const ACCEPT_ATTR: Record<MediaType, string> = {
  photo: "image/*",
  profile: "image/*",
  video: "video/*,.mov,.mp4,.m4v,.3gp,.3gpp,.webm,.avi,.mkv",
  audio: "audio/*,.mp3,.m4a,.aac,.wav,.amr,.awb,.3gp,.3gpp,.3g2,.ogg,.opus,.caf,.aif,.aiff,.flac,.webm",
}

export const ACCEPT_LABEL: Record<MediaType, string> = {
  photo: "JPG, PNG, WebP or GIF",
  profile: "JPG, PNG, WebP or GIF",
  video: "MP4, MOV (iPhone, incl. HEVC), 3GP (Android), WebM, AVI or MKV",
  audio: "MP3, M4A, AAC, WAV, Android voicemail (AMR/3GP), iPhone voice memo (M4A/CAF), OGG or WebM",
}

/** Content types the server will issue an upload token for. */
export const ALLOWED_CONTENT_TYPES: Record<MediaType, string[]> = {
  photo: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/heic", "image/heif", "image/avif"],
  profile: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/heic", "image/heif", "image/avif"],
  video: [
    "video/mp4",
    "video/x-m4v",
    "video/quicktime",
    "video/webm",
    "video/3gpp",
    "video/3gpp2",
    "video/x-msvideo",
    "video/x-matroska",
    "video/x-ms-wmv",
  ],
  audio: [
    "audio/mpeg",
    "audio/mp3",
    "audio/mp4",
    "audio/m4a",
    "audio/x-m4a",
    "audio/aac",
    "audio/x-aac",
    "audio/wav",
    "audio/x-wav",
    "audio/wave",
    "audio/ogg",
    "audio/opus",
    "audio/webm",
    "audio/amr",
    "audio/amr-wb",
    "audio/3gpp",
    "audio/3gpp2",
    "video/3gpp",
    "video/3gpp2",
    "audio/x-caf",
    "audio/aiff",
    "audio/x-aiff",
    "audio/flac",
    "audio/x-flac",
    "audio/x-ms-wma",
    "video/webm",
  ],
}

export function fileExtension(name: string | null | undefined): string {
  const match = (name ?? "").toLowerCase().match(/\.([a-z0-9]+)$/)
  return match ? match[1] : ""
}

/** Best content type for a file: the browser's, else one guessed from the extension. */
export function contentTypeFor(file: { name: string; type?: string | null }, mediaType: MediaType): string {
  const fromBrowser = (file.type ?? "").toLowerCase()
  const ext = fileExtension(file.name)
  const fromExt = EXTENSION_TYPES[ext]
  // Some Android browsers report .amr/.3gp voicemails as video/3gpp; keep that.
  if (fromBrowser && ALLOWED_CONTENT_TYPES[mediaType].includes(fromBrowser)) return fromBrowser
  if (fromExt && ALLOWED_CONTENT_TYPES[mediaType].includes(fromExt)) return fromExt
  // An audio upload of a .3gp file should still count as audio.
  if (mediaType === "audio" && (ext === "3gp" || ext === "3gpp")) return "audio/3gpp"
  return fromBrowser || fromExt || "application/octet-stream"
}

export type MediaCheck = { ok: true; contentType: string } | { ok: false; error: string }

export function checkMediaFile(file: { name: string; type?: string | null; size: number }, mediaType: MediaType): MediaCheck {
  if (!file.size) return { ok: false, error: "That file is empty." }
  if (file.size > MEDIA_LIMITS[mediaType]) {
    const noun = mediaType === "audio" ? "Audio files" : mediaType === "video" ? "Videos" : "Photos"
    return { ok: false, error: `${noun} must be ${formatLimit(mediaType)} or smaller.` }
  }
  const contentType = contentTypeFor(file, mediaType)
  if (!ALLOWED_CONTENT_TYPES[mediaType].includes(contentType)) {
    return { ok: false, error: `That file type is not supported. Please use ${ACCEPT_LABEL[mediaType]}.` }
  }
  return { ok: true, contentType }
}

/** HEIC photos only display in Safari, so they are flagged before upload. */
export function isHeic(file: { name: string; type?: string | null }): boolean {
  const ext = fileExtension(file.name)
  return ext === "heic" || ext === "heif" || /image\/hei[cf]/i.test(file.type ?? "")
}

const BROWSER_SAFE_AUDIO = new Set(["mp3", "m4a", "aac", "wav", "mp4"])
const BROWSER_SAFE_VIDEO = new Set(["mp4", "m4v", "webm"])

/**
 * Audio that does not play in every browser and should be converted to M4A (AAC):
 * Android voicemails (AMR/3GP), Apple CAF, AIFF, WMA, FLAC, and OGG/Opus/WebM (no older Safari).
 */
export function audioNeedsConversion(nameOrUrl: string, contentType?: string | null): boolean {
  const ext = fileExtension(stripQuery(nameOrUrl))
  if (ext && BROWSER_SAFE_AUDIO.has(ext)) return false
  if (ext) return true
  const type = (contentType ?? "").toLowerCase()
  return !["audio/mpeg", "audio/mp3", "audio/mp4", "audio/m4a", "audio/x-m4a", "audio/aac", "audio/wav"].includes(type)
}

/**
 * Videos that may not play everywhere. MOV (iPhone) and 3GP (Android) always go
 * through the converter; MP4 is probed too, since some phones record HEVC into .mp4.
 */
export function videoMayNeedConversion(nameOrUrl: string): boolean {
  return fileExtension(stripQuery(nameOrUrl)) !== "webm"
}

export function isBrowserSafeVideoName(nameOrUrl: string): boolean {
  return BROWSER_SAFE_VIDEO.has(fileExtension(stripQuery(nameOrUrl)))
}

function stripQuery(value: string): string {
  return value.split(/[?#]/)[0]
}

/** Blob folder for each kind of upload. The folder also records the audio kind for older databases. */
export function mediaFolder(mediaType: MediaType, kind?: AudioKind | null): string {
  if (mediaType === "photo") return "photos"
  if (mediaType === "profile") return "profile"
  if (mediaType === "video") return "videos"
  return kind === "voicemail" ? "voicemails" : "music"
}

export function safeFileName(name: string): string {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/\.{2,}/g, ".")
    .slice(-80)
    .replace(/^[_.]+/, "")
  return cleaned || "upload"
}

export type MusicLike = {
  title?: string | null
  audio_url?: string | null
  kind?: string | null
  is_youtube?: boolean | null
  youtube_id?: string | null
}

/** YouTube ID for a music row, from the youtube_id column or from the saved link. */
export function musicYouTubeId(row: MusicLike): string | null {
  if (row.youtube_id && /^[A-Za-z0-9_-]{11}$/.test(row.youtube_id)) return row.youtube_id
  return extractYouTubeId(row.audio_url ?? "")
}

/**
 * Kind for a music row. Uses the `kind` column when present; otherwise infers it
 * (voicemail folder or AMR/3GP file or "voicemail" in the title -> voicemail, else song).
 */
export function musicKind(row: MusicLike): MusicKind {
  if (row.kind === "song" || row.kind === "voicemail" || row.kind === "video") return row.kind
  if (musicYouTubeId(row)) return "song"
  const url = (row.audio_url ?? "").toLowerCase()
  if (url.includes("/voicemails/")) return "voicemail"
  const ext = fileExtension(stripQuery(url))
  if (["amr", "awb", "3gp", "3gpp", "3g2"].includes(ext)) return "voicemail"
  if (/voice\s?-?mail|voice memo|voice message/i.test(row.title ?? "")) return "voicemail"
  return "song"
}

/** Rows without a status (database not migrated yet) count as approved. */
export function isApproved(row: { status?: string | null }): boolean {
  return !row.status || row.status === "approved"
}

export function isUuid(value: string | null | undefined): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value ?? "")
}

/**
 * Only https URLs and site-relative paths (/photo.jpg) are ever rendered as media
 * sources or links (blocks javascript:, data:, protocol-relative //host, etc.).
 */
export function safeMediaUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null
  if (/^\/(?![\/\\])/.test(value)) return value
  try {
    const url = new URL(value)
    return url.protocol === "https:" ? url.toString() : null
  } catch {
    return null
  }
}
