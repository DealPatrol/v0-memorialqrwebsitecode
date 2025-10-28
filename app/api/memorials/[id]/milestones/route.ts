import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const memorialSlug = params.id

    // First, find the memorial by slug to get the UUID
    const { data: memorial, error: memorialError } = await supabase
      .from("memorials")
      .select("id")
      .eq("slug", memorialSlug)
      .single()

    if (memorialError || !memorial) {
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }

    // Fetch milestones for this memorial, ordered by date
    const { data: milestones, error } = await supabase
      .from("milestones")
      .select("*")
      .eq("memorial_id", memorial.id)
      .order("date", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching milestones:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ milestones: milestones || [] })
  } catch (error) {
    console.error("[v0] Error in milestones fetch:", error)
    return NextResponse.json({ error: "Failed to fetch milestones" }, { status: 500 })
  }
}
