import { del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { photoId, url } = await request.json()

    if (!photoId || !url) {
      return NextResponse.json({ error: "Photo ID and URL required" }, { status: 400 })
    }

    // Delete from database first
    const { error: dbError } = await supabase.from("photos").delete().eq("id", photoId)

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
