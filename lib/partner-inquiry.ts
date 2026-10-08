import { attributionFromUnknown, formatAttribution, type ClickAttribution } from "@/lib/attribution"
import { SUPPORT_EMAIL } from "@/lib/site"
import { manualFulfillmentRecipients } from "@/lib/manual-fulfillment-email"

export type PartnerInquiryInput = {
  name: string
  email: string
  funeralHome: string
  city: string
  phone: string
  message: string
  attribution: ClickAttribution | null
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function parsePartnerInquiry(body: unknown): { ok: true; value: PartnerInquiryInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Enter your funeral home and a way to reply." }
  const record = body as Record<string, unknown>
  const name = typeof record.name === "string" ? record.name.trim() : ""
  const email = typeof record.email === "string" ? record.email.trim() : ""
  const funeralHome = typeof record.funeralHome === "string" ? record.funeralHome.trim() : ""
  const city = typeof record.city === "string" ? record.city.trim() : ""
  const phone = typeof record.phone === "string" ? record.phone.trim() : ""
  const message = typeof record.message === "string" ? record.message.trim() : ""

  if (!name || name.length > 120) return { ok: false, error: "Enter your name." }
  if (!EMAIL_PATTERN.test(email) || email.length > 200) return { ok: false, error: "Enter a valid email address." }
  if (!funeralHome || funeralHome.length > 200) return { ok: false, error: "Enter the funeral home name." }
  if (city.length > 120) return { ok: false, error: "City and state are too long." }
  if (phone.length > 40) return { ok: false, error: "Phone number is too long." }
  if (!message || message.length > 4000) return { ok: false, error: "Tell us what you need, in 4000 characters or fewer." }

  return {
    ok: true,
    value: { name, email, funeralHome, city, phone, message, attribution: attributionFromUnknown(record.attribution) },
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!)
}

export function buildPartnerInquiryEmail(input: PartnerInquiryInput, env: Record<string, string | undefined> = process.env) {
  const to = manualFulfillmentRecipients(env)
  const attribution = formatAttribution(input.attribution)
  const text = [
    "Wholesale inquiry from a funeral home.",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Funeral home: ${input.funeralHome}`,
    `City and state: ${input.city || "not provided"}`,
    `Phone: ${input.phone || "not provided"}`,
    "",
    input.message,
    ...(attribution ? ["", "Attribution:", attribution] : []),
  ].join("\n")

  const html = `<p><strong>Wholesale inquiry from a funeral home.</strong></p>
<ul>
  <li>Name: ${escapeHtml(input.name)}</li>
  <li>Email: ${escapeHtml(input.email)}</li>
  <li>Funeral home: ${escapeHtml(input.funeralHome)}</li>
  <li>City and state: ${escapeHtml(input.city || "not provided")}</li>
  <li>Phone: ${escapeHtml(input.phone || "not provided")}</li>
</ul>
<p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>
${attribution ? `<p><strong>Attribution</strong></p><pre>${escapeHtml(attribution)}</pre>` : ""}`

  const confirmationText = `We received your wholesale inquiry for ${input.funeralHome}. We will reply to ${input.email}. This note does not place an order and does not charge a card.`

  return {
    to,
    subject: `Funeral home inquiry: ${input.funeralHome}`,
    html,
    text,
    confirmationSubject: "We received your MemorialsQR inquiry",
    confirmationText,
    confirmationHtml: `<p>${escapeHtml(confirmationText)}</p><p>If you need us sooner, email ${escapeHtml(SUPPORT_EMAIL)}.</p>`,
  }
}
