import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const memorialId = params.id
    const supabase = createServerClient()

    // Fetch memorial and photos
    const { data: memorial } = await supabase.from("memorials").select("full_name").eq("id", memorialId).single()

    const { data: photos } = await supabase
      .from("photos")
      .select("*")
      .eq("memorial_id", memorialId)
      .order("created_at", { ascending: false })

    if (!photos || photos.length === 0) {
      return NextResponse.json({ error: "No photos found" }, { status: 404 })
    }

    // In a real implementation, you would:
    // 1. Download all photos from their URLs
    // 2. Create a ZIP archive using a library like archiver or jszip
    // 3. Return the ZIP file

    // For now, return a simple response
    return NextResponse.json({
      message: "Photo export feature coming soon",
      photoCount: photos.length,
    })
  } catch (error) {
    console.error("[v0] Photo export error:", error)
    return NextResponse.json({ error: "Failed to export photos" }, { status: 500 })
  }
}
