import { del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { videoId, url } = await request.json()

    if (!videoId || !url) {
      return NextResponse.json({ error: "Video ID and URL required" }, { status: 400 })
    }

    // Delete from database first (RLS policies handle permission checks)
    const { error: dbError } = await supabase.from("videos").delete().eq("id", videoId)

    if (dbError) {
      throw dbError
    }

    // Delete from Vercel Blob
    await del(url)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
