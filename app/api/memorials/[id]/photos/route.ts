import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[v0] Fetching photos for memorial:", params.id)

    let supabase
    try {
      supabase = await createClient()
    } catch (clientError) {
      console.error("[v0] Failed to create Supabase client:", clientError)
      return NextResponse.json(
        { error: "Database connection failed. Please check environment variables." },
        { status: 500 },
      )
    }

    const identifier = params.id
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier)

    const { data: memorial, error: memorialError } = await supabase
      .from("memorials")
      .select("id")
      .eq(isUUID ? "id" : "slug", identifier)
      .maybeSingle()

    if (memorialError) {
      console.error("[v0] Error finding memorial:", memorialError)
      return NextResponse.json({ error: "Failed to find memorial" }, { status: 500 })
    }

    if (!memorial) {
      console.log("[v0] Memorial not found:", identifier)
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }

    const { data: photos, error } = await supabase
      .from("photos")
      .select("*")
      .eq("memorial_id", memorial.id)
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) {
      console.error("[v0] Error fetching photos:", error)
      throw error
    }

    console.log("[v0] Successfully fetched", photos?.length || 0, "photos")
    return NextResponse.json({ photos })
  } catch (error) {
    console.error("[v0] Error fetching photos:", error)
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 })
  }
}
