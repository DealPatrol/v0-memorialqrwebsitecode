import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderEmailData {
  customerName: string
  customerEmail: string
  orderNumber: string
  orderDate: string
  productName: string
  amount: string
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    zip: string
  }
  isGift?: boolean
  giftMessage?: string
  recipientName?: string
  recipientEmail?: string
}

interface WelcomeEmailData {
  customerName: string
  customerEmail: string
  memorialName: string
  memorialUrl: string
  dashboardUrl: string
  qrCodeUrl?: string
}

interface PasswordResetEmailData {
  email: string
  resetUrl: string
}

const getEmailHeaders = () => ({
  "X-Entity-Ref-ID": `memorial-qr-${Date.now()}`,
  "List-Unsubscribe": "<mailto:unsubscribe@memorialsqr.com>",
  "X-Priority": "3",
  "X-Mailer": "Memorial QR Email System",
  Importance: "normal",
})

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    const plainText = `
Hi ${data.customerName},

${data.isGift ? `Thank you for your thoughtful gift order! We've received your payment and are processing the memorial QR code plaque for ${data.recipientName}.` : "Thank you for your order! We've received your payment and are processing your memorial QR code plaque."}

ORDER DETAILS
Order Number: ${data.orderNumber}
Order Date: ${data.orderDate}
Product: ${data.productName}
Total: ${data.amount}

SHIPPING ADDRESS
${data.shippingAddress.line1}
${data.shippingAddress.line2 ? `${data.shippingAddress.line2}\n` : ""}${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}

${data.isGift ? "The recipient will receive instructions for creating their memorial page. Your gift will ship within 5-7 business days." : "You'll receive another email shortly with your memorial page link and instructions for managing your memorial."}

If you have any questions, please contact us at support@memorialsQR.com

Best regards,
The Memorial QR Team

