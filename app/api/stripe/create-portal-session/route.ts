import { type NextRequest, NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://memorialsqr.com"

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe()
    const data = await req.formData()
    const session_id = data.get("session_id") as string

    if (!session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 })
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id)

    if (!checkoutSession.customer) {
      return NextResponse.json({ error: "No customer found for this session" }, { status: 400 })
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer as string,
      return_url: `${SITE_URL}/subscribe`,
    })

    return NextResponse.redirect(portalSession.url, 303)
  } catch (error) {
    console.error("[stripe] create-portal-session error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create portal session" },
      { status: 500 },
    )
  }
}
