import { put } from "@vercel/blob"
import { NextResponse, type NextRequest } from "next/server"
import { clientIp, rateLimit } from "@/lib/media/rate-limit"
import { checkMediaFile, mediaFolder, safeFileName, type AudioKind, type MediaType } from "@/lib/media/shared"
import { currentUploader, insertMediaRow, moderationStatusFor, pendingCapReached, resolveMemorial } from "@/lib/media/server"

/**
 * Older multipart upload endpoints (/api/photos/upload, /api/videos/upload, /api/music/upload).
 * They only work for files under Vercel's ~4.5MB request limit; the site now uploads
 * straight to Blob (see lib/media/client-upload.ts). Kept for compatibility, with the
 * same size/type checks, rate limit and approval rules as the new flow.
 */
export async function legacyMultipartUpload(request: NextRequest, mediaType: Exclude<MediaType, "profile">) {
  const limited = rateLimit(`legacy-upload:${clientIp(request.headers)}`, 30, 10 * 60 * 1000)
  if (!limited.ok) return NextResponse.json({ error: "Too many uploads. Please wait a few minutes." }, { status: 429 })

  try {
    const form = await request.formData()
    const file = form.get("file")
    if (!(file instanceof File)) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    const check = checkMediaFile(file, mediaType)
    if (!check.ok) return NextResponse.json({ error: check.error }, { status: 400 })

    const memorial = await resolveMemorial(String(form.get("memorialId") ?? ""))
    if (!memorial) return NextResponse.json({ error: "Memorial not found" }, { status: 404 })

    const uploader = await currentUploader(memorial, String(form.get("creatorToken") ?? ""))
    if (!uploader.canPublish && (await pendingCapReached(memorial.id))) {
      return NextResponse.json({ error: "Too many uploads are waiting for approval. Please try again tomorrow." }, { status: 429 })
    }
    const status = moderationStatusFor(uploader)
    const uploadedBy = String(form.get("uploadedBy") ?? form.get("uploaderName") ?? "").trim().slice(0, 80)
    const kind: AudioKind = form.get("kind") === "voicemail" ? "voicemail" : "song"

    const blob = await put(
      `memorials/${memorial.id}/${mediaFolder(mediaType, kind)}/${safeFileName(file.name)}`,
      file,
      { access: "public", addRandomSuffix: true, contentType: check.contentType },
    )

    const common = { memorial_id: memorial.id, user_id: uploader.userId, status, content_type: check.contentType, size_bytes: file.size }
    const title = String(form.get("title") ?? "").trim().slice(0, 200)

    const result =
      mediaType === "photo"
        ? await insertMediaRow("photos", {
            ...common,
            image_url: blob.url,
            caption: String(form.get("caption") ?? "").trim().slice(0, 500) || null,
            uploaded_by: uploadedBy || "Family",
          })
        : mediaType === "video"
          ? await insertMediaRow("videos", { ...common, video_url: blob.url, title: title || "Video memory", uploaded_by: uploadedBy || "Family" })
          : await insertMediaRow("music", {
              ...common,
              audio_url: blob.url,
              title: title || (kind === "voicemail" ? "Voicemail" : "Song"),
              artist: String(form.get("artist") ?? "").trim().slice(0, 200) || null,
              kind,
              is_youtube: false,
              uploaded_by: uploadedBy || null,
            })

    const key = mediaType === "photo" ? "photo" : mediaType === "video" ? "video" : "music"
    return NextResponse.json({ success: true, [key]: result.row, url: blob.url, status: result.moderated ? status : "approved" })
  } catch (error) {
    console.error(`[legacy ${mediaType} upload]`, error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 })
  }
}
