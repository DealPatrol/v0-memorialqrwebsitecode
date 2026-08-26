import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const formData = await request.formData()
    const file = formData.get("file") as File
    const memorialId = formData.get("memorialId") as string
    const caption = formData.get("caption") as string
    const uploadedBy = (formData.get("uploaderName") || formData.get("uploadedBy")) as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!memorialId) {
      return NextResponse.json({ error: "Memorial ID required" }, { status: 400 })
    }

    if (!uploadedBy) {
      return NextResponse.json({ error: "Uploader name required" }, { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024 // 10MB after compression
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB` }, { status: 400 })
    }

    const blob = await put(`memorials/${memorialId}/${Date.now()}-${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    })

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(memorialId)

    const { data: memorial, error: memorialError } = await supabase
      .from("memorials")
      .select("id")
      .eq(isUUID ? "id" : "slug", memorialId)
      .maybeSingle()

    if (memorialError) {
      console.error("Error fetching memorial:", memorialError)
      return NextResponse.json(
        { error: "Failed to find memorial. Please check the memorial ID and try again." },
        { status: 500 },
      )
    }

    if (!memorial) {
      console.error("Memorial not found for identifier:", memorialId)
      return NextResponse.json({ error: "Memorial not found. Please verify the memorial page URL." }, { status: 404 })
    }

    const userId = user?.id || null

    const { data: photo, error: dbError } = await supabase
      .from("photos")
      .insert({
        memorial_id: memorial.id,
        user_id: userId,
        image_url: blob.url,
        caption: caption || null,
        uploaded_by: uploadedBy,
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: `Failed to save photo: ${dbError.message}` }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      photo,
      url: blob.url,
    })
  } catch (error) {
    console.error("Upload error:", error)
    const errorMessage = error instanceof Error ? error.message : "Upload failed"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
