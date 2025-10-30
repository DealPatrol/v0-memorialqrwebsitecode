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

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    await resend.emails.send({
      from: "Memorial QR <orders@memorialqr.com>",
      to: data.customerEmail,
      subject: `Order Confirmation - ${data.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed!</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hi ${data.customerName},</p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">Thank you for your order! We've received your payment and are processing your memorial QR code plaque.</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #667eea; margin-top: 0;">Order Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Order Number:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${data.orderNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Order Date:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${data.orderDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Product:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${data.productName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Total:</strong></td>
                    <td style="padding: 8px 0; text-align: right; font-size: 18px; color: #667eea;"><strong>${data.amount}</strong></td>
                  </tr>
                </table>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #667eea; margin-top: 0;">Shipping Address</h3>
                <p style="margin: 5px 0;">${data.shippingAddress.line1}</p>
                ${data.shippingAddress.line2 ? `<p style="margin: 5px 0;">${data.shippingAddress.line2}</p>` : ""}
                <p style="margin: 5px 0;">${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}</p>
              </div>
              
              <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <p style="margin: 0; font-size: 14px;"><strong>Next Steps:</strong></p>
                <p style="margin: 10px 0 0 0; font-size: 14px;">You'll receive another email shortly with your memorial page link and instructions for managing your memorial.</p>
              </div>
              
              <p style="font-size: 14px; color: #666; margin-top: 30px;">If you have any questions, please don't hesitate to contact us.</p>
              
              <p style="font-size: 16px; margin-top: 20px;">Best regards,<br><strong>The Memorial QR Team</strong></p>
            </div>
          </body>
        </html>
      `,
    })
    console.log("[v0] Order confirmation email sent to:", data.customerEmail)
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
      from: "Memorial QR <orders@memorialqr.com>",
      to: adminEmail,
      subject: `New Order: ${data.orderNumber}`,
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
      from: "Memorial QR <welcome@memorialqr.com>",
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
    await resend.emails.send({
      from: "Memorial QR <noreply@memorialqr.com>",
      to: data.email,
      subject: "Reset Your Password - Memorial QR",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Reset Your Password</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hi there,</p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">We received a request to reset your password for your Memorial QR account.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.resetUrl}" style="display: inline-block; background: #667eea; color: white; padding: 14px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Reset Password</a>
              </div>
              
              <p style="font-size: 14px; color: #666; margin: 20px 0;">Or copy and paste this link into your browser:</p>
              <p style="font-size: 14px; color: #667eea; word-break: break-all; background: white; padding: 10px; border-radius: 5px;">${data.resetUrl}</p>
              
              <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <p style="margin: 0; font-size: 14px;"><strong>Security Notice:</strong></p>
                <p style="margin: 10px 0 0 0; font-size: 14px;">This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
              </div>
              
              <p style="font-size: 14px; color: #666; margin-top: 30px;">If you're having trouble clicking the button, copy and paste the URL above into your web browser.</p>
              
              <p style="font-size: 16px; margin-top: 20px;">Best regards,<br><strong>The Memorial QR Team</strong></p>
            </div>
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
