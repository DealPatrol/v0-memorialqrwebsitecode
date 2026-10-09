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

    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Row-level security only lets the uploader or the memorial owner delete a track.
    const { data: deleted, error: deleteError } = await supabase
      .from("music")
      .delete()
      .eq("id", musicId)
      .select("audio_url")

    if (deleteError) {
      console.error("Music deletion error:", deleteError)
      return NextResponse.json({ error: "Failed to delete music" }, { status: 500 })
    }
    if (!deleted || deleted.length === 0) {
      return NextResponse.json({ error: "Music not found" }, { status: 404 })
    }

    const audioUrl = deleted[0]?.audio_url
    if (typeof audioUrl === "string" && audioUrl.includes(".blob.vercel-storage.com/")) {
      try {
        await del(audioUrl)
      } catch (blobError) {
        console.error("Music blob deletion error:", blobError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete music" }, { status: 500 })
  }
}
