import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    let supabase
    try {
      supabase = await createClient()
    } catch (clientError) {
      return NextResponse.json(
        { error: "Database connection failed. Please check environment variables." },
        { status: 500 },
      )
    }

    const identifier = id
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier)

    const { data: memorial, error: memorialError } = await supabase
      .from("memorials")
      .select("id")
      .eq(isUUID ? "id" : "slug", identifier)
      .maybeSingle()

    if (memorialError) {
      return NextResponse.json({ error: "Failed to find memorial" }, { status: 500 })
    }

    if (!memorial) {
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }

    const { data: photos, error } = await supabase
      .from("photos")
      .select("*")
      .eq("memorial_id", memorial.id)
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) {
      throw error
    }

    return NextResponse.json({ photos: photos || [] })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 })
  }
}
