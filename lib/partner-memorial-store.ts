import { sendClaimEmail, type ClaimEmailSender } from "@/lib/claim-email"
import { claimPageUrl, newShortCode, scanUrl, type PartnerCreateInput } from "@/lib/partner-memorials"
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

type MagicLinkAdmin = {
  createUser?: (input: { email: string; email_confirm?: boolean }) => Promise<unknown>
  generateLink?: (input: {
    type: "magiclink"
    email: string
    options?: { redirectTo?: string }
  }) => Promise<{ data?: { properties?: { action_link?: string } }; error?: { message?: string } | null }>
}

export type PartnerDb = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from: (table: string) => any
  /** Supabase `auth`; only `admin.createUser` and `admin.generateLink` are used. */
  auth?: unknown
}

const MAX_CODE_ATTEMPTS = 5

/** A one-time sign-in link that lands on /claim/{code}. Falls back to the plain claim page. */
export async function magicClaimLink(db: PartnerDb, email: string, code: string): Promise<string> {
  const fallback = claimPageUrl(code)
  const admin = (db.auth as { admin?: MagicLinkAdmin } | undefined)?.admin
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

function resultFrom(row: PartnerRow, created: boolean, emailSent = false, emailError: string | null = null): PartnerMemorialResult {
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

/** Returns null when the slug is already taken, so the caller can try another code. */
async function insertMemorial(db: PartnerDb, input: PartnerCreateInput, code: string): Promise<string | null> {
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
  const inserted = await db.from("memorials").insert(row).select("id").single()
  if (inserted.error?.code === "23505") return null
  if (inserted.error || !inserted.data?.id) {
    throw new Error(inserted.error?.message || "Memorial was not created")
  }
  return inserted.data.id as string
}

async function deleteMemorial(db: PartnerDb, memorialId: string): Promise<void> {
  try {
    await db.from("memorials").delete().eq("id", memorialId)
  } catch {
    // Best effort: an orphan placeholder memorial has no code and no owner.
  }
}

/**
 * Creates one unclaimed placeholder memorial and its permanent short code.
 * The same source + order + line item always returns the original code, so a
 * retried webhook or fulfillment never prints a second, different QR.
 * The partner store sends its own order email with the claim link; pass
 * `notifyBuyer` to have MemorialsQR email the buyer as well.
 */
export async function createPartnerMemorial(
  db: PartnerDb,
  input: PartnerCreateInput,
  options: { notifyBuyer?: boolean; sender?: ClaimEmailSender; newCode?: () => string } = {},
): Promise<PartnerMemorialResult> {
  const existing = await findExisting(db, input)
  if (existing) return resultFrom(existing, false)

  const makeCode = options.newCode ?? (() => newShortCode())
  let row: PartnerRow | null = null
  for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS && !row; attempt++) {
    const code = makeCode()
    const memorialId = await insertMemorial(db, input, code)
    if (!memorialId) continue
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

    if (!inserted.error && inserted.data) {
      row = inserted.data as PartnerRow
      break
    }
    await deleteMemorial(db, memorialId)
    if (inserted.error?.code === "23505") {
      // Either a concurrent request for the same line won (return its code) or the code collided (try another).
      const raced = await findExisting(db, input)
      if (raced) return resultFrom(raced, false)
      continue
    }
    throw new Error(inserted.error?.message || "Memorial code was not saved")
  }
  if (!row) throw new Error("Could not allocate a unique memorial code")

  if (!options.notifyBuyer) return resultFrom(row, true)

  try {
    const claimUrl = await magicClaimLink(db, input.buyerEmail, row.code)
    await sendClaimEmail({ to: input.buyerEmail, petName: input.petName, claimUrl, scanUrl: scanUrl(row.code) }, options.sender)
    return resultFrom(row, true, true, null)
  } catch (error) {
    return resultFrom(row, true, false, error instanceof Error ? error.message : "Claim email was not sent")
  }
}
