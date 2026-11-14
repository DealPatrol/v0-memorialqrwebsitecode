import { NextResponse } from "next/server"
import { sendClaimEmail } from "@/lib/claim-email"
import { magicClaimLink } from "@/lib/partner-memorial-store"
import { isShortCode, scanUrl } from "@/lib/partner-memorials"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export const dynamic = "force-dynamic"

/** Emails the sign-in link to the buyer email stored for this code. The address is never shown to the caller. */
export async function POST(_request: Request, { params }: { params: { code: string } }) {
  if (!isShortCode(params.code)) return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
  try {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from("partner_memorial_codes")
      .select("code, buyer_email, memorial_id, claimed_at")
      .eq("code", params.code)
      .maybeSingle()
    if (error || !data) return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    if (data.claimed_at) return NextResponse.json({ error: "This memorial is already set up. Sign in to edit it." }, { status: 409 })

    const memorial = await supabase.from("memorials").select("full_name").eq("id", data.memorial_id).maybeSingle()
    const claimUrl = await magicClaimLink(supabase, data.buyer_email, data.code)
    await sendClaimEmail({
      to: data.buyer_email,
      petName: memorial.data?.full_name || "your loved one",
      claimUrl,
      scanUrl: scanUrl(data.code),
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[claim] email failed:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "The email could not be sent. Please try again." }, { status: 500 })
  }
}
