import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const milestoneId = params.id

    const { error } = await supabase.from("milestones").delete().eq("id", milestoneId)

    if (error) {
      console.error("[v0] Error deleting milestone:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in milestone deletion:", error)
    return NextResponse.json({ error: "Failed to delete milestone" }, { status: 500 })
  }
}
