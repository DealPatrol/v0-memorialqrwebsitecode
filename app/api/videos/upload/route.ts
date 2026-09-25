import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const formData = await request.formData()
    const file = formData.get("file") as File
    const memorialId = formData.get("memorialId") as string
    const title = formData.get("title") as string
    const uploadedBy = formData.get("uploadedBy") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 },
      )
    }

    if (!memorialId) {
      return NextResponse.json({ error: "Memorial ID required" }, { status: 400 })
    }

    if (!title) {
      return NextResponse.json({ error: "Video title required" }, { status: 400 })
    }

    if (!uploadedBy) {
      return NextResponse.json({ error: "Uploader name required" }, { status: 400 })
    }

    let videoUrl
    try {
      const timestamp = Date.now()
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
      const blobPath = `memorials/${memorialId}/videos/${timestamp}-${sanitizedFileName}`

      console.log("[v0] Starting video upload:", {
        fileName: sanitizedFileName,
        fileSize: file.size,
        fileType: file.type,
        blobPath,
      })

      const blob = await put(blobPath, file, {
        access: "public",
        addRandomSuffix: false,
      })

      videoUrl = blob.url
      console.log("[v0] Video uploaded successfully to:", videoUrl)
    } catch (uploadError: any) {
      console.error("[v0] Blob upload error:", {
        error: uploadError,
        message: uploadError?.message,
        code: uploadError?.code,
        status: uploadError?.status,
      })

      // Return more specific error based on the error type
      if (uploadError?.status === 413 || uploadError?.message?.includes("too large")) {
        return NextResponse.json(
          {
            error:
              "Video file is too large for upload. Please try a smaller file (maximum 100MB) or compress your video.",
          },
          { status: 413 },
        )
      }

      if (uploadError?.message?.includes("timeout")) {
        return NextResponse.json(
          {
            error:
              "Upload timed out. Please check your internet connection and try again with a smaller file if possible.",
          },
          { status: 504 },
        )
      }

      return NextResponse.json(
        {
          error: `Video upload failed: ${uploadError?.message || "Unknown storage error"}. Please try again or contact support if the issue persists.`,
        },
        { status: 500 },
      )
    }

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(memorialId)

    let memorial
    if (isUUID) {
      const { data, error: memorialError } = await supabase
        .from("memorials")
        .select("id")
        .eq("id", memorialId)
        .maybeSingle()

      if (memorialError) {
        console.error("[v0] Memorial lookup error:", memorialError)
        return NextResponse.json({ error: "Failed to find memorial" }, { status: 500 })
      }
      memorial = data
    } else {
      const { data, error: memorialError } = await supabase
        .from("memorials")
        .select("id")
        .eq("slug", memorialId)
        .maybeSingle()

      if (memorialError) {
        console.error("[v0] Memorial lookup error:", memorialError)
        return NextResponse.json({ error: "Failed to find memorial" }, { status: 500 })
      }
      memorial = data
    }

    if (!memorial) {
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }

    const userId = user?.id || null

    const { data: video, error: dbError } = await supabase
      .from("videos")
      .insert({
        memorial_id: memorial.id,
        user_id: userId,
        video_url: videoUrl,
        title: title,
        uploaded_by: uploadedBy,
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Database insert error:", dbError)
      return NextResponse.json({ error: `Database error: ${dbError.message}` }, { status: 500 })
    }

    console.log("[v0] Video record created successfully:", video.id)

    return NextResponse.json({
      success: true,
      video,
      url: videoUrl,
    })
  } catch (error: any) {
    console.error("[v0] Unexpected upload error:", error)
    return NextResponse.json(
      {
        error: error?.message || "Upload failed. Please try again.",
      },
      { status: 500 },
    )
  }
}

export const runtime = "edge"
export const maxDuration = 60
