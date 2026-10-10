import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { parseWaitlistInput } from "@/lib/plaque-waitlist"

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = parseWaitlistInput(body)
  if (!parsed.ok) return NextResponse.json({ success: false, error: parsed.error }, { status: 400 })

  const { email, productId, sourcePath } = parsed.value
  const supabase = createServiceRoleClient()
  const { error } = await supabase
    .from("plaque_waitlist")
    .insert({ email, product_id: productId, source_path: sourcePath })
  // 23505: already on the list. Same answer, so the form does not reveal who signed up.
  if (error && error.code !== "23505") {
    console.error("[ALERT] plaque waitlist insert failed:", error.message)
    return NextResponse.json({ success: false, error: "Could not save your email. Please try again." }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
