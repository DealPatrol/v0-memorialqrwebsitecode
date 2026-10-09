export type EmailAlertKind = "manual_fulfillment_notice" | "customer_confirmation"

export type EmailAlert = {
  kind: EmailAlertKind
  error: string
  recipients?: string[]
  at: string
}

/** Pure: adds an alert to an order's fulfillment_data without dropping what is there. */
export function mergeEmailAlert(fulfillmentData: unknown, alert: EmailAlert): Record<string, unknown> {
  const base =
    fulfillmentData && typeof fulfillmentData === "object" && !Array.isArray(fulfillmentData)
      ? { ...(fulfillmentData as Record<string, unknown>) }
      : {}
  const previous = Array.isArray(base.email_alerts) ? (base.email_alerts as EmailAlert[]) : []
  return { ...base, email_alerts: [...previous, alert].slice(-10) }
}

export function emailAlertsOf(fulfillmentData: unknown): EmailAlert[] {
  if (!fulfillmentData || typeof fulfillmentData !== "object") return []
  const list = (fulfillmentData as { email_alerts?: unknown }).email_alerts
  return Array.isArray(list) ? (list as EmailAlert[]) : []
}

type AlertDb = { from: (table: string) => any }

/**
 * A paid order whose email did not go out must be loud: an error log line that
 * starts with [ALERT], and a flag on the order that /admin/orders shows in red.
 */
export async function recordEmailAlert(
  supabase: AlertDb,
  order: { id: string; order_number: string },
  kind: EmailAlertKind,
  error: unknown,
  recipients?: string[],
): Promise<void> {
  const message = error instanceof Error ? error.message : String(error || "Email was not sent")
  console.error(`[ALERT] ${kind} email failed for order ${order.order_number}: ${message}`, recipients ? { recipients } : "")
  try {
    const { data } = await supabase.from("orders").select("fulfillment_data").eq("id", order.id).maybeSingle()
    const next = mergeEmailAlert(data?.fulfillment_data, {
      kind,
      error: message.slice(0, 500),
      ...(recipients ? { recipients } : {}),
      at: new Date().toISOString(),
    })
    const { error: updateError } = await supabase.from("orders").update({ fulfillment_data: next }).eq("id", order.id)
    if (updateError) console.error(`[ALERT] could not flag order ${order.order_number}:`, updateError.message || updateError)
  } catch (flagError) {
    console.error(`[ALERT] could not flag order ${order.order_number}:`, flagError)
  }
}
