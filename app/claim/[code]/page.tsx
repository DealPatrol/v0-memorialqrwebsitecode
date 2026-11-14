import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { claimDecision } from "@/lib/partner-memorials"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { ClaimRequestButton } from "./claim-request-button"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Memorial being prepared | MemorialsQR",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

type CodeRow = {
  id: string
  memorial_id: string
  buyer_email: string
  claimed_at: string | null
  owner_user_id: string | null
}

type MemorialRow = {
  id: string
  slug: string | null
  full_name: string
  birth_date: string | null
  death_date: string | null
  profile_image_url: string | null
}

function formatDate(value: string): string {
  const [year, month, day] = value.split("-")
  if (!year || !month || !day) return value
  return `${month}/${day}/${year}`
}

/**
 * Where an unclaimed QR scan lands. Visitors see the name and photo with a
 * "being prepared" note; the buyer signs in with the order email to set it up.
 */
export default async function ClaimMemorialPage({ params }: { params: { code: string } }) {
  const code = params.code
  let service: ReturnType<typeof createServiceRoleClient>
  let row: CodeRow | null = null
  let memorial: MemorialRow | null = null
  try {
    service = createServiceRoleClient()
    row = (
      await service
        .from("partner_memorial_codes")
        .select("id, memorial_id, buyer_email, claimed_at, owner_user_id")
        .eq("code", code)
        .maybeSingle<CodeRow>()
    ).data
    if (row) {
      memorial = (
        await service
          .from("memorials")
          .select("id, slug, full_name, birth_date, death_date, profile_image_url")
          .eq("id", row.memorial_id)
          .maybeSingle<MemorialRow>()
      ).data
    }
  } catch (error) {
    console.error("[claim] lookup failed:", error instanceof Error ? error.message : error)
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <main className="mx-auto max-w-xl px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold text-stone-900">This page is temporarily unavailable</h1>
          <p className="mt-4 text-stone-700">Please try again in a minute.</p>
        </main>
      </div>
    )
  }
  if (!row || !memorial) notFound()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const decision = claimDecision({
    buyerEmail: row.buyer_email,
    userEmail: user?.email ?? null,
    userId: user?.id ?? null,
    claimedBy: row.owner_user_id,
  })

  if (decision === "claim" && user) {
    const now = new Date().toISOString()
    await service.from("memorials").update({ user_id: user.id }).eq("id", row.memorial_id).is("user_id", null)
    await service
      .from("partner_memorial_codes")
      .update({ claimed_at: now, owner_user_id: user.id, updated_at: now })
      .eq("id", row.id)
      .is("owner_user_id", null)
    redirect(`/dashboard/memorial/${row.memorial_id}`)
  }
  if (decision === "already") redirect(`/dashboard/memorial/${row.memorial_id}`)
  if (row.claimed_at) redirect(`/memorial/${encodeURIComponent(memorial.slug || memorial.id)}`)

  const dates = [memorial.birth_date, memorial.death_date].filter((value): value is string => Boolean(value))

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        {memorial.profile_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={memorial.profile_image_url} alt="" className="mx-auto mb-6 h-40 w-40 rounded-full object-cover" />
        ) : null}
        <h1 className="text-4xl font-semibold text-stone-900">{memorial.full_name}</h1>
        {dates.length > 0 ? <p className="mt-3 text-stone-600">{dates.map(formatDate).join(" – ")}</p> : null}
        <p className="mt-8 text-lg text-stone-700">This memorial page is being prepared.</p>
        <p className="mt-2 text-sm text-stone-500">Please check back soon. This QR code will open the finished page.</p>

        <section className="mt-12 rounded-lg border border-stone-200 bg-white p-6 text-left">
          <h2 className="text-lg font-semibold text-stone-900">Did you order this keepsake?</h2>
          {decision === "mismatch" ? (
            <p className="mt-2 text-sm text-stone-700">
              You are signed in as {user?.email}. Only the email address on the order can set up this page.
            </p>
          ) : (
            <p className="mt-2 text-sm text-stone-700">
              We&apos;ll email a sign-in link to the address on the order. Then you can add photos, videos, the story,
              and guestbook messages.
            </p>
          )}
          <ClaimRequestButton code={code} />
          {decision === "mismatch" ? (
            <Button asChild variant="outline" className="mt-4">
              <Link href="/auth/login">Sign in with a different email</Link>
            </Button>
          ) : null}
        </section>
      </main>
    </div>
  )
}
