import { NextResponse } from "next/server"
import { buildPartnerInquiryEmail, parsePartnerInquiry } from "@/lib/partner-inquiry"
import { getResend } from "@/lib/resend"
import { SUPPORT_EMAIL } from "@/lib/site"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Enter your funeral home and a way to reply." }, { status: 400 })
  }

  const parsed = parsePartnerInquiry(body)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  const notice = buildPartnerInquiryEmail(parsed.value)
  try {
    const resend = getResend()
    const from = process.env.RESEND_FROM_EMAIL || "Memorial QR <orders@memorialqr.com>"
    const { error } = await resend.emails.send({
      from,
      to: notice.to,
      replyTo: parsed.value.email,
      subject: notice.subject,
      html: notice.html,
      text: notice.text,
    })
    if (error) {
      return NextResponse.json({ error: `We could not send that. Email ${SUPPORT_EMAIL} instead.` }, { status: 500 })
    }

    try {
      await resend.emails.send({
        from,
        to: parsed.value.email,
        replyTo: SUPPORT_EMAIL,
        subject: notice.confirmationSubject,
        html: notice.confirmationHtml,
        text: notice.confirmationText,
      })
    } catch (confirmationError) {
      console.error("[partners] Confirmation email failed:", confirmationError)
    }
  } catch (error) {
    console.error("[partners] Inquiry email failed:", error)
    return NextResponse.json({ error: `We could not send that. Email ${SUPPORT_EMAIL} instead.` }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
