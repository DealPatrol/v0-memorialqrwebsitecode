import { type NextRequest, NextResponse } from "next/server"
import { extractYouTubeId, youTubeWatchUrl } from "@/lib/youtube"
import { clientIp, rateLimit } from "@/lib/media/rate-limit"
import { currentUploader, insertMediaRow, moderationStatusFor, pendingCapReached, resolveMemorial } from "@/lib/media/server"

export const runtime = "nodejs"

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max) : ""
}

/**
 * Adds a YouTube song (or video) to a memorial.
 * Previously broken: the page sends the memorial slug, which was inserted
 * straight into the uuid memorial_id column, along with columns that did not exist.
 */
export async function POST(request: NextRequest) {
  const limited = rateLimit(`youtube:${clientIp(request.headers)}`, 15, 10 * 60 * 1000)
  if (!limited.ok) return NextResponse.json({ error: "Too many requests. Please wait a few minutes." }, { status: 429 })

  try {
    const body = await request.json()
    const title = clean(body.title, 200)
    const videoId = extractYouTubeId(clean(body.videoId, 20)) ?? extractYouTubeId(clean(body.youtubeUrl, 500))

    if (!body.memorialId || !title) {
      return NextResponse.json({ error: "Please add a title" }, { status: 400 })
    }
    if (!videoId) {
      return NextResponse.json({ error: "That does not look like a YouTube video link" }, { status: 400 })
    }

    const memorial = await resolveMemorial(clean(body.memorialId, 100))
    if (!memorial) return NextResponse.json({ error: "Memorial not found" }, { status: 404 })

    const uploader = await currentUploader(memorial, body.creatorToken)
    if (!uploader.canPublish && (await pendingCapReached(memorial.id))) {
      return NextResponse.json({ error: "This memorial has many items waiting for approval. Please try again tomorrow." }, { status: 429 })
    }
    const status = moderationStatusFor(uploader)

    const { row, moderated } = await insertMediaRow("music", {
      memorial_id: memorial.id,
      title,
      artist: clean(body.artist, 200) || null,
      audio_url: youTubeWatchUrl(videoId),
      youtube_id: videoId,
      is_youtube: true,
      kind: body.kind === "video" ? "video" : "song",
      status,
      uploaded_by: clean(body.uploaderName, 80) || null,
      user_id: uploader.userId,
    })

    return NextResponse.json({ music: row, status: moderated ? status : "approved" })
  } catch (error) {
    console.error("[music/youtube]", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Failed to add YouTube link" }, { status: 500 })
  }
}
