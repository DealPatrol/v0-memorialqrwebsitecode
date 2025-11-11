import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { memorialId, memorialName, memorialUrl, recipientEmail } = body

    if (!recipientEmail || !memorialUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: "Memorial QR <noreply@memorialqr.com>",
      to: recipientEmail,
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
      console.error("[v0] Email send error:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Email API error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
