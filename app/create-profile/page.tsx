import { redirect } from "next/navigation"

/**
 * This older form only simulated memorial creation, so photos and videos picked
 * here were silently dropped. Send visitors to the real flow instead.
 */
export default function CreateProfilePage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const params = new URLSearchParams()
  const plan = typeof searchParams.plan === "string" ? searchParams.plan : null
  if (plan === "free") params.set("plan", "free")
  const query = params.toString()
  redirect(`/create-memorial${query ? `?${query}` : ""}`)
}
