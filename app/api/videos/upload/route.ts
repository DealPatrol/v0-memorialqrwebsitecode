import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

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

    console.log("[v0] Uploading video to Vercel Blob...")

    let blob
    try {
      blob = await put(`memorials/${memorialId}/videos/${Date.now()}-${file.name}`, file, {
        access: "public",
      })
      console.log("[v0] Video uploaded to Blob:", blob.url)
    } catch (blobError: any) {
      console.error("[v0] Blob upload failed")
      return NextResponse.json(
        {
          error:
            "Video upload failed. The file may be too large or there may be a storage issue. Please try a smaller file or contact support.",
        },
        { status: 500 },
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("[v0] Missing Supabase credentials")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const serviceSupabase = createSupabaseClient(supabaseUrl, supabaseKey)

    const { data: memorial, error: memorialError } = await serviceSupabase
      .from("memorials")
      .select("id")
      .eq("slug", memorialId)
      .maybeSingle()

    if (memorialError) {
      console.error("[v0] Error fetching memorial:", memorialError)
      return NextResponse.json({ error: "Failed to find memorial" }, { status: 500 })
    }

    if (!memorial) {
      console.error("[v0] Memorial not found:", memorialId)
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }

    console.log("[v0] Found memorial UUID:", memorial.id)

    const userId = user?.id || null
    console.log("[v0] User ID:", userId)

    const { data: video, error: dbError } = await serviceSupabase
      .from("videos")
      .insert({
        memorial_id: memorial.id,
        user_id: userId,
        video_url: blob.url,
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

    console.log("[v0] Video saved to database:", video)

    return NextResponse.json({
      success: true,
      video,
      url: blob.url,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 })
  }
}
