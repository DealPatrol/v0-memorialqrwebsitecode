import { sendClaimEmail, type ClaimEmailSender } from "@/lib/claim-email"
import {
  claimPageUrl,
  newShortCode,
  scanUrl,
  type PartnerCreateInput,
} from "@/lib/partner-memorials"
import { SITE_URL } from "@/lib/site"

export type PartnerMemorialResult = {
  created: boolean
  code: string
  memorialId: string
  url: string
  claimUrl: string
  emailSent: boolean
  emailError: string | null
}

type PartnerRow = {
  code: string
  memorial_id: string
  buyer_email?: string
  claimed_at?: string | null
  owner_user_id?: string | null
}

export type PartnerDb = {
  from: (table: string) => any
  auth?: {
    admin?: {
      createUser?: (input: { email: string; email_confirm?: boolean }) => Promise<unknown>
      generateLink?: (input: {
        type: "magiclink"
        email: string
        options?: { redirectTo?: string }
      }) => Promise<{ data?: { properties?: { action_link?: string } }; error?: { message?: string } | null }>
    }
  }
}

function printFileFor(code: string): string {
  return `${SITE_URL}/api/print-file/${code}`
}

async function emailedLink(db: PartnerDb, email: string, code: string): Promise<string> {
  const fallback = claimPageUrl(code)
  const admin = db.auth?.admin
  if (!admin?.generateLink) return fallback
  try {
    if (admin.createUser) {
      await admin.createUser({ email, email_confirm: true }).catch(() => undefined)
    }
    const generated = await admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: `${SITE_URL}/auth/callback?next=${encodeURIComponent(`/claim/${code}`)}` },
    })
    const link = generated.data?.properties?.action_link
    if (generated.error || !link) return fallback
    return link
  } catch {
    return fallback
  }
}

async function findExisting(db: PartnerDb, input: PartnerCreateInput): Promise<PartnerRow | null> {
  const { data, error } = await db
    .from("partner_memorial_codes")
    .select("code, memorial_id, buyer_email, claimed_at, owner_user_id")
    .eq("source", input.source)
    .eq("external_order_id", input.orderId)
    .eq("line_item_id", input.lineItemId)
    .maybeSingle()
  if (error) throw new Error(error.message || "Could not look up the memorial code")
  return (data as PartnerRow | null) ?? null
}

function resultFrom(row: PartnerRow, created: boolean, emailSent: boolean, emailError: string | null): PartnerMemorialResult {
  return {
    created,
    code: row.code,
    memorialId: row.memorial_id,
    url: scanUrl(row.code),
    claimUrl: claimPageUrl(row.code),
    emailSent,
    emailError,
  }
}

async function insertMemorial(db: PartnerDb, input: PartnerCreateInput, code: string): Promise<string> {
  const row = {
    full_name: input.petName,
    slug: code,
    user_id: null,
    birth_date: input.birthDate,
    death_date: input.deathDate,
    profile_image_url: input.photoUrl,
    biography: "This memorial is being prepared.",
    theme: "classic",
    package_type: "basic",
    partner_managed: true,
  }
  let inserted = await db.from("memorials").insert(row).select("id").single()
  if (inserted.error && /partner_managed/i.test(inserted.error.message || "")) {
    const { partner_managed: _ignored, ...withoutFlag } = row
    inserted = await db.from("memorials").insert(withoutFlag).select("id").single()
  }
  if (inserted.error || !inserted.data?.id) {
    throw new Error(inserted.error?.message || "Memorial was not created")
  }
  return inserted.data.id as string
}

/**
 * Creates one unclaimed memorial and short code. A repeat call with the same
 * source, order, and line item returns the original code.
 */
export async function createPartnerMemorial(
  db: PartnerDb,
  input: PartnerCreateInput,
  sender?: ClaimEmailSender,
): Promise<PartnerMemorialResult> {
  const existing = await findExisting(db, input)
  if (existing) return resultFrom(existing, false, false, null)

  const code = newShortCode()
  const memorialId = await insertMemorial(db, input, code)
  const inserted = await db
    .from("partner_memorial_codes")
    .insert({
      code,
      source: input.source,
      external_order_id: input.orderId,
      line_item_id: input.lineItemId,
      memorial_id: memorialId,
      buyer_email: input.buyerEmail,
    })
    .select("code, memorial_id")
    .single()

  if (inserted.error?.code === "23505") {
    const raced = await findExisting(db, input)
    if (raced) return resultFrom(raced, false, false, null)
  }
  if (inserted.error || !inserted.data) {
    throw new Error(inserted.error?.message || "Memorial code was not saved")
  }

  const row = inserted.data as PartnerRow
  let emailSent = false
  let emailError: string | null = null
  try {
    const claimUrl = await emailedLink(db, input.buyerEmail, row.code)
    await sendClaimEmail(
      { to: input.buyerEmail, petName: input.petName, claimUrl, scanUrl: scanUrl(row.code) },
      sender,
    )
    emailSent = true
  } catch (error) {
    emailError = error instanceof Error ? error.message : "Claim email was not sent"
  }
  return resultFrom(row, true, emailSent, emailError)
}

export function printFileUrlForCode(code: string): string {
  return printFileFor(code)
}
