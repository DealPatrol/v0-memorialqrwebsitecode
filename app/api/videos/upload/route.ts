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

      const blob = await put(blobPath, file, {
        access: "public",
        addRandomSuffix: false,
      })

      videoUrl = blob.url
    } catch (uploadError: any) {
      return NextResponse.json(
        {
          error:
            "Video upload failed. The file may be too large or there may be a storage issue. Please try a smaller file or contact support.",
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
      return NextResponse.json({ error: `Database error: ${dbError.message}` }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      video,
      url: videoUrl,
    })
  } catch (error: any) {
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
