import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert([
        {
          email: email.toLowerCase().trim(),
          subscribed_at: new Date().toISOString(),
          status: "active",
        },
      ])
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Email already subscribed" }, { status: 400 })
      }
      throw error
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Memorial QR <noreply@memorialqr.com>",
      to: email,
      subject: "Welcome to Memorial QR Blog Newsletter",
      html: `
        <h1>Welcome to Memorial QR!</h1>
        <p>Thank you for subscribing to our blog newsletter.</p>
        <p>You'll receive:</p>
        <ul>
          <li>Helpful memorial guides and tips</li>
          <li>Grief support resources</li>
          <li>Product updates and ideas</li>
          <li>Special offers for subscribers</li>
        </ul>
        <p>Your first newsletter will arrive soon!</p>
        <hr>
        <p style="font-size: 12px; color: #666;">
          You can unsubscribe at any time by clicking the link in our emails.
        </p>
      `,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Newsletter subscribe error:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}
