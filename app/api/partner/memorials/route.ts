import { NextResponse } from "next/server"
import { createPartnerMemorial } from "@/lib/partner-memorial-store"
import { parsePartnerCreateBody, partnerSecretFromRequest, secretsMatch } from "@/lib/partner-memorials"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export const dynamic = "force-dynamic"

/**
 * POST /api/partner/memorials
 * Auth: `x-partner-secret: <PARTNER_API_SECRET>` or `Authorization: Bearer <PARTNER_API_SECRET>`.
 * Body: { source, orderId, lineItemId?, petName, birthDate?, deathDate?, photoUrl?, buyerEmail, notifyBuyer? }
 * 201 { code, url, claimUrl } on create; 200 with the same code when the line was already registered.
 */
export async function POST(request: Request) {
  if (!process.env.PARTNER_API_SECRET) {
    return NextResponse.json({ error: "Partner API is not configured" }, { status: 503 })
  }
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
  const notifyBuyer = Boolean(body && typeof body === "object" && (body as Record<string, unknown>).notifyBuyer === true)

  try {
    const created = await createPartnerMemorial(createServiceRoleClient(), parsed.value, { notifyBuyer })
    return NextResponse.json(
      { code: created.code, url: created.url, claimUrl: created.claimUrl },
      { status: created.created ? 201 : 200, headers: { "Cache-Control": "no-store" } },
    )
  } catch (error) {
    console.error("[partner] memorial create failed:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Could not create the memorial" }, { status: 500 })
  }
}
