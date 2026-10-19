import { randomUUID } from "node:crypto"
import { createWriteStream } from "node:fs"
import { readFile, rm, stat } from "node:fs/promises"
import { Readable } from "node:stream"
import { pipeline } from "node:stream/promises"
import { put } from "@vercel/blob"
import { NextResponse, type NextRequest } from "next/server"
import { clientIp, rateLimit } from "@/lib/media/rate-limit"
import { verifyProcessToken } from "@/lib/media/creator-token"
import { fileExtension, musicKind, MEDIA_LIMITS, safeFileName } from "@/lib/media/shared"
import { isMemorialBlobUrl, updateMediaRow, URL_COLUMN, type MediaTable } from "@/lib/media/server"
import { convertAudio, convertVideo, planVideo, probe } from "@/lib/media/transcode"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export const runtime = "nodejs"
// 60s works on every Vercel plan; long HEVC videos that cannot finish in time keep their original file.
export const maxDuration = 60

const MAX_AGE_MS = 24 * 60 * 60 * 1000
const FFMPEG_BUDGET_MS = 45_000

/**
 * Makes a just-uploaded video or audio file playable in every browser.
 * Safe to call more than once: already-converted files (and old rows) are skipped.
 * The original upload is kept in Blob and its URL saved in original_url.
 */
export async function POST(request: NextRequest) {
  const limited = rateLimit(`process:${clientIp(request.headers)}`, 10, 10 * 60 * 1000)
  if (!limited.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 })

  let body: { table?: string; id?: string; token?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
  const table = body.table === "videos" || body.table === "music" ? (body.table as MediaTable) : null
  if (!table || !body.id || typeof body.id !== "string") return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  // Only the browser that registered this upload holds a token for it (30 minutes, single row).
  if (!verifyProcessToken(table, body.id, body.token)) return NextResponse.json({ error: "Not allowed" }, { status: 403 })

  const db = createServiceRoleClient()
  const { data: row, error } = await db.from(table).select("*").eq("id", body.id).maybeSingle()
  if (error || !row) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const column = URL_COLUMN[table]
  const sourceUrl = String(row[column] ?? "")
  if (!isMemorialBlobUrl(sourceUrl, row.memorial_id)) return NextResponse.json({ processed: false, reason: "external" })
  // original_url is set after the first attempt (success or failure), so a file is converted at most once.
  if (new URL(sourceUrl).pathname.includes("/playable/") || row.original_url) {
    return NextResponse.json({ processed: false, reason: "done" })
  }
  if (Date.now() - new Date(row.created_at).getTime() > MAX_AGE_MS) {
    return NextResponse.json({ processed: false, reason: "too-old" })
  }

  const work = `/tmp/media-${randomUUID()}`
  const ext = fileExtension(new URL(sourceUrl).pathname)
  const input = `${work}-in.${ext || "bin"}`
  const output = `${work}-out.${table === "videos" ? "mp4" : "m4a"}`

  try {
    const response = await fetch(sourceUrl)
    if (!response.ok || !response.body) throw new Error(`download failed (${response.status})`)
    await pipeline(Readable.fromWeb(response.body as any), createWriteStream(input))
    const inputSize = (await stat(input)).size
    if (inputSize > MEDIA_LIMITS[table === "videos" ? "video" : "audio"]) throw new Error("file too large")

    let contentType: string
    if (table === "videos") {
      const info = await probe(input)
      const plan = planVideo(info, ext)
      if (plan === "none") return NextResponse.json({ processed: false, reason: "already-compatible", probe: info })
      await convertVideo(input, output, plan, FFMPEG_BUDGET_MS)
      contentType = "video/mp4"
    } else {
      await convertAudio(input, output, musicKind(row) === "voicemail", FFMPEG_BUDGET_MS)
      contentType = "audio/mp4"
    }

    // Build the key from trusted values only (never from the decoded upload name).
    const sourceFolder = new URL(sourceUrl).pathname.split("/")[3]
    const folder = ["videos", "voicemails", "music"].includes(sourceFolder) ? sourceFolder : table === "videos" ? "videos" : "music"
    const folderPath = `memorials/${row.memorial_id}/${folder}`
    const baseName = safeFileName(new URL(sourceUrl).pathname.split("/").pop() ?? "media").replace(/\.[^.]+$/, "") || "media"
    const data = await readFile(output)
    const blob = await put(`${folderPath}/playable/${baseName}.${table === "videos" ? "mp4" : "m4a"}`, data, {
      access: "public",
      contentType,
      addRandomSuffix: true,
      multipart: data.length > 8 * 1024 * 1024,
    })

    await updateMediaRow(table, row.id, {
      [column]: blob.url,
      original_url: sourceUrl,
      content_type: contentType,
      size_bytes: data.length,
    })

    return NextResponse.json({ processed: true, url: blob.url })
  } catch (err) {
    console.error("[media/process]", err instanceof Error ? err.message : err)
    // Remember the attempt so the same file is not re-processed again and again.
    await updateMediaRow(table, row.id, { original_url: sourceUrl }).catch(() => null)
    // The original stays in place; the page shows a download link if a browser cannot play it.
    return NextResponse.json({ processed: false, reason: "conversion-failed" })
  } finally {
    await rm(input, { force: true }).catch(() => null)
    await rm(output, { force: true }).catch(() => null)
  }
}
