import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const formData = await request.formData()

    const memorialId = formData.get("memorialId") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const date = formData.get("date") as string
    const category = formData.get("category") as string

    if (!memorialId || !title || !date) {
      return NextResponse.json({ error: "Memorial ID, title, and date are required" }, { status: 400 })
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Insert milestone
    const { data: milestone, error } = await supabase
      .from("milestones")
      .insert({
        memorial_id: memorialId,
        user_id: user?.id || null,
        title,
        description,
        date,
        category,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating milestone:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ milestone })
  } catch (error) {
    console.error("[v0] Error in milestone creation:", error)
    return NextResponse.json({ error: "Failed to create milestone" }, { status: 500 })
  }
}
