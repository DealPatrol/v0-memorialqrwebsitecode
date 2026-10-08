import { getSellableKeepsakes } from "@/lib/fulfillment-availability"
import { getResend } from "@/lib/resend"
import { SITE_URL, SUPPORT_EMAIL } from "@/lib/site"

export type ReviewDecision = "send" | "wait" | "skip"

export function reviewRequestDecision(input: {
  status: string | null
  fulfillmentStatus: string | null
  sentAt: string | null
  customerEmail: string | null
  productId: string | null
}): ReviewDecision {
  if (input.sentAt || !input.customerEmail || !input.productId) return "skip"
  const fulfilled =
    input.status === "completed" || input.status === "shipped" || input.fulfillmentStatus === "shipped"
  return fulfilled ? "send" : "wait"
}

export function productIdFromOrder(
  order: {
    product_name?: string | null
    product_type?: string | null
    line_items?: unknown
  },
  env: Record<string, string | undefined> = process.env,
): string | null {
  const keepsakes = getSellableKeepsakes(env)
  const ids = new Set(keepsakes.map((product) => product.id))
  if (Array.isArray(order.line_items)) {
    for (const item of order.line_items) {
      if (!item || typeof item !== "object" || !("sku" in item)) continue
      const sku = (item as { sku?: unknown }).sku
      if (typeof sku === "string" && ids.has(sku)) return sku
    }
  }
  if (order.product_type && ids.has(order.product_type)) return order.product_type
  const named = keepsakes.find((product) => product.name === order.product_name)
  return named?.id ?? null
}

type ReviewRequestRecord = {
  token?: unknown
  sentAt?: unknown
  usedAt?: unknown
  productId?: unknown
}

export function reviewRequestFromOrder(order: { fulfillment_data?: unknown }): {
  token: string | null
  sentAt: string | null
  usedAt: string | null
  productId: string | null
} {
  const data = order.fulfillment_data
  if (!data || typeof data !== "object" || !("reviewRequest" in data)) {
    return { token: null, sentAt: null, usedAt: null, productId: null }
  }
  const request = (data as { reviewRequest?: ReviewRequestRecord }).reviewRequest
  return {
    token: typeof request?.token === "string" ? request.token : null,
    sentAt: typeof request?.sentAt === "string" ? request.sentAt : null,
    usedAt: typeof request?.usedAt === "string" ? request.usedAt : null,
    productId: typeof request?.productId === "string" ? request.productId : null,
  }
}

export function buildReviewRequestEmail(input: { customerName: string; productName: string; reviewUrl: string }) {
  const name = input.customerName.trim() || "there"
  const text = `Hello ${name},

Your ${input.productName} has been fulfilled. If you want to, you can tell us how it has been for your family. There is no discount for a review, and you do not have to write one.

${input.reviewUrl}

Thank you,
MemorialsQR
${SUPPORT_EMAIL}`
  const html = `<p>Hello ${escapeHtml(name)},</p>
<p>Your ${escapeHtml(input.productName)} has been fulfilled. If you want to, you can tell us how it has been for your family. There is no discount for a review, and you do not have to write one.</p>
<p><a href="${escapeHtml(input.reviewUrl)}">Share a review</a></p>
<p>Thank you,<br>MemorialsQR<br>${escapeHtml(SUPPORT_EMAIL)}</p>`
  return {
    subject: `How has the ${input.productName} been?`,
    text,
    html,
  }
}

type OrderRow = {
  id: string
  order_number?: string | null
  customer_name?: string | null
  customer_email?: string | null
  product_name?: string | null
  product_type?: string | null
  status?: string | null
  fulfillment_status?: string | null
  fulfillment_data?: unknown
  line_items?: unknown
}

type ReviewStore = {
  from: (table: string) => any
}

function mergeReviewRequest(order: OrderRow, reviewRequest: Record<string, unknown>) {
  const existing =
    order.fulfillment_data && typeof order.fulfillment_data === "object" ? order.fulfillment_data : {}
  return { ...existing, reviewRequest }
}

async function saveReviewRequest(supabase: ReviewStore, order: OrderRow, reviewRequest: Record<string, unknown>) {
  const dataUpdate = await supabase
    .from("orders")
    .update({ fulfillment_data: mergeReviewRequest(order, reviewRequest) })
    .eq("id", order.id)
  const invite = await supabase.from("review_invites").upsert({
    token: reviewRequest.token,
    order_id: order.id,
    order_number: order.order_number ?? "",
    product_id: reviewRequest.productId,
    sent_at: reviewRequest.sentAt ?? null,
    used_at: reviewRequest.usedAt ?? null,
  })
  return !dataUpdate.error || !invite.error
}

export async function sendReviewRequestForOrder(supabase: ReviewStore, orderId: string): Promise<ReviewDecision | "failed"> {
  const loaded = await supabase.from("orders").select("*").eq("id", orderId).maybeSingle()
  if (loaded.error || !loaded.data) return "failed"
  const order = loaded.data
  const existing = reviewRequestFromOrder(order)
  const productId = existing.productId ?? productIdFromOrder(order)
  const decision = reviewRequestDecision({
    status: order.status ?? null,
    fulfillmentStatus: order.fulfillment_status ?? null,
    sentAt: existing.sentAt,
    customerEmail: order.customer_email ?? null,
    productId,
  })
  if (decision !== "send" || !order.customer_email || !productId) return decision

  const token = existing.token ?? crypto.randomUUID()
  const reviewUrl = `${SITE_URL}/review?token=${token}`
  const saved = await saveReviewRequest(supabase, order, {
    token,
    productId,
    sentAt: null,
    usedAt: existing.usedAt,
  })
  if (!saved) return "failed"

  try {
    const resend = getResend()
    const from = process.env.RESEND_FROM_EMAIL || "Memorial QR <orders@memorialqr.com>"
    const notice = buildReviewRequestEmail({
      customerName: order.customer_name ?? "",
      productName: order.product_name ?? "QR Memorial Plaque",
      reviewUrl,
    })
    const { error } = await resend.emails.send({
      from,
      to: order.customer_email,
      replyTo: SUPPORT_EMAIL,
      subject: notice.subject,
      html: notice.html,
      text: notice.text,
    })
    if (error) return "failed"
  } catch (error) {
    console.error("[reviews] Review request email failed:", error)
    return "failed"
  }

  await saveReviewRequest(supabase, order, {
    token,
    productId,
    sentAt: new Date().toISOString(),
    usedAt: existing.usedAt,
  })
  return "send"
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!)
}
