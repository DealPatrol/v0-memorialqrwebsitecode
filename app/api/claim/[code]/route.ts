import { NextResponse } from "next/server"
import { sendClaimEmail } from "@/lib/claim-email"
import { claimPageUrl, scanUrl } from "@/lib/partner-memorials"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { SITE_URL } from "@/lib/site"

export const dynamic = "force-dynamic"

export async function POST(_request: Request, { params }: { params: { code: string } }) {
  try {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from("partner_memorial_codes")
      .select("code, buyer_email, memorial_id")
      .eq("code", params.code)
      .maybeSingle()

    if (error || !data) return NextResponse.json({ error: "Memorial not found" }, { status: 404 })

    const memorial = await supabase.from("memorials").select("full_name").eq("id", data.memorial_id).maybeSingle()
    const petName = memorial.data?.full_name
    let claimUrl = claimPageUrl(data.code)
    const admin = supabase.auth.admin
    try {
      await admin.createUser({ email: data.buyer_email, email_confirm: true }).catch(() => undefined)
      const generated = await admin.generateLink({
        type: "magiclink",
        email: data.buyer_email,
        options: { redirectTo: `${SITE_URL}/auth/callback?next=${encodeURIComponent(`/claim/${data.code}`)}` },
      })
      if (generated.data?.properties?.action_link) claimUrl = generated.data.properties.action_link
    } catch {
      claimUrl = claimPageUrl(data.code)
    }

    await sendClaimEmail({
      to: data.buyer_email,
      petName: petName || "your loved one",
      claimUrl,
      scanUrl: scanUrl(data.code),
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not send the claim email"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
