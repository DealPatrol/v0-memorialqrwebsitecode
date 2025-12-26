import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    console.log("[v0] Photos API - Fetching photos for memorial:", id)

    let supabase
    try {
      supabase = await createClient()
    } catch (clientError) {
      console.error("[v0] Photos API - Supabase client creation failed:", clientError)
      return NextResponse.json(
        { error: "Database connection failed. Please check environment variables." },
        { status: 500 },
      )
    }

    const identifier = id
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier)
    console.log("[v0] Photos API - Identifier:", identifier, "Is UUID:", isUUID)

    const { data: memorial, error: memorialError } = await supabase
      .from("memorials")
      .select("id")
      .eq(isUUID ? "id" : "slug", identifier)
      .maybeSingle()

    if (memorialError) {
      console.error("[v0] Photos API - Memorial lookup error:", memorialError)
      return NextResponse.json({ error: "Failed to find memorial" }, { status: 500 })
    }

    if (!memorial) {
      console.log("[v0] Photos API - Memorial not found for:", identifier)
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }

    console.log("[v0] Photos API - Found memorial ID:", memorial.id)

    const { data: photos, error } = await supabase
      .from("photos")
      .select("*")
      .eq("memorial_id", memorial.id)
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) {
      console.error("[v0] Photos API - Error fetching photos:", error)
      throw error
    }

    console.log("[v0] Photos API - Fetched", photos?.length || 0, "photos")
    return NextResponse.json({ photos: photos || [] })
  } catch (error) {
    console.error("[v0] Photos API - Unexpected error:", error)
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 })
  }
}
