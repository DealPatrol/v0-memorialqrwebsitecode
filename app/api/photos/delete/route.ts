import { del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { photoId } = await request.json()
    if (!photoId) {
      return NextResponse.json({ error: "Photo ID required" }, { status: 400 })
    }

    // Row-level security only lets the uploader or the memorial owner delete a photo.
    // Use the stored URL of the row that was actually deleted, never a URL from the request.
    const { data: deleted, error: dbError } = await supabase
      .from("photos")
      .delete()
      .eq("id", photoId)
      .select("image_url")

    if (dbError) throw dbError
    if (!deleted || deleted.length === 0) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 })
    }

    const imageUrl = deleted[0]?.image_url
    if (typeof imageUrl === "string" && imageUrl.includes(".blob.vercel-storage.com/")) {
      try {
        await del(imageUrl)
      } catch (blobError) {
        console.error("Photo blob deletion error:", blobError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 })
  }
}
