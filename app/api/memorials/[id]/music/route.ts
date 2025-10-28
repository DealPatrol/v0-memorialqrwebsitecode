import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const memorialSlug = id
    const { data: memorial, error: memorialError } = await supabase
      .from("memorials")
      .select("id")
      .eq("slug", memorialSlug)
      .maybeSingle()

    if (memorialError) {
      console.error("Error finding memorial:", memorialError)
      return NextResponse.json({ error: "Failed to find memorial" }, { status: 500 })
    }

    if (!memorial) {
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }

    const { data: music, error } = await supabase
      .from("music")
      .select("*")
      .eq("memorial_id", memorial.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching music:", error)
      return NextResponse.json({ error: "Failed to fetch music" }, { status: 500 })
    }

    return NextResponse.json({ music: music || [] })
  } catch (error) {
    console.error("Error fetching music:", error)
    return NextResponse.json({ error: "Failed to fetch music" }, { status: 500 })
  }
}
