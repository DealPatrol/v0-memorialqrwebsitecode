import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const memorialId = formData.get("memorialId") as string
    const title = formData.get("title") as string
    const artist = formData.get("artist") as string
    const uploaderName = formData.get("uploaderName") as string
    const kind = formData.get("kind") === "voice" ? "voice" : "music"
    const isPrimary = formData.get("isPrimary") === "true"
    const orderId = formData.get("orderId") as string | null

    console.log("[v0] Music upload request:", { memorialId, title, artist, fileSize: file?.size })

    if (!file || !memorialId || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 20MB. Please compress your audio file." },
        { status: 400 },
      )
    }

    const validTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "audio/m4a",
      "audio/x-m4a",
      "audio/mp4",
      "audio/aac",
      "audio/x-aac",
      "audio/amr",
      "audio/3gpp",
      "audio/3gpp2",
      "video/3gpp",
      "video/3gpp2",
      "audio/webm",
    ]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload an audio file (MP3, WAV, M4A, AMR, 3GP, AAC, or voicemail)." },
        { status: 400 },
      )
    }

    const supabase = await createClient()
    const serviceRole = createServiceRoleClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(memorialId)
    const { data: memorial, error: memorialError } = await serviceRole
      .from("memorials")
      .select("id, user_id")
      .eq(isUUID ? "id" : "slug", memorialId)
      .single()

    if (memorialError || !memorial) {
      console.error("[v0] Memorial not found:", memorialError)
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }

    let canUpload = Boolean(user && memorial.user_id === user.id)
    if (!canUpload && !memorial.user_id && orderId) {
      const { data: order } = await serviceRole
        .from("orders")
        .select("id")
        .eq("id", orderId)
        .eq("memorial_id", memorial.id)
        .maybeSingle()
      canUpload = Boolean(order)
    }

    if (!canUpload) {
      return NextResponse.json({ error: "You do not have permission to upload audio" }, { status: 403 })
    }

    let blob
    try {
      blob = await put(`music/${memorialId}/${Date.now()}-${file.name}`, file, {
        access: "public",
      })
      console.log("[v0] Music uploaded to Blob:", blob.url)
    } catch (blobError) {
      console.error("Blob upload error:", blobError)
      return NextResponse.json(
        { error: "Failed to upload audio file. The file may be too large or there may be a storage issue." },
        { status: 500 },
      )
    }

    if (isPrimary) {
      const { error: resetError } = await serviceRole
        .from("music")
        .update({ is_primary: false })
        .eq("memorial_id", memorial.id)
      if (resetError) {
        return NextResponse.json({ error: "Failed to update primary recording" }, { status: 500 })
      }
    }

    const { data: music, error: dbError } = await serviceRole
      .from("music")
      .insert({
        memorial_id: memorial.id,
        title,
        artist: artist || null,
        audio_url: blob.url,
        user_id: user?.id || null,
        kind,
        is_primary: isPrimary,
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to save music" }, { status: 500 })
    }

    console.log("[v0] Music uploaded successfully:", music.id)
    return NextResponse.json({ music })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload music" }, { status: 500 })
  }
}
