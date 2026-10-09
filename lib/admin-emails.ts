/** Emails allowed into /admin and admin APIs. Pure so it can be unit tested. */
export function adminEmails(env: Record<string, string | undefined> = process.env): string[] {
  const raw = [env.ADMIN_EMAILS, env.ADMIN_EMAIL, env.NEXT_PUBLIC_ADMIN_EMAIL].filter(Boolean).join(",")
  return [...new Set(raw.split(",").map((value) => value.trim().toLowerCase()).filter((value) => value.includes("@")))]
}

export function isAdminEmail(email: string | null | undefined, env: Record<string, string | undefined> = process.env) {
  if (!email) return false
  return adminEmails(env).includes(email.trim().toLowerCase())
}
