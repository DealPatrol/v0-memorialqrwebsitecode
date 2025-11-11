import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { memorialId, title, artist, uploaderName, youtubeUrl, videoId } = await request.json()

    if (!memorialId || !title || !videoId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: music, error: dbError } = await supabase
      .from("music")
      .insert({
        memorial_id: memorialId,
        title,
        artist: artist || null,
        uploader_name: uploaderName || null,
        audio_url: youtubeUrl,
        youtube_id: videoId,
        is_youtube: true,
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Database error:", dbError)
      return NextResponse.json({ error: "Failed to save music" }, { status: 500 })
    }

    return NextResponse.json({ music })
  } catch (error) {
    console.error("[v0] Error adding YouTube music:", error)
    return NextResponse.json({ error: "Failed to add YouTube music" }, { status: 500 })
  }
}
