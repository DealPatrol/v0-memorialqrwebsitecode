import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const identifier = params.id

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier)

    // Query by ID if UUID, otherwise by slug
    const { data: memorial, error: memorialError } = await supabase
      .from("memorials")
      .select("id")
      .eq(isUUID ? "id" : "slug", identifier)
      .maybeSingle()

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
