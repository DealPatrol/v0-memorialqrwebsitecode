import { createClient } from "@/lib/supabase/server"
import { isAdminEmail } from "@/lib/admin-emails"

/** Returns the signed-in admin's email, or null when the visitor is not an admin. */
export async function currentAdminEmail(): Promise<string | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user?.email || !user.email_confirmed_at) return null
    return isAdminEmail(user.email) ? user.email : null
  } catch {
    return null
  }
}

export class AdminRequiredError extends Error {
  constructor() {
    super("Admin access required")
  }
}

export async function requireAdmin(): Promise<string> {
  const email = await currentAdminEmail()
  if (!email) throw new AdminRequiredError()
  return email
}
