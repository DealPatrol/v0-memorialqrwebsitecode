import { type NextRequest, NextResponse } from "next/server"
import { del } from "@vercel/blob"
import { createServerClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const musicId = searchParams.get("id")

    if (!musicId) {
      return NextResponse.json({ error: "Music ID is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data: music, error: fetchError } = await supabase.from("music").select("*").eq("id", musicId).single()

    if (fetchError || !music) {
      return NextResponse.json({ error: "Music not found" }, { status: 404 })
    }

    try {
      await del(music.audio_url)
    } catch (blobError) {
      console.error("[v0] Blob deletion error:", blobError)
      // Continue even if blob deletion fails
    }

    const { error: deleteError } = await supabase.from("music").delete().eq("id", musicId)

    if (deleteError) {
      console.error("[v0] Database deletion error:", deleteError)
      return NextResponse.json({ error: "Failed to delete music" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete error:", error)
    return NextResponse.json({ error: "Failed to delete music" }, { status: 500 })
  }
}
