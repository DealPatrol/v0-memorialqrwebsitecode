import { notFound } from "next/navigation"

// Square test page. It must never be reachable on the production site.
export const dynamic = "force-dynamic"

export default function TestSquarePage() {
  if (process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production") {
    notFound()
  }
  return null
}
