import type { NextRequest } from "next/server"
import { legacyMultipartUpload } from "@/lib/media/legacy-upload"

export const runtime = "nodejs"

/** Small-file fallback. The site uploads photos straight to Blob via /api/media/upload-token. */
export async function POST(request: NextRequest) {
  return legacyMultipartUpload(request, "photo")
}
