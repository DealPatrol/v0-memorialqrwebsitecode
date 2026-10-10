import { SUPPORT_EMAIL } from "@/lib/site"
import { memorialPageUrl, memorialSlugForOrder, printFileUrl } from "@/lib/memorial-urls"
import { sendEmail } from "@/lib/email"
import { sendManualFulfillmentNotice } from "@/lib/manual-fulfillment-email"
import { recordEmailAlert } from "@/lib/order-email-alerts"
import { isMissingPodOrderSchema } from "@/lib/pod-orders"
import { dispatchSupplierLines, type DispatchLine, type DispatchOutcome } from "@/lib/supplier-dispatch"
import { attributionFromUnknown } from "@/lib/attribution"
import { giftNoticeLines, packageRecipientName, preserveStoredGift } from "@/lib/gift-order"
import type { ConfiguredLine } from "@/lib/fulfillment-availability"
import type { ShipTo } from "@/lib/printful"

type OrderRow = {
  id: string
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
  user_id: string | null
  payment_id?: string | null
  amount_cents?: number | null
  admin_notes?: string | null
  fulfillment_data?: unknown
}

function orderStatusForOutcome(status: DispatchOutcome["status"]): string {
  switch (status) {
    case "submitted":
      return "in_production"
    case "failed":
      return "fulfillment_failed"
    case "manual":
      return "processing"
    case "not_required":
      return "processing"
    default: {
      const exhaustive: never = status
      return exhaustive
    }
  }
}

function fulfillmentSucceeded(status: DispatchOutcome["status"]): boolean {
  switch (status) {
    case "submitted":
    case "not_required":
    case "manual":
      return true
    case "failed":
      return false
    default: {
      const exhaustive: never = status
      return exhaustive
    }
  }
}

type SupabaseLike = {
  from: (table: string) => {
    insert: (values: Record<string, unknown>) => {
      select: () => { single: () => Promise<{ data: { id?: string; slug?: string } | null; error: { message?: string } | null }> }
    }
    update: (values: Record<string, unknown>) => {
      eq: (column: string, value: string) => Promise<{ error: { code?: string; message?: string } | null }>
    }
  }
}

export function linesForSupplier(items: ConfiguredLine[], printUrl: string): DispatchLine[] {
  return items
    .filter((item) => item.ships && item.provider)
    .map((item) => ({
      provider: item.provider as "printful" | "printify",
      quantity: item.quantity,
      printFileUrl: printUrl,
      syncVariantId: item.syncVariantId || undefined,
      templateProductId: item.templateProductId || undefined,
      variantId: item.variantId || undefined,
      retailCents: Math.round(item.price * 100),
      title: `${item.name} ${printUrl}`.slice(0, 120),
    }))
}

async function saveFulfillmentLog(
  supabase: SupabaseLike,
  order: OrderRow,
  outcome: DispatchOutcome,
  printUrl: string | null,
  memorialSlug: string | null,
) {
  const previousAttribution =
    order.fulfillment_data && typeof order.fulfillment_data === "object"
      ? attributionFromUnknown((order.fulfillment_data as { attribution?: unknown }).attribution)
      : null
  const log = {
    success: fulfillmentSucceeded(outcome.status),
    supplier_order_id: outcome.fulfillmentId,
    error: outcome.error ?? null,
    status: outcome.status,
    provider: outcome.provider,
    print_file_url: printUrl,
    memorial_slug: memorialSlug,
    dispatched_at: new Date().toISOString(),
    details: outcome.details,
    ...(previousAttribution ? { attribution: previousAttribution } : {}),
    ...preserveStoredGift(order.fulfillment_data),
  }
  const status = orderStatusForOutcome(outcome.status)
  const update = await supabase
    .from("orders")
    .update({
      fulfillment_status: outcome.status,
      fulfillment_id: outcome.fulfillmentId,
      fulfillment_provider: outcome.provider,
      print_file_url: printUrl,
      fulfillment_data: log,
      status,
    })
    .eq("id", order.id)

  if (update.error && isMissingPodOrderSchema(update.error)) {
    const summary = typeof outcome.details.summary === "string" ? outcome.details.summary : null
    const note = summary
      ? `FULFILLMENT ${summary}`
      : `FULFILLMENT ${JSON.stringify({
          success: log.success,
          supplierOrderId: outcome.fulfillmentId,
          error: outcome.error ?? null,
          printFileUrl: printUrl,
          memorialSlug,
        })}`
    await supabase
      .from("orders")
      .update({
        status,
        special_instructions: [order.special_instructions, note].filter(Boolean).join("\n"),
      })
      .eq("id", order.id)
  }
}

