import { SUPPORT_EMAIL } from "@/lib/site"
import { memorialPageUrl, memorialSlugForOrder, printFileUrl } from "@/lib/memorial-urls"
import { sendEmail } from "@/lib/email"
import { isMissingPodOrderSchema } from "@/lib/pod-orders"
import { dispatchSupplierLines, type DispatchLine, type DispatchOutcome } from "@/lib/supplier-dispatch"
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
  const log = {
    success: outcome.status === "submitted" || outcome.status === "not_required",
    supplier_order_id: outcome.fulfillmentId,
    error: outcome.error ?? null,
    status: outcome.status,
    provider: outcome.provider,
    print_file_url: printUrl,
    memorial_slug: memorialSlug,
    dispatched_at: new Date().toISOString(),
    details: outcome.details,
  }
  const status = outcome.status === "submitted" ? "in_production" : outcome.status === "failed" ? "fulfillment_failed" : "processing"
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
    const note = `FULFILLMENT ${JSON.stringify({
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

  if (inserted.error || !inserted.data) {
    const outcome: DispatchOutcome = {
      status: "failed",
      provider: null,
      fulfillmentId: null,
      error: inserted.error?.message || "Memorial page was not created, so the QR print file could not be made",
      details: {},
    }
    await saveFulfillmentLog(supabase, order, outcome, null, null)
    await alertSupport(order, outcome)
    return outcome
  }

  await supabase.from("orders").update({ memorial_id: inserted.data.id }).eq("id", order.id)

  const recipient: ShipTo = {
    name: order.customer_name || "Customer",
    address1: order.shipping_address_line1 || "",
    address2: order.shipping_address_line2,
    city: order.shipping_city || "",
    state: (order.shipping_state || "").toUpperCase(),
    zip: order.shipping_zip || "",
    email: order.customer_email || "",
    phone: order.customer_phone,
  }

  const outcome = await dispatchSupplierLines(
    {
      orderNumber: order.order_number,
      recipient,
      lines: linesForSupplier(physical, fileUrl),
      env,
    },
  )
  outcome.details.memorialUrl = pageUrl
  outcome.details.printFileUrl = fileUrl
  await saveFulfillmentLog(supabase, order, outcome, fileUrl, slug)
  if (outcome.status === "failed") await alertSupport(order, outcome)
  return outcome
}
