import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { conciergeRequestId, subject, body, recipientEmail } = await request.json()

    // Send email via Resend
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Memorial QR <noreply@memorialqr.com>',
      to: recipientEmail,
      subject,
      html: body,
    })

    if (result.error) {
      console.error('Resend error:', result.error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    // Log email activity (optional - could be stored in database)
    console.log(`[v0] Email sent to ${recipientEmail} for request ${conciergeRequestId}`)

    return NextResponse.json({ success: true, emailId: result.data?.id })
  } catch (error) {
    console.error('Error sending concierge email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
