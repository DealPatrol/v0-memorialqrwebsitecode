import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { ConciergeAdminDashboard } from "@/components/concierge-admin-dashboard"

export const metadata: Metadata = {
  title: "Concierge Admin Dashboard | Memorial QR",
}

export default async function AdminConciergePagePage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin (you can add this check to your profiles table)
  // For now, we'll allow access - add admin role check as needed

  // Fetch all concierge requests
  const { data: requests, error } = await supabase
    .from("concierge_requests")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching requests:", error)
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Concierge Admin Dashboard</h1>
        <ConciergeAdminDashboard initialRequests={requests || []} />
      </div>
    </div>
  )
}
