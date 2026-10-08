import type { ConfiguredLine } from "@/lib/fulfillment-availability"
import { getResend } from "@/lib/resend"
import { SUPPORT_EMAIL } from "@/lib/site"

export type ManualOrderRecord = {
  order_number: string
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  shipping_address_line1: string | null
  shipping_address_line2: string | null
  shipping_city: string | null
  shipping_state: string | null
  shipping_zip: string | null
  special_instructions: string | null
  payment_id?: string | null
  amount_cents?: number | null
  admin_notes?: string | null
}

export type ManualFulfillmentNotice = {
  to: string[]
  subject: string
  html: string
  text: string
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!)
}

/** Support always receives the make-and-ship email. ADMIN_EMAIL is added when it is a different inbox. */
export function manualFulfillmentRecipients(env: Record<string, string | undefined>): string[] {
  const support = SUPPORT_EMAIL
  const admin = env.ADMIN_EMAIL?.trim()
  if (admin && admin.toLowerCase() !== support.toLowerCase()) return [support, admin]
  return [support]
}

export function buildManualFulfillmentNotice(
  input: {
    order: ManualOrderRecord
    lines: ConfiguredLine[]
    memorialUrl: string | null
    printFileUrl: string | null
    memorialError: string | null
  },
  env: Record<string, string | undefined> = process.env,
): ManualFulfillmentNotice {
  const order = input.order
  const to = manualFulfillmentRecipients(env)
  const amount =
    typeof order.amount_cents === "number" ? `$${(order.amount_cents / 100).toFixed(2)}` : "see the order row"
  const lines = input.lines
    .map((line) => `${line.name} (${line.id}) × ${line.quantity} at $${line.price.toFixed(2)} each`)
    .join("\n")
  const address = [
    order.customer_name,
    order.shipping_address_line1,
    order.shipping_address_line2,
    [order.shipping_city, order.shipping_state, order.shipping_zip].filter(Boolean).join(", "),
    "US",
  ]
    .filter((line) => line && line.trim())
    .join("\n")

  const text = [
    `Make and ship order ${order.order_number}.`,
    "This order was paid through Square. No Printful or Printify order was placed.",
    "",
    `Order number: ${order.order_number}`,
    `Payment id: ${order.payment_id || "not recorded"}`,
    `Amount paid: ${amount}`,
    "",
    "Items:",
    lines || "No line items recorded",
    "",
    "Ship to:",
    address || "No shipping address recorded",
    "",
    `Customer email: ${order.customer_email || "not recorded"}`,
    `Customer phone: ${order.customer_phone || "not recorded"}`,
    "",
    "Order notes:",
    order.special_instructions?.trim() || "None",
    ...(order.admin_notes?.trim() ? ["", "Attribution:", order.admin_notes.trim(), ""] : [""]),
    `Memorial page: ${input.memorialUrl || "not created"}`,
    `QR image: ${input.printFileUrl || "not created"}`,
    input.memorialError ? `Memorial error: ${input.memorialError}` : "",
    "",
    "Fulfillment: manual. Make the keepsake and ship it to the address above.",
  ]
    .filter((line) => line !== "")
    .join("\n")

  const html = `<p><strong>Make and ship order ${escapeHtml(order.order_number)}.</strong></p>
<p>This order was paid through Square. No Printful or Printify order was placed.</p>
<ul>
  <li>Order number: ${escapeHtml(order.order_number)}</li>
  <li>Payment id: ${escapeHtml(order.payment_id || "not recorded")}</li>
  <li>Amount paid: ${escapeHtml(amount)}</li>
  <li>Customer email: ${escapeHtml(order.customer_email || "not recorded")}</li>
  <li>Customer phone: ${escapeHtml(order.customer_phone || "not recorded")}</li>
</ul>
<p><strong>Items</strong></p>
<pre>${escapeHtml(lines || "No line items recorded")}</pre>
<p><strong>Ship to</strong></p>
<pre>${escapeHtml(address || "No shipping address recorded")}</pre>
<p><strong>Order notes</strong></p>
<pre>${escapeHtml(order.special_instructions?.trim() || "None")}</pre>
${order.admin_notes?.trim() ? `<p><strong>Attribution</strong></p><pre>${escapeHtml(order.admin_notes.trim())}</pre>` : ""}
<p>Memorial page: ${input.memorialUrl ? `<a href="${escapeHtml(input.memorialUrl)}">${escapeHtml(input.memorialUrl)}</a>` : "not created"}</p>
<p>QR image: ${input.printFileUrl ? `<a href="${escapeHtml(input.printFileUrl)}">${escapeHtml(input.printFileUrl)}</a>` : "not created"}</p>
${input.memorialError ? `<p>Memorial error: ${escapeHtml(input.memorialError)}</p>` : ""}
<p>Fulfillment status: manual. Make the keepsake and ship it to the address above.</p>`

  return {
    to,
    subject: `Make and ship ${order.order_number}`,
    html,
    text,
  }
}

export async function sendManualFulfillmentNotice(
  input: {
    order: ManualOrderRecord
    lines: ConfiguredLine[]
    memorialUrl: string | null
    printFileUrl: string | null
    memorialError: string | null
  },
  env: Record<string, string | undefined> = process.env,
): Promise<{ sent: boolean; error: string | null; to: string[] }> {
  const notice = buildManualFulfillmentNotice(input, env)
  try {
    const resend = getResend()
    const { error } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL || "Memorial QR <orders@memorialqr.com>",
      to: notice.to,
      replyTo: input.order.customer_email || SUPPORT_EMAIL,
      subject: notice.subject,
      html: notice.html,
      text: notice.text,
    })
    if (error) return { sent: false, error: error.message, to: notice.to }
    return { sent: true, error: null, to: notice.to }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Fulfillment email failed"
    return { sent: false, error: message, to: notice.to }
  }
}