async function alertSupport(order: OrderRow, outcome: DispatchOutcome) {
  try {
    await sendEmail({
      to: SUPPORT_EMAIL,
      replyTo: SUPPORT_EMAIL,
      subject: `Fulfillment failed for ${order.order_number}`,
      html: `<p>Supplier dispatch failed for order ${order.order_number}.</p>
        <p>Supplier order id: ${outcome.fulfillmentId || "none"}</p>
        <p>Error: ${outcome.error || "Unknown error"}</p>`,
    })
  } catch (error) {
    console.error("[Fulfillment] Failed to email support:", error)
  }
}

/**
 * Creates the memorial slug, publishes a QR print file, and submits the supplier order
 * in the same checkout request. The family can add photos later; the QR already opens the page.
 */
export async function fulfillPaidPhysicalOrder(
  supabase: SupabaseLike,
  order: OrderRow,
  items: ConfiguredLine[],
  env: Record<string, string | undefined> = process.env,
): Promise<DispatchOutcome> {
  try {
    return await placePhysicalOrder(supabase, order, items, env)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Fulfillment failed"
    const outcome: DispatchOutcome = {
      status: "failed",
      provider: null,
      fulfillmentId: null,
      error: message,
      details: {},
    }
    console.error("[Fulfillment] Dispatch threw after payment:", error)
    try {
      await saveFulfillmentLog(supabase, order, outcome, null, null)
    } catch (logError) {
      console.error("[Fulfillment] Could not save the failure log:", logError)
    }
    await alertSupport(order, outcome)
    return outcome
  }
}

function isSupplierProvider(provider: ConfiguredLine["provider"]): provider is "printful" | "printify" {
  return provider === "printful" || provider === "printify"
}

function shipToFor(order: OrderRow): ShipTo {
  return {
    name: packageRecipientName(order),
    address1: order.shipping_address_line1 || "",
    address2: order.shipping_address_line2,
    city: order.shipping_city || "",
    state: (order.shipping_state || "").toUpperCase(),
    zip: order.shipping_zip || "",
    email: order.customer_email || "",
    phone: order.customer_phone,
  }
}

function manualSummary(
  order: OrderRow,
  lines: ConfiguredLine[],
  memorialUrl: string | null,
  printFileUrl: string | null,
  emailSent: boolean,
  emailError: string | null,
): string {
  const items = lines.map((line) => `${line.name} × ${line.quantity}`).join(", ")
  return [
    `manual fulfillment for ${order.order_number}`,
    "No supplier order was placed.",
    `Items: ${items}`,
    `Ship to: ${packageRecipientName(order)}, ${order.shipping_address_line1 || ""}, ${order.shipping_city || ""} ${order.shipping_state || ""} ${order.shipping_zip || ""}`.trim(),
    `Email: ${order.customer_email || ""}`,
    `Phone: ${order.customer_phone || ""}`,
    ...giftNoticeLines(order),
    `Notes: ${order.special_instructions || "none"}`,
    `Memorial: ${memorialUrl || "not created"}`,
    `QR: ${printFileUrl || "not created"}`,
    emailSent ? "Fulfillment email sent." : `Fulfillment email failed: ${emailError || "unknown error"}`,
  ].join("\n")
}