Memorial QR - Creating Lasting Digital Memorials
    `.trim()

    await resend.emails.send({
      from: "Memorial QR Orders <orders@memorialsqr.com>",
      to: data.customerEmail,
      replyTo: "support@memorialsqr.com",
      subject: data.isGift
        ? `Gift Order Confirmation - ${data.orderNumber}`
        : `Order Confirmation - ${data.orderNumber}`,
      headers: getEmailHeaders(),
      text: plainText,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="color-scheme" content="light">
            <meta name="supported-color-schemes" content="light">
            <title>Order Confirmation</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                        ${data.isGift ? '<div style="font-size: 48px; margin-bottom: 10px;">🎁</div>' : ""}
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Memorial QR</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">${data.isGift ? "Gift Order Confirmed!" : "Order Confirmed!"}</p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="font-size: 16px; margin: 0 0 20px 0; color: #333;">Hi ${data.customerName},</p>
                        
                        <p style="font-size: 16px; margin: 0 0 20px 0; color: #333; line-height: 1.6;">
                          ${
                            data.isGift
                              ? `Thank you for your thoughtful gift order! We've received your payment and are processing the memorial QR code plaque for ${data.recipientName}.`
                              : "Thank you for your order! We've received your payment and are processing your memorial QR code plaque."
                          }
                        </p>
                        
                        ${
                          data.isGift && data.recipientEmail
                            ? `
                        <!-- Gift Recipient Info -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background: #e8f4f8; border-left: 4px solid #667eea; border-radius: 4px; margin: 20px 0;">
                          <tr>
                            <td style="padding: 16px 20px;">
                              <p style="margin: 0 0 8px 0; font-size: 14px; color: #0c5460; font-weight: 600;">Gift Recipient:</p>
                              <p style="margin: 0; font-size: 14px; color: #0c5460; line-height: 1.5;">
                                ${data.recipientName} (${data.recipientEmail}) will receive a notification email about their gift.
                              </p>
                            </td>
                          </tr>
                        </table>
                        `
                            : ""
                        }
                        
                        <!-- Order Details -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; border-radius: 8px; margin: 20px 0; overflow: hidden;">
                          <tr>
                            <td style="padding: 20px;">
                              <h2 style="color: #667eea; margin: 0 0 15px 0; font-size: 18px;">Order Details</h2>
                              <table width="100%" cellpadding="8" cellspacing="0">
                                <tr>
                                  <td style="border-bottom: 1px solid #e9ecef; color: #666; font-size: 14px;"><strong>Order Number:</strong></td>
                                  <td style="border-bottom: 1px solid #e9ecef; text-align: right; font-size: 14px;">${data.orderNumber}</td>
                                </tr>
                                <tr>
                                  <td style="border-bottom: 1px solid #e9ecef; color: #666; font-size: 14px;"><strong>Order Date:</strong></td>
                                  <td style="border-bottom: 1px solid #e9ecef; text-align: right; font-size: 14px;">${data.orderDate}</td>
                                </tr>
                                <tr>
                                  <td style="border-bottom: 1px solid #e9ecef; color: #666; font-size: 14px;"><strong>Product:</strong></td>
                                  <td style="border-bottom: 1px solid #e9ecef; text-align: right; font-size: 14px;">${data.productName}</td>
                                </tr>
                                <tr>
                                  <td style="padding-top: 8px; color: #666; font-size: 14px;"><strong>Total:</strong></td>
                                  <td style="padding-top: 8px; text-align: right; font-size: 18px; color: #667eea;"><strong>${data.amount}</strong></td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Shipping Address -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; border-radius: 8px; margin: 20px 0; overflow: hidden;">
                          <tr>
                            <td style="padding: 20px;">
                              <h3 style="color: #667eea; margin: 0 0 10px 0; font-size: 16px;">Shipping Address</h3>
                              <p style="margin: 5px 0; font-size: 14px; color: #333;">${data.shippingAddress.line1}</p>
                              ${data.shippingAddress.line2 ? `<p style="margin: 5px 0; font-size: 14px; color: #333;">${data.shippingAddress.line2}</p>` : ""}
                              <p style="margin: 5px 0; font-size: 14px; color: #333;">${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}</p>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Next Steps -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background: #e8f4f8; border-left: 4px solid #667eea; border-radius: 4px; margin: 20px 0;">
                          <tr>
                            <td style="padding: 16px 20px;">
                              <p style="margin: 0 0 8px 0; font-size: 14px; color: #0c5460; font-weight: 600;">Next Steps:</p>
                              <p style="margin: 0; font-size: 14px; color: #0c5460; line-height: 1.5;">
                                ${
                                  data.isGift
                                    ? "The recipient will receive instructions for creating their memorial page. Your gift will ship within 5-7 business days."
                                    : "You'll receive another email shortly with your memorial page link and instructions for managing your memorial."
                                }
                              </p>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="font-size: 14px; color: #666; margin: 30px 0 10px 0; line-height: 1.5;">
                          If you have any questions, please don't hesitate to contact us at <a href="mailto:support@memorialsQR.com" style="color: #667eea; text-decoration: none;">support@memorialsQR.com</a>
                        </p>
                        
                        <p style="font-size: 16px; margin: 30px 0 0 0; color: #333;">
                          Best regards,<br>
                          <strong>The Memorial QR Team</strong>
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">
                          Memorial QR - Creating Lasting Digital Memorials
                        </p>
                        <p style="margin: 0; font-size: 13px; color: #999;">
                          This is an automated message from a trusted sender.
                        </p>
                        <p style="margin: 10px 0 0 0; font-size: 13px; color: #999;">
                          <a href="mailto:support@memorialsQR.com" style="color: #667eea; text-decoration: none;">Contact Support</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })
    console.log("[v0] Order confirmation email sent to:", data.customerEmail)

    if (data.isGift && data.recipientEmail && data.recipientName) {
      await sendGiftNotificationEmail({
        recipientName: data.recipientName,
        recipientEmail: data.recipientEmail,
        senderName: data.customerName,
        giftMessage: data.giftMessage,
        productName: data.productName,
        orderNumber: data.orderNumber,
      })
    }
  } catch (error) {
    console.error("[v0] Error sending order confirmation email:", error)
    throw error
  }
}

