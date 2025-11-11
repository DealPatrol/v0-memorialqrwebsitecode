import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const memorialId = formData.get("memorialId") as string
    const title = formData.get("title") as string
    const artist = formData.get("artist") as string
    const uploaderName = formData.get("uploaderName") as string

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

    const { data: memorial, error: memorialError } = await supabase
      .from("memorials")
      .select("id")
      .eq("slug", memorialId)
      .single()

    if (memorialError || !memorial) {
      console.error("[v0] Memorial not found:", memorialError)
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }

    let blob
    try {
      blob = await put(`music/${memorialId}/${Date.now()}-${file.name}`, file, {
        access: "public",
      })
      console.log("[v0] Music uploaded to Blob:", blob.url)
    } catch (blobError) {
      console.error("[v0] Blob upload error:", blobError)
      return NextResponse.json(
        { error: "Failed to upload audio file. The file may be too large or there may be a storage issue." },
        { status: 500 },
      )
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: music, error: dbError } = await supabase
      .from("music")
      .insert({
        memorial_id: memorial.id,
        title,
        artist: artist || null,
        audio_url: blob.url,
        user_id: user?.id || null,
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Database error:", dbError)
      return NextResponse.json({ error: "Failed to save music" }, { status: 500 })
    }

    console.log("[v0] Music uploaded successfully:", music.id)
    return NextResponse.json({ music })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Failed to upload music" }, { status: 500 })
  }
}
