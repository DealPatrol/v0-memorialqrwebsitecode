import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse, type NextRequest } from "next/server"
import { clientIp, rateLimit } from "@/lib/media/rate-limit"
import { ALLOWED_CONTENT_TYPES, MEDIA_LIMITS, mediaFolder, type AudioKind, type MediaType } from "@/lib/media/shared"
import { currentUploader, pendingCapReached, resolveMemorial } from "@/lib/media/server"

export const runtime = "nodejs"

type ClientPayload = {
  memorialId?: string
  mediaType?: MediaType
  kind?: AudioKind
  creatorToken?: string
}

const MEDIA_TYPES: MediaType[] = ["photo", "video", "audio", "profile"]

/**
 * Issues short-lived Vercel Blob client tokens so the browser uploads straight
 * to Blob storage. Files never pass through this function, which avoids the
 * ~4.5MB serverless request-body limit that broke large video/audio uploads.
 */
export async function POST(request: NextRequest) {
  let body: HandleUploadBody
  try {
    body = (await request.json()) as HandleUploadBody
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  if (body.type === "blob.generate-client-token") {
    const limited = rateLimit(`upload-token:${clientIp(request.headers)}`, 40, 10 * 60 * 1000)
    if (!limited.ok) {
      return NextResponse.json(
        { error: `Too many uploads from this connection. Please wait ${limited.retryAfterSeconds} seconds and try again.` },
        { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } },
      )
    }
  }

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, rawPayload) => {
        let payload: ClientPayload = {}
        try {
          payload = JSON.parse(rawPayload ?? "{}") as ClientPayload
        } catch {
          throw new Error("Invalid upload details")
        }
        const mediaType = payload.mediaType
        if (!mediaType || !MEDIA_TYPES.includes(mediaType)) throw new Error("Unknown media type")

        const memorial = await resolveMemorial(payload.memorialId ?? "")
        if (!memorial) throw new Error("Memorial not found")

        const folder = mediaFolder(mediaType, payload.kind)
        if (!pathname.startsWith(`memorials/${memorial.id}/${folder}/`) || pathname.includes("..")) {
          throw new Error("Invalid upload path")
        }

        const uploader = await currentUploader(memorial, payload.creatorToken)
        if (mediaType === "profile" && !uploader.canPublish) throw new Error("Only the memorial owner can change the profile photo")
        if (!uploader.canPublish && (await pendingCapReached(memorial.id))) {
          throw new Error("This memorial has a lot of uploads waiting for the family's approval. Please try again tomorrow.")
        }

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES[mediaType],
          maximumSizeInBytes: MEDIA_LIMITS[mediaType],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ memorialId: memorial.id, mediaType }),
        }
      },
      // No onUploadCompleted callback: the browser calls /api/media/register when the upload
      // finishes, which also works on localhost and on protected previews Blob cannot call back to.
    })
    return NextResponse.json(json)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload could not be started"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