export async function sendAdminOrderNotification(data: OrderEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) {
    console.warn("[v0] ADMIN_EMAIL not configured, skipping admin notification")
    return
  }

  try {
    await resend.emails.send({
      from: "Memorial QR System <system@memorialsqr.com>",
      to: adminEmail,
      subject: `New Order: ${data.orderNumber}`,
      headers: getEmailHeaders(),
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>New Order Received</h2>
            <p><strong>Order Number:</strong> ${data.orderNumber}</p>
            <p><strong>Customer:</strong> ${data.customerName}</p>
            <p><strong>Email:</strong> ${data.customerEmail}</p>
            <p><strong>Product:</strong> ${data.productName}</p>
            <p><strong>Amount:</strong> ${data.amount}</p>
            <p><strong>Shipping Address:</strong><br>
            ${data.shippingAddress.line1}<br>
            ${data.shippingAddress.line2 ? `${data.shippingAddress.line2}<br>` : ""}
            ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}</p>
          </body>
        </html>
      `,
    })
    console.log("[v0] Admin notification email sent")
  } catch (error) {
    console.error("[v0] Error sending admin notification email:", error)
    throw error
  }
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  try {
    await resend.emails.send({
      from: "Memorial QR <noreply@memorialsqr.com>",
      to: data.customerEmail,
      subject: `Welcome to Your Memorial - ${data.memorialName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Your Memorial is Ready!</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hi ${data.customerName},</p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">Your memorial page for <strong>${data.memorialName}</strong> has been created and is now live!</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <h2 style="color: #667eea; margin-top: 0;">Memorial Page</h2>
                <p style="margin: 15px 0;">Visit your memorial page at:</p>
                <a href="${data.memorialUrl}" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 0;">View Memorial</a>
                <p style="margin: 15px 0; font-size: 14px; color: #666; word-break: break-all;">${data.memorialUrl}</p>
              </div>
              
              ${
                data.qrCodeUrl
                  ? `
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <h3 style="color: #667eea; margin-top: 0;">Your QR Code</h3>
                <img src="${data.qrCodeUrl}" alt="Memorial QR Code" style="max-width: 250px; height: auto; margin: 15px 0;" />
                <p style="margin: 10px 0; font-size: 14px; color: #666;">Scan this code to visit the memorial page</p>
              </div>
              `
                  : ""
              }
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #667eea; margin-top: 0;">Manage Your Memorial</h3>
                <p style="margin: 10px 0;">Access your dashboard to:</p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Download your QR code</li>
                  <li>Moderate photos, messages, and stories</li>
                  <li>View memorial statistics</li>
                  <li>Update memorial information</li>
                </ul>
                <a href="${data.dashboardUrl}" style="display: inline-block; background: #764ba2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 0;">Go to Dashboard</a>
              </div>
              
              <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <p style="margin: 0; font-size: 14px;"><strong>Share Your Memorial:</strong></p>
                <p style="margin: 10px 0 0 0; font-size: 14px;">Share the memorial link with family and friends so they can leave messages, photos, and stories.</p>
              </div>
              
              <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <p style="margin: 0; font-size: 14px;"><strong>Your Physical Plaque:</strong></p>
                <p style="margin: 10px 0 0 0; font-size: 14px;">Your QR code plaque will be shipped within 3-5 business days. You'll receive a tracking number once it ships.</p>
              </div>
              
              <p style="font-size: 14px; color: #666; margin-top: 30px;">If you have any questions or need assistance, please don't hesitate to contact us.</p>
              
              <p style="font-size: 16px; margin-top: 20px;">With sympathy and support,<br><strong>The Memorial QR Team</strong></p>
            </div>
          </body>
        </html>
      `,
    })
    console.log("[v0] Welcome email sent to:", data.customerEmail)
  } catch (error) {
    console.error("[v0] Error sending welcome email:", error)
    throw error
  }
}

export async function sendPasswordResetEmail(data: PasswordResetEmailData) {
  try {
    const plainText = `
Hello,

We received a request to reset the password for your Memorial QR account associated with this email address.

Click the link below to create a new password:
${data.resetUrl}

SECURITY NOTICE
This password reset link will expire in 1 hour for your security. If you didn't request this reset, please ignore this email or contact our support team.

Best regards,
The Memorial QR Team

Memorial QR - Creating Lasting Digital Memorials
Need help? Contact us at support@memorialsQR.com
    `.trim()

    await resend.emails.send({
      from: "Memorial QR Support <support@memorialsQR.com>",
      to: data.email,
      replyTo: "support@memorialsQR.com",
      subject: "Reset Your Memorial QR Password",
      headers: getEmailHeaders(),
      text: plainText,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Memorial QR</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Password Reset Request</p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="font-size: 16px; margin: 0 0 20px 0; color: #333;">Hello,</p>
                        
                        <p style="font-size: 16px; margin: 0 0 20px 0; color: #333; line-height: 1.6;">
                          We received a request to reset the password for your Memorial QR account associated with this email address.
                        </p>
                        
                        <p style="font-size: 16px; margin: 0 0 30px 0; color: #333; line-height: 1.6;">
                          Click the button below to create a new password:
                        </p>
                        
                        <!-- Button -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" style="padding: 0 0 30px 0;">
                              <a href="${data.resetUrl}" style="display: inline-block; background: #667eea; color: white; padding: 16px 48px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">Reset My Password</a>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Alternative Link -->
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 0 0 30px 0;">
                          <p style="font-size: 14px; margin: 0 0 10px 0; color: #666; font-weight: 600;">Or copy and paste this link:</p>
                          <p style="font-size: 13px; color: #667eea; word-break: break-all; margin: 0; line-height: 1.5;">${data.resetUrl}</p>
                        </div>
                        
                        <!-- Security Notice -->
                        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 16px 20px; border-radius: 4px; margin: 0 0 30px 0;">
                          <p style="margin: 0 0 8px 0; font-size: 14px; color: #856404; font-weight: 600;">Security Notice</p>
                          <p style="margin: 0; font-size: 14px; color: #856404; line-height: 1.5;">
                            This password reset link will expire in <strong>1 hour</strong> for your security. If you didn't request this reset, please ignore this email or contact our support team.
                          </p>
                        </div>
                        
                        <p style="font-size: 14px; color: #666; margin: 0 0 10px 0; line-height: 1.5;">
                          If you're having trouble with the button above, copy and paste the link into your web browser.
                        </p>
                        
                        <p style="font-size: 16px; margin: 30px 0 0 0; color: #333;">
                          Best regards,<br>
                          <strong>The Memorial QR Team</strong>
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">
                          Memorial QR - Creating Lasting Digital Memorials
                        </p>
                        <p style="margin: 0; font-size: 13px; color: #999;">
                          This is an automated message from a trusted sender.
                        </p>
                        <p style="margin: 10px 0 0 0; font-size: 13px; color: #999;">
                          Need help? Contact us at <a href="mailto:support@memorialsQR.com" style="color: #667eea; text-decoration: none;">support@memorialsQR.com</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })
    console.log("[v0] Password reset email sent to:", data.email)
  } catch (error) {
    console.error("[v0] Error sending password reset email:", error)
    throw error
  }
}

export async function sendGiftNotificationEmail(data: {
  recipientName: string
  recipientEmail: string
  senderName: string
  giftMessage?: string
  productName: string
  orderNumber: string
}) {
  try {
    const plainText = `
Hi ${data.recipientName},

${data.senderName} has sent you a thoughtful gift from Memorial QR: ${data.productName}

${data.giftMessage ? `PERSONAL MESSAGE:\n"${data.giftMessage}"\n\n` : ""}WHAT'S INCLUDED
- Digital Memorial Website with lifetime hosting
- Beautiful QR code memorial plaque
- Luxury presentation box
- Free shipping to your address

NEXT STEPS
Your gift will arrive within 5-7 business days. You'll receive another email with instructions on how to create and customize your memorial page.

If you have any questions about your gift, please contact us at support@memorialsQR.com

Order Reference: ${data.orderNumber}

With sympathy and support,
The Memorial QR Team

Memorial QR - Creating Lasting Digital Memorials
    `.trim()

    await resend.emails.send({
      from: "Memorial QR Gifts <gifts@memorialsqr.com>",
      to: data.recipientEmail,
      replyTo: "support@memorialsQR.com",
      subject: `${data.senderName} sent you a Memorial QR Gift`,
      headers: getEmailHeaders(),
      text: plainText,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="color-scheme" content="light">
            <meta name="supported-color-schemes" content="light">
            <title>You've Received a Gift</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 10px;">🎁</div>
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">You've Received a Gift!</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">From ${data.senderName}</p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="font-size: 16px; margin: 0 0 20px 0; color: #333;">Hi ${data.recipientName},</p>
                        
                        <p style="font-size: 16px; margin: 0 0 20px 0; color: #333; line-height: 1.6;">
                          ${data.senderName} has sent you a thoughtful gift from Memorial QR: <strong>${data.productName}</strong>
                        </p>
                        
                        ${
                          data.giftMessage
                            ? `
                        <!-- Gift Message -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; border-left: 4px solid #667eea; border-radius: 4px; margin: 20px 0;">
                          <tr>
                            <td style="padding: 20px;">
                              <p style="margin: 0 0 8px 0; font-size: 14px; color: #0c5460; font-weight: 600;">Personal Message:</p>
                              <p style="margin: 0; font-size: 15px; color: #333; line-height: 1.6; font-style: italic;">
                                "${data.giftMessage}"
                              </p>
                            </td>
                          </tr>
                        </table>
                        `
                            : ""
                        }
                        
                        <!-- What's Included -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; border-radius: 8px; margin: 20px 0; overflow: hidden;">
                          <tr>
                            <td style="padding: 20px;">
                              <h2 style="color: #667eea; margin: 0 0 15px 0; font-size: 18px;">What's Included</h2>
                              <ul style="margin: 0; padding-left: 20px; color: #333; font-size: 14px; line-height: 1.8;">
                                <li>Digital Memorial Website with lifetime hosting</li>
                                <li>Beautiful QR code memorial plaque</li>
                                <li>Luxury presentation box</li>
                              </ul>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Next Steps -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background: #e8f4f8; border-left: 4px solid #667eea; border-radius: 4px; margin: 20px 0;">
                          <tr>
                            <td style="padding: 16px 20px;">
                              <p style="margin: 0 0 8px 0; font-size: 14px; color: #0c5460; font-weight: 600;">Next Steps:</p>
                              <p style="margin: 0; font-size: 14px; color: #0c5460; line-height: 1.5;">
                                Your gift will arrive within 5-7 business days. You'll receive another email with instructions on how to create and customize your memorial page.
                              </p>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="font-size: 14px; color: #666; margin: 30px 0 10px 0; line-height: 1.5;">
                          If you have any questions about your gift, please contact us at <a href="mailto:support@memorialsQR.com" style="color: #667eea; text-decoration: none;">support@memorialsQR.com</a>
                        </p>
                        
                        <p style="margin: 10px 0 0 0; font-size: 13px; color: #999;">
                          Order Reference: ${data.orderNumber}
                        </p>
                        
                        <p style="font-size: 16px; margin: 30px 0 0 0; color: #333;">
                          With sympathy and support,<br>
                          <strong>The Memorial QR Team</strong>
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">
                          Memorial QR - Creating Lasting Digital Memorials
                        </p>
                        <p style="margin: 0; font-size: 13px; color: #999;">
                          This is an automated message from a trusted sender.
                        </p>
                        <p style="margin: 10px 0 0 0; font-size: 13px; color: #999;">
                          <a href="mailto:support@memorialsQR.com" style="color: #667eea; text-decoration: none;">Contact Support</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })
    console.log("[v0] Gift notification email sent to:", data.recipientEmail)
  } catch (error) {
    console.error("[v0] Error sending gift notification email:", error)
    throw error
  }
}

export async function sendEmail(options: {
  to: string
  subject: string
  html: string
  from?: string
  replyTo?: string
}) {
  try {
    await resend.emails.send({
      from: options.from || "Memorial QR <noreply@memorialsqr.com>",
      to: options.to,
      replyTo: options.replyTo,
      subject: options.subject,
      headers: getEmailHeaders(),
      html: options.html,
    })
    console.log("[v0] Email sent to:", options.to)
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    throw error
  }
}
