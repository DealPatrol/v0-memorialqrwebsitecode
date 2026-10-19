"use client"

import { upload } from "@vercel/blob/client"
import { checkMediaFile, mediaFolder, safeFileName, type AudioKind, type MediaType, type ModerationStatus } from "@/lib/media/shared"

export type UploadStage = "uploading" | "saving" | "converting" | "done"

export type UploadOptions = {
  file: File
  memorialId: string
  mediaType: MediaType
  kind?: AudioKind
  title?: string
  artist?: string
  caption?: string
  uploadedBy?: string
  /** Returned by POST /api/memorials so the creator's first uploads skip approval. */
  creatorToken?: string | null
  onProgress?: (percent: number, stage: UploadStage) => void
}

export type UploadResult = {
  id?: string
  url: string
  status: ModerationStatus
  /** False when a format could not be converted; the original is kept and offered as a download. */
  playable: boolean
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error((data as { error?: string }).error || `Request failed (${response.status})`)
  return data as T
}

/**
 * Upload a photo, video or audio file directly from the browser to Vercel Blob
 * (no 4.5MB function limit), save it on the memorial, then convert phone formats
 * (AMR/3GP voicemails, iPhone MOV/HEVC) so every browser can play them.
 */
export async function uploadMemorialMedia(options: UploadOptions): Promise<UploadResult> {
  const { file, memorialId, mediaType, kind, onProgress } = options
  const check = checkMediaFile(file, mediaType)
  if (!check.ok) throw new Error(check.error)

  const pathname = `memorials/${memorialId}/${mediaFolder(mediaType, kind)}/${safeFileName(file.name)}`
  onProgress?.(0, "uploading")

  let blob: { url: string }
  try {
    blob = await upload(pathname, file, {
      access: "public",
      contentType: check.contentType,
      handleUploadUrl: "/api/media/upload-token",
      clientPayload: JSON.stringify({ memorialId, mediaType, kind, creatorToken: options.creatorToken ?? undefined }),
      multipart: file.size > 8 * 1024 * 1024,
      onUploadProgress: ({ percentage }) => onProgress?.(Math.min(95, Math.round(percentage * 0.95)), "uploading"),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed"
    // Blob client errors wrap the server's message; keep it readable.
    throw new Error(message.replace(/^Vercel Blob: /, ""))
  }

  onProgress?.(96, "saving")
  const saved = await postJson<{ id?: string; table?: string; status: ModerationStatus; needsProcessing?: boolean; url: string }>(
    "/api/media/register",
    {
      memorialId,
      mediaType,
      kind,
      url: blob.url,
      title: options.title,
      artist: options.artist,
      caption: options.caption,
      uploadedBy: options.uploadedBy,
      creatorToken: options.creatorToken ?? undefined,
    },
  )

  let url = saved.url
  let playable = true
  if (saved.needsProcessing && saved.id && saved.table) {
    onProgress?.(97, "converting")
    try {
      const processed = await postJson<{ processed: boolean; url?: string; reason?: string }>("/api/media/process", {
        table: saved.table,
        id: saved.id,
      })
      if (processed.processed && processed.url) url = processed.url
      else if (processed.reason === "conversion-failed") playable = false
    } catch {
      playable = false
    }
  }

  onProgress?.(100, "done")
  return { id: saved.id, url, status: saved.status, playable }
}

export function uploadResultMessage(result: UploadResult, noun: string): { title: string; description: string } {
  if (result.status === "pending") {
    return {
      title: "Thank you, upload received",
      description: `Your ${noun} will appear on the memorial once the family approves it.`,
    }
  }
  return {
    title: `${noun[0].toUpperCase()}${noun.slice(1)} added`,
    description: result.playable
      ? `Your ${noun} has been added to the memorial.`
      : `Your ${noun} was saved, but we could not convert it for every browser. Visitors can still download it.`,
  }
}

/**
 * Shrink a photo before upload (max 1920px JPEG). If the browser cannot decode it
 * (e.g. an iPhone HEIC file on Chrome/Windows), explain how to fix it instead of
 * uploading a photo most visitors could not see.
 */
export async function preparePhoto(file: File): Promise<File> {
  const { compressImage } = await import("@/lib/image-compression")
  const { isHeic } = await import("@/lib/media/shared")
  try {
    const compressed = await compressImage(file, 2)
    return compressed.size < file.size ? compressed : file
  } catch {
    if (isHeic(file)) {
      throw new Error(
        "This is an iPhone HEIC photo, which most browsers cannot show. Please upload it from your iPhone's Photos app, or save it as JPEG first.",
      )
    }
    return file
  }
}
