import { NextResponse } from "next/server"
import { buildGuideEmail, parseGuideEmail } from "@/lib/memorial-guide"
import { getResend } from "@/lib/resend"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { SUPPORT_EMAIL } from "@/lib/site"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Enter an email address." }, { status: 400 })
  }

  const parsed = parseGuideEmail(body)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  const email = parsed.email.toLowerCase()
  try {
    const supabase = createServiceRoleClient()
    const { error } = await supabase.from("newsletter_subscribers").insert({
      email,
      status: "active",
    })
    if (error && error.code !== "23505") {
      console.error("[guide] Could not store the address:", error)
    }
  } catch (error) {
    console.error("[guide] Subscriber storage unavailable:", error)
  }

  try {
    const resend = getResend()
    const from = process.env.RESEND_FROM_EMAIL || "Memorial QR <orders@memorialqr.com>"
    const guide = buildGuideEmail(email)
    const { error } = await resend.emails.send({
      from,
      to: email,
      replyTo: SUPPORT_EMAIL,
      subject: guide.subject,
      html: guide.html,
      text: guide.text,
    })
    if (error) {
      return NextResponse.json({ error: `We could not send the guide. Email ${SUPPORT_EMAIL} instead.` }, { status: 500 })
    }
  } catch (error) {
    console.error("[guide] Email failed:", error)
    return NextResponse.json({ error: `We could not send the guide. Email ${SUPPORT_EMAIL} instead.` }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
