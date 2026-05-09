import { type NextRequest, NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://memorialsqr.com"

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe()
    const data = await req.formData()
    const lookup_key = data.get("lookup_key") as string

    if (!lookup_key) {
      return NextResponse.json({ error: "Missing lookup_key" }, { status: 400 })
    }

    const prices = await stripe.prices.list({
      lookup_keys: [lookup_key],
      expand: ["data.product"],
    })

    if (!prices.data.length) {
      return NextResponse.json(
        { error: `No price found for lookup_key: ${lookup_key}` },
        { status: 400 },
      )
    }

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      line_items: [{ price: prices.data[0].id, quantity: 1 }],
      mode: "subscription",
      success_url: `${SITE_URL}/subscribe?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/subscribe?canceled=true`,
    })

    return NextResponse.redirect(session.url!, 303)
  } catch (error) {
    console.error("[stripe] create-checkout-session error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create checkout session" },
      { status: 500 },
    )
  }
}
