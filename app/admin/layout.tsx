import type React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { currentAdminEmail } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await currentAdminEmail()
  if (!admin) redirect("/auth/login")
  return <>{children}</>
}
