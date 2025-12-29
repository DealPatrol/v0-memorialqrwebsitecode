import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, orderDetails, customerName } = await request.json()

    if (!email || !orderDetails) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Memorial QR <orders@memorialqr.com>",
      to: [email],
      subject: "Order Confirmation - Memorial QR",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Thank You for Your Order!</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Dear ${customerName || "Valued Customer"},</p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                We've received your order and are preparing your memorial products with care. You'll receive another email with tracking information once your order ships.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6;">
                <h2 style="color: #8b5cf6; margin-top: 0;">Order Details</h2>
                ${orderDetails}
              </div>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                <strong>Next Steps:</strong>
              </p>
              <ol style="font-size: 16px; padding-left: 20px;">
                <li style="margin-bottom: 10px;">You'll receive an email with your memorial dashboard login credentials within 24 hours</li>
                <li style="margin-bottom: 10px;">Start uploading photos, videos, and memories to create your digital memorial</li>
                <li style="margin-bottom: 10px;">Your physical memorial products will ship within 3-5 business days</li>
              </ol>
              
              <div style="background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #4c51bf;">
                  <strong>Need Help?</strong> Contact us at ${process.env.ADMIN_EMAIL || "support@memorialqr.com"} or visit our FAQ page.
                </p>
              </div>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                With heartfelt sympathy,<br>
                <strong>The Memorial QR Team</strong>
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
              <p style="margin: 5px 0;">&copy; 2025 Memorial QR. All rights reserved.</p>
              <p style="margin: 5px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/terms-of-service" style="color: #8b5cf6; text-decoration: none;">Terms</a> | 
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/privacy-policy" style="color: #8b5cf6; text-decoration: none;">Privacy</a>
              </p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error("Email send error:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Order confirmation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
