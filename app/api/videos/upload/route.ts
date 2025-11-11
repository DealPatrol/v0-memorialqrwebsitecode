import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

const s3Client = new S3Client({
  region: process.env.SUPABASE_S3_REGION!,
  endpoint: process.env.SUPABASE_S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
})

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

    console.log("[v0] Starting video upload. File size:", file.size, "bytes")
    console.log("[v0] File name:", file.name)
    console.log("[v0] Memorial ID:", memorialId)

    let videoUrl
    try {
      const timestamp = Date.now()
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
      const key = `memorials/${memorialId}/videos/${timestamp}-${sanitizedFileName}`

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const uploadCommand = new PutObjectCommand({
        Bucket: process.env.SUPABASE_S3_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })

      await s3Client.send(uploadCommand)

      videoUrl = `${process.env.SUPABASE_S3_ENDPOINT}/${process.env.SUPABASE_S3_BUCKET}/${key}`
      console.log("[v0] Video uploaded to S3 successfully:", videoUrl)
    } catch (uploadError: any) {
      console.error("[v0] S3 upload failed:", uploadError)
      console.error("[v0] Error name:", uploadError?.name)
      console.error("[v0] Error message:", uploadError?.message)
      console.error("[v0] Error stack:", uploadError?.stack)

      return NextResponse.json(
        {
          error: uploadError?.message || "Video upload to storage failed. Please try again or contact support.",
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
        console.error("[v0] Error fetching memorial by UUID:", memorialError)
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
        console.error("[v0] Error fetching memorial by slug:", memorialError)
        return NextResponse.json({ error: "Failed to find memorial" }, { status: 500 })
      }
      memorial = data
    }

    if (!memorial) {
      console.error("[v0] Memorial not found:", memorialId)
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }

    console.log("[v0] Found memorial UUID:", memorial.id)

    const userId = user?.id || null
    console.log("[v0] User ID:", userId)

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
      console.error("[v0] Database error:", dbError)
      console.error("[v0] Error details:", JSON.stringify(dbError, null, 2))
      return NextResponse.json({ error: `Database error: ${dbError.message}` }, { status: 500 })
    }

    console.log("[v0] Video saved to database successfully:", video)

    return NextResponse.json({
      success: true,
      video,
      url: videoUrl,
    })
  } catch (error: any) {
    console.error("[v0] Upload error:", error)
    console.error("[v0] Error details:", error?.message, error?.stack)
    return NextResponse.json(
      {
        error: error?.message || "Upload failed. Please try again.",
      },
      { status: 500 },
    )
  }
}

export const runtime = "edge"
export const maxDuration = 60 // 60 seconds for large uploads
