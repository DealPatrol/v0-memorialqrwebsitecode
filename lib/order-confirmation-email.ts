import { getResend } from "@/lib/resend"
import { SITE_URL, SUPPORT_EMAIL } from "@/lib/site"

export type OrderConfirmationInput = {
  customerEmail: string
  customerName?: string | null
  orderNumber: string
  productName: string
  /** Dollars, e.g. "4.99". */
  amount: string
  /** Dollars per month; "0.00" when no subscription. */
  monthlyFee?: string
  shipsPhysical: boolean
  hostingIncludedUntil?: string | null
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!)
}

/**
 * Sends the order confirmation. Server-only: called from the checkout route after the
 * payment is verified. There is no public HTTP endpoint for this.
 */
export async function sendOrderConfirmationEmail(input: OrderConfirmationInput): Promise<void> {
  const resend = getResend()
  const name = escapeHtml(input.customerName || "Valued Customer")
  const monthly = input.monthlyFee ? Number.parseFloat(input.monthlyFee) : 0
  const hostingLine = input.hostingIncludedUntil
    ? `<p><strong>Memorial Hosting:</strong> 10 years of basic hosting included with your keepsake (through ${new Date(
        input.hostingIncludedUntil,
      ).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}). No monthly fee. You can renew at the monthly rate after that.</p>`
    : monthly > 0
      ? `<p><strong>Monthly Hosting:</strong> $${monthly.toFixed(2)}/month starting next month. Cancel anytime.</p>`
      : ""

  const intro = input.shipsPhysical
    ? "We've received your order. Your keepsake is printed after payment and we'll email tracking when it ships."
    : "We've received your order. Nothing is shipped for this order; your memorial page is online."

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Memorial QR <orders@memorialqr.com>",
    to: [input.customerEmail],
    bcc: [process.env.ADMIN_EMAIL || SUPPORT_EMAIL],
    subject: `Order Confirmation - ${input.orderNumber}`,
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Order Confirmation</title></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Thank You for Your Order!</h1>
  </div>
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px;">Dear ${name},</p>
    <p style="font-size: 16px;">${intro}</p>
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6;">
      <h2 style="color: #8b5cf6; margin-top: 0;">Order Details</h2>
      <p><strong>Order Number:</strong> ${escapeHtml(input.orderNumber)}</p>
      <p><strong>Product:</strong> ${escapeHtml(input.productName)}</p>
      <p><strong>Amount Paid:</strong> $${escapeHtml(input.amount)}</p>
      ${hostingLine}
    </div>
    <p style="font-size: 14px; color: #4c51bf;"><strong>Need Help?</strong> Contact us at ${escapeHtml(
      process.env.ADMIN_EMAIL || SUPPORT_EMAIL,
    )}.</p>
    <p style="font-size: 16px;">With heartfelt sympathy,<br><strong>The Memorial QR Team</strong></p>
  </div>
  <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
    <a href="${SITE_URL}/terms-of-service" style="color: #8b5cf6;">Terms</a> |
    <a href="${SITE_URL}/privacy-policy" style="color: #8b5cf6;">Privacy</a>
  </div>
</body></html>`,
  })
  if (error) throw new Error(`Order confirmation email failed: ${error.message}`)
}
