import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    const result = await resend.emails.send({
      from: "Memorial QR Support <support@memorialsqr.com>",
      to: "support@memorialsQR.com",
      replyTo: email,
      subject: `Support Request from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <tr>
                <td>
                  <h2 style="color: #667eea; margin: 0 0 20px 0; font-size: 24px;">New Support Request</h2>
                  
                  <table width="100%" cellpadding="10" cellspacing="0" style="background: #f8f9fa; border-radius: 6px; margin-bottom: 20px;">
                    <tr>
                      <td style="border-bottom: 1px solid #e9ecef;">
                        <strong style="color: #666;">From:</strong>
                      </td>
                      <td style="border-bottom: 1px solid #e9ecef;">
                        ${name}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong style="color: #666;">Email:</strong>
                      </td>
                      <td>
                        <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                      </td>
                    </tr>
                  </table>
                  
                  <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #667eea;">
                    <p style="margin: 0 0 10px 0; font-weight: 600; color: #666;">Message:</p>
                    <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
                  </div>
                  
                  <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 6px;">
                    <p style="margin: 0; font-size: 14px; color: #0c5460;">
                      💡 <strong>Tip:</strong> Click "Reply" to respond directly to ${name} at ${email}
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true, id: result.id })
  } catch (error) {
    console.error("Support message error:", error)
    return NextResponse.json(
      { error: "Failed to send message", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
