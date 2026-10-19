import { head } from "@vercel/blob"
import { NextResponse, type NextRequest } from "next/server"
import { clientIp, rateLimit } from "@/lib/media/rate-limit"
import {
  ALLOWED_CONTENT_TYPES,
  MEDIA_LIMITS,
  audioNeedsConversion,
  mediaFolder,
  videoMayNeedConversion,
  type AudioKind,
  type MediaType,
} from "@/lib/media/shared"
import {
  currentUploader,
  insertMediaRow,
  isMemorialBlobUrl,
  moderationStatusFor,
  pendingCapReached,
  resolveMemorial,
  URL_COLUMN,
} from "@/lib/media/server"
import { createProcessToken } from "@/lib/media/creator-token"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export const runtime = "nodejs"

type Body = {
  memorialId?: string
  mediaType?: MediaType
  kind?: AudioKind
  url?: string
  title?: string
  artist?: string
  caption?: string
  uploadedBy?: string
  creatorToken?: string
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max) : ""
}

/**
 * Saves the database row for a file the browser already uploaded to Blob.
 * Checks the blob really is in this memorial's folder and within the size limit,
 * and marks visitor uploads "pending" until the memorial owner approves them.
 */
export async function POST(request: NextRequest) {
  const limited = rateLimit(`register:${clientIp(request.headers)}`, 40, 10 * 60 * 1000)
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many uploads. Please wait a few minutes." }, { status: 429 })
  }

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const mediaType = body.mediaType
  if (!mediaType || !["photo", "video", "audio", "profile"].includes(mediaType)) {
    return NextResponse.json({ error: "Unknown media type" }, { status: 400 })
  }
  const kind: AudioKind = body.kind === "voicemail" ? "voicemail" : "song"

  try {
    const memorial = await resolveMemorial(clean(body.memorialId, 100))
    if (!memorial) return NextResponse.json({ error: "Memorial not found" }, { status: 404 })

    const url = clean(body.url, 2000)
    if (!isMemorialBlobUrl(url, memorial.id) || !new URL(url).pathname.startsWith(`/memorials/${memorial.id}/${mediaFolder(mediaType, kind)}/`)) {
      return NextResponse.json({ error: "Upload location not recognised" }, { status: 400 })
    }

    const blob = await head(url).catch(() => null)
    if (!blob) return NextResponse.json({ error: "Upload not found. Please try again." }, { status: 400 })
    if (blob.size > MEDIA_LIMITS[mediaType]) return NextResponse.json({ error: "File is too large" }, { status: 413 })
    const contentType = (blob.contentType || "").toLowerCase()
    if (!ALLOWED_CONTENT_TYPES[mediaType].includes(contentType)) {
      return NextResponse.json({ error: "File type not supported" }, { status: 415 })
    }

    const uploader = await currentUploader(memorial, body.creatorToken)
    const status = moderationStatusFor(uploader)
    const uploadedBy = clean(body.uploadedBy, 80)

    if (mediaType === "profile") {
      if (!uploader.canPublish) return NextResponse.json({ error: "Not allowed" }, { status: 403 })
      const db = createServiceRoleClient()
      const { error } = await db.from("memorials").update({ profile_image_url: blob.url }).eq("id", memorial.id)
      if (error) throw new Error(error.message)
      return NextResponse.json({ success: true, url: blob.url, status: "approved" })
    }

    if (!uploader.canPublish && !uploadedBy) {
      return NextResponse.json({ error: "Please enter your name" }, { status: 400 })
    }
    if (!uploader.canPublish && (await pendingCapReached(memorial.id))) {
      return NextResponse.json(
        { error: "This memorial has a lot of uploads waiting for the family's approval. Please try again tomorrow." },
        { status: 429 },
      )
    }

    // Each uploaded file can be registered once.
    const table = mediaType === "photo" ? "photos" : mediaType === "video" ? "videos" : "music"
    const existing = await createServiceRoleClient()
      .from(table)
      .select("id", { count: "exact", head: true })
      .eq(URL_COLUMN[table], blob.url)
    if (!existing.error && (existing.count ?? 0) > 0) {
      return NextResponse.json({ error: "This upload was already saved" }, { status: 409 })
    }

    const common = {
      memorial_id: memorial.id,
      user_id: uploader.userId,
      status,
      content_type: contentType,
      size_bytes: blob.size,
    }

    let result: { row: Record<string, any>; moderated: boolean }
    let needsProcessing = false

    if (mediaType === "photo") {
      result = await insertMediaRow("photos", {
        ...common,
        image_url: blob.url,
        caption: clean(body.caption, 500) || null,
        uploaded_by: uploadedBy || "Family",
      })
    } else if (mediaType === "video") {
      const title = clean(body.title, 200) || "Video memory"
      result = await insertMediaRow("videos", {
        ...common,
        video_url: blob.url,
        title,
        uploaded_by: uploadedBy || "Family",
      })
      needsProcessing = videoMayNeedConversion(blob.pathname)
    } else {
      const title = clean(body.title, 200) || (kind === "voicemail" ? "Voicemail" : "Song")
      result = await insertMediaRow("music", {
        ...common,
        title,
        artist: clean(body.artist, 200) || null,
        audio_url: blob.url,
        kind,
        is_youtube: false,
        uploaded_by: uploadedBy || null,
      })
      needsProcessing = audioNeedsConversion(blob.pathname, contentType)
    }

    // Older databases ignore the status column: tell the browser the item is already visible.
    const finalStatus = result.moderated ? status : "approved"

    return NextResponse.json({
      success: true,
      id: result.row.id,
      table,
      status: finalStatus,
      needsProcessing,
      processToken: needsProcessing ? createProcessToken(table, String(result.row.id)) : null,
      url: blob.url,
    })
  } catch (error) {
    console.error("[media/register]", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Could not save the upload. Please try again." }, { status: 500 })
  }
}
