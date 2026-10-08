import { NextResponse } from "next/server"
import { manualFulfillmentRecipients } from "@/lib/manual-fulfillment-email"
import { parseReviewSubmission, type PublishedReview } from "@/lib/product-reviews"
import { reviewRequestFromOrder } from "@/lib/review-request"
import { getResend } from "@/lib/resend"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { SUPPORT_EMAIL } from "@/lib/site"

export const dynamic = "force-dynamic"

type InviteRow = {
  token: string
  order_number: string
  product_id: string
  used_at: string | null
}

type OrderRow = {
  id: string
  order_number?: string | null
  fulfillment_data?: unknown
}

function publishedReview(row: { author_name?: unknown; rating?: unknown; body?: unknown; created_at?: unknown }): PublishedReview | null {
  if (typeof row.author_name !== "string" || typeof row.body !== "string" || typeof row.rating !== "number") return null
  return {
    authorName: row.author_name,
    rating: row.rating,
    body: row.body,
    createdAt: typeof row.created_at === "string" ? row.created_at : "",
  }
}

export async function GET(request: Request) {
  const productId = new URL(request.url).searchParams.get("productId")?.trim()
  if (!productId) return NextResponse.json({ reviews: [] })

  try {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from("product_reviews")
      .select("author_name, rating, body, created_at")
      .eq("product_id", productId)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(20)
    if (error || !data) return NextResponse.json({ reviews: [] })
    const reviews = data.flatMap((row) => {
      const review = publishedReview(row)
      return review ? [review] : []
    })
    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("[reviews] Could not load reviews:", error)
    return NextResponse.json({ reviews: [] })
  }
}

async function findInvite(token: string): Promise<{ orderNumber: string; productId: string; used: boolean; order: OrderRow | null } | null> {
  const supabase = createServiceRoleClient()
  const invite = await supabase.from("review_invites").select("token, order_number, product_id, used_at").eq("token", token).maybeSingle()
  if (invite.data) {
    const row = invite.data as InviteRow
    return { orderNumber: row.order_number, productId: row.product_id, used: Boolean(row.used_at), order: null }
  }

  const order = await supabase
    .from("orders")
    .select("id, order_number, fulfillment_data")
    .contains("fulfillment_data", { reviewRequest: { token } })
    .maybeSingle()
  if (!order.data) return null
  const row = order.data as OrderRow
  const request = reviewRequestFromOrder(row)
  if (request.token !== token || !request.productId) return null
  return {
    orderNumber: row.order_number ?? "",
    productId: request.productId,
    used: Boolean(request.usedAt),
    order: row,
  }
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Open the review link from your email." }, { status: 400 })
  }

  const parsed = parseReviewSubmission(body)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  let invite: Awaited<ReturnType<typeof findInvite>>
  try {
    invite = await findInvite(parsed.value.token)
  } catch (error) {
    console.error("[reviews] Could not check the review link:", error)
    return NextResponse.json({ error: `We could not save that. Email ${SUPPORT_EMAIL} instead.` }, { status: 500 })
  }
  if (!invite) return NextResponse.json({ error: "This review link is not valid." }, { status: 400 })
  if (invite.used) return NextResponse.json({ error: "We already have a review from this order." }, { status: 400 })

  try {
    const supabase = createServiceRoleClient()
    const { error } = await supabase.from("product_reviews").insert({
      product_id: invite.productId,
      order_number: invite.orderNumber || null,
      author_name: parsed.value.authorName,
      rating: parsed.value.rating,
      body: parsed.value.body,
      status: "published",
    })
    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "We already have a review from this order." }, { status: 400 })
      }
      console.error("[reviews] Insert failed:", error)
      return NextResponse.json({ error: `We could not save that. Email ${SUPPORT_EMAIL} instead.` }, { status: 500 })
    }

    const usedAt = new Date().toISOString()
    await supabase.from("review_invites").update({ used_at: usedAt }).eq("token", parsed.value.token)
    if (invite.order) {
      const existing = invite.order.fulfillment_data && typeof invite.order.fulfillment_data === "object" ? invite.order.fulfillment_data : {}
      const previous = reviewRequestFromOrder(invite.order)
      await supabase
        .from("orders")
        .update({
          fulfillment_data: {
            ...existing,
            reviewRequest: { ...previous, token: parsed.value.token, productId: invite.productId, usedAt },
          },
        })
        .eq("id", invite.order.id)
    }

    try {
      const resend = getResend()
      const from = process.env.RESEND_FROM_EMAIL || "Memorial QR <orders@memorialqr.com>"
      await resend.emails.send({
        from,
        to: manualFulfillmentRecipients(process.env),
        replyTo: SUPPORT_EMAIL,
        subject: `Review for ${invite.productId} (${invite.orderNumber})`,
        text: `${parsed.value.authorName} rated ${parsed.value.rating} out of 5.\n\n${parsed.value.body}`,
      })
    } catch (noticeError) {
      console.error("[reviews] Could not copy the review to support:", noticeError)
    }
  } catch (error) {
    console.error("[reviews] Save failed:", error)
    return NextResponse.json({ error: `We could not save that. Email ${SUPPORT_EMAIL} instead.` }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