async function placePhysicalOrder(
  supabase: SupabaseLike,
  order: OrderRow,
  items: ConfiguredLine[],
  env: Record<string, string | undefined>,
): Promise<DispatchOutcome> {
  const physical = items.filter((item) => item.ships)
  if (physical.length === 0) {
    const outcome: DispatchOutcome = { status: "not_required", provider: null, fulfillmentId: null, details: {} }
    await saveFulfillmentLog(supabase, order, outcome, null, null)
    return outcome
  }

  const supplierItems = physical.filter((item) => isSupplierProvider(item.provider))
  const manualItems = physical.filter((item) => item.provider === "manual")
  if (supplierItems.length + manualItems.length !== physical.length) {
    const outcome: DispatchOutcome = {
      status: "failed",
      provider: null,
      fulfillmentId: null,
      error: "A keepsake in this order has no fulfillment path",
      details: {},
    }
    await saveFulfillmentLog(supabase, order, outcome, null, null)
    await alertSupport(order, outcome)
    return outcome
  }

  const slug = memorialSlugForOrder(order.order_number)
  const pageUrl = memorialPageUrl(slug)
  const fileUrl = printFileUrl(slug)
  const memorialName = (order.special_instructions || "In Loving Memory").split("\n")[0].slice(0, 80) || "In Loving Memory"

  const inserted = await supabase
    .from("memorials")
    .insert({
      full_name: memorialName,
      slug,
      user_id: order.user_id,
      biography: "This page was created when the keepsake was ordered. Add photos and stories whenever you are ready.",
      theme: "classic",
      package_type: "basic",
    })
    .select()
    .single()

  const memorialOk = !inserted.error && !!inserted.data
  const memorialError = memorialOk
    ? null
    : inserted.error?.message || "Memorial page was not created, so the QR print file could not be made"

  if (!memorialOk && supplierItems.length > 0) {
    const outcome: DispatchOutcome = {
      status: "failed",
      provider: null,
      fulfillmentId: null,
      error: memorialError ?? undefined,
      details: {},
    }
    await saveFulfillmentLog(supabase, order, outcome, null, null)
    await alertSupport(order, outcome)
    return outcome
  }

  if (memorialOk && inserted.data?.id) {
    await supabase.from("orders").update({ memorial_id: inserted.data.id }).eq("id", order.id)
  }

  const memorialUrl = memorialOk ? pageUrl : null
  const printUrl = memorialOk ? fileUrl : null

  if (manualItems.length > 0) {
    const notice = await sendManualFulfillmentNotice(
      {
        order,
        lines: manualItems,
        memorialUrl,
        printFileUrl: printUrl,
        memorialError,
      },
      env,
    )
    if (supplierItems.length === 0) {
      const outcome: DispatchOutcome = {
        status: "manual",
        provider: "manual",
        fulfillmentId: null,
        error: notice.sent ? undefined : notice.error || "Fulfillment email was not sent",
        details: {
          memorialUrl,
          printFileUrl: printUrl,
          manualFulfillment: notice,
          note: "Fulfill by hand. No supplier order was placed.",
          summary: manualSummary(order, manualItems, memorialUrl, printUrl, notice.sent, notice.error),
        },
      }
      await saveFulfillmentLog(supabase, order, outcome, printUrl, memorialOk ? slug : null)
      if (notice.failed.length) {
        await recordEmailAlert(supabase, order, "manual_fulfillment_notice", notice.error, notice.failed.map((item) => item.to))
      }
      return outcome
    }

    const recipient: ShipTo = shipToFor(order)
    const outcome = await dispatchSupplierLines({
      orderNumber: order.order_number,
      recipient,
      lines: linesForSupplier(supplierItems, printUrl || fileUrl),
      env,
    })
    outcome.provider = "mixed"
    outcome.details.memorialUrl = memorialUrl
    outcome.details.printFileUrl = printUrl
    outcome.details.manualFulfillment = notice
    outcome.details.summary = manualSummary(order, manualItems, memorialUrl, printUrl, notice.sent, notice.error)
    await saveFulfillmentLog(supabase, order, outcome, printUrl, memorialOk ? slug : null)
    if (notice.failed.length) {
      await recordEmailAlert(supabase, order, "manual_fulfillment_notice", notice.error, notice.failed.map((item) => item.to))
    }
    if (outcome.status === "failed") await alertSupport(order, outcome)
    return outcome
  }

  const recipient: ShipTo = shipToFor(order)

  const outcome = await dispatchSupplierLines({
    orderNumber: order.order_number,
    recipient,
    lines: linesForSupplier(supplierItems, fileUrl),
    env,
  })
  outcome.details.memorialUrl = pageUrl
  outcome.details.printFileUrl = fileUrl
  await saveFulfillmentLog(supabase, order, outcome, fileUrl, slug)
  if (outcome.status === "failed") await alertSupport(order, outcome)
  return outcome
}
