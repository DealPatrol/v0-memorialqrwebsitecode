import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { memorialId, memorialName, memorialUrl, recipientEmail } = body

    if (!recipientEmail || !memorialUrl) {
      return NextResponse.json({ error: "Missing required fields. Please provide an email address." }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json({ error: "Invalid email address format" }, { status: 400 })
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "Memorial QR <noreply@memorialsqr.com>"

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      replyTo: "support@memorialsQR.com",
      subject: `Memorial for ${memorialName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Memorial for ${memorialName}</h1>
          <p>You've been invited to view and contribute to this memorial page.</p>
          <p>Visit the memorial to:</p>
          <ul>
            <li>View photos and videos</li>
            <li>Read stories and memories</li>
            <li>Leave a message or tribute</li>
            <li>Share your own memories</li>
          </ul>
          <a href="${memorialUrl}" style="display: inline-block; background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Visit Memorial
          </a>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This memorial was created with Memorial QR - Honoring memories that last forever.
          </p>
        </div>
      `,
    })

    if (error) {
      if (error.message?.includes("domain")) {
        return NextResponse.json(
          { error: "Email service configuration error. Please contact support." },
          { status: 500 },
        )
      }
      return NextResponse.json(
        { error: "Failed to send email. Please try again or contact support if the issue persists." },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: "Failed to send email. Please try again later." }, { status: 500 })
  }
}
