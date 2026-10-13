import { NextResponse } from "next/server"
import { createPartnerMemorial } from "@/lib/partner-memorial-store"
import { parsePartnerCreateBody, partnerSecretFromRequest, secretsMatch } from "@/lib/partner-memorials"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  if (!secretsMatch(partnerSecretFromRequest(request.headers), process.env.PARTNER_API_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Expected a JSON object" }, { status: 400 })
  }

  const parsed = parsePartnerCreateBody(body)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  try {
    const created = await createPartnerMemorial(createServiceRoleClient(), parsed.value)
    return NextResponse.json(
      { code: created.code, url: created.url, claimUrl: created.claimUrl },
      { status: created.created ? 201 : 200 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create the memorial"
    console.error("[partner] memorial create failed:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
