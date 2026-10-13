import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { emailsMatch } from "@/lib/partner-memorials"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { ClaimRequestButton } from "./claim-request-button"

export const dynamic = "force-dynamic"

export default async function ClaimMemorialPage({ params }: { params: { code: string } }) {
  const code = params.code
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let row: { id: string; memorial_id: string; buyer_email: string; claimed_at: string | null; owner_user_id: string | null } | null =
    null
  try {
    const service = createServiceRoleClient()
    const { data } = await service
      .from("partner_memorial_codes")
      .select("id, memorial_id, buyer_email, claimed_at, owner_user_id")
      .eq("code", code)
      .maybeSingle()
    row = data
  } catch {
    row = null
  }

  if (!row) notFound()

  if (user?.email && emailsMatch(user.email, row.buyer_email)) {
    if (!row.claimed_at || row.owner_user_id !== user.id) {
      const service = createServiceRoleClient()
      await service.from("memorials").update({ user_id: user.id }).eq("id", row.memorial_id)
      await service
        .from("partner_memorial_codes")
        .update({ claimed_at: new Date().toISOString(), owner_user_id: user.id, updated_at: new Date().toISOString() })
        .eq("id", row.id)
    }
    redirect(`/dashboard/memorial/${row.memorial_id}`)
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold text-stone-900">Claim this memorial</h1>
        {user?.email ? (
          <p className="mt-4 text-stone-700">
            You are signed in as {user.email}. This memorial belongs to the email on the order.
          </p>
        ) : (
          <>
            <p className="mt-4 text-stone-700">
              We will email a sign-in link to the address on the order. After you open it, you can add photos, videos,
              the story, and guestbook messages.
            </p>
            <ClaimRequestButton code={code} />
          </>
        )}
        <p className="mt-8 text-sm text-stone-500">
          <Link href={`/q/${code}`} className="underline">
            View the memorial page
          </Link>
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/auth/login">Sign in with a different email</Link>
        </Button>
      </main>
    </div>
  )
}
