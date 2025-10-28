import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const memorialSlug = params.id

    console.log("[v0] Fetching memorial by slug:", memorialSlug)

    // Query memorial by slug
    const { data: memorial, error } = await supabase
      .from("memorials")
      .select("*")
      .eq("slug", memorialSlug)
      .maybeSingle()

    if (error) {
      console.error("[v0] Error fetching memorial:", error)
      return NextResponse.json({ error: "Failed to fetch memorial" }, { status: 500 })
    }

    if (!memorial) {
      console.log("[v0] Memorial not found:", memorialSlug)
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }

    console.log("[v0] Memorial found:", memorial.full_name)
    return NextResponse.json({ memorial })
  } catch (error) {
    console.error("[v0] Error in memorial API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
