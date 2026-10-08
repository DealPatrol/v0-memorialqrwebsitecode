import { submitPrintfulOrder, type PrintfulLine, type ShipTo } from "@/lib/printful"
import { submitPrintifyOrder, type PrintifyLine } from "@/lib/printify"

export type DispatchLine = {
  provider: "printful" | "printify"
  quantity: number
  printFileUrl: string
  syncVariantId?: string
  templateProductId?: string
  variantId?: string
  retailCents: number
  title: string
}

export type DispatchOutcome = {
  status: "submitted" | "failed" | "not_required" | "manual"
  provider: "printful" | "printify" | "mixed" | "manual" | null
  fulfillmentId: string | null
  error?: string
  details: Record<string, unknown>
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>

function providerLabel(hasPrintful: boolean, hasPrintify: boolean): DispatchOutcome["provider"] {
  if (hasPrintful && hasPrintify) return "mixed"
  if (hasPrintful) return "printful"
  if (hasPrintify) return "printify"
  return null
}

/** Places supplier orders and requires them to enter production. Drafts are failures. */
export async function dispatchSupplierLines(
  input: {
    orderNumber: string
    recipient: ShipTo
    lines: DispatchLine[]
    env: Record<string, string | undefined>
  },
  fetchImpl: FetchLike = fetch,
): Promise<DispatchOutcome> {
  if (input.lines.length === 0) {
    return { status: "not_required", provider: null, fulfillmentId: null, details: {} }
  }

  const printfulLines: PrintfulLine[] = input.lines
    .filter((line) => line.provider === "printful")
    .map((line) => ({
      syncVariantId: line.syncVariantId || "",
      quantity: line.quantity,
      printFileUrl: line.printFileUrl,
    }))
  const printifyLines: PrintifyLine[] = input.lines
    .filter((line) => line.provider === "printify")
    .map((line) => ({
      templateProductId: line.templateProductId || "",
      variantId: line.variantId || "",
      quantity: line.quantity,
      printFileUrl: line.printFileUrl,
      retailCents: line.retailCents,
      title: line.title,
    }))

  const details: Record<string, unknown> = {}
  const ids: string[] = []
  const errors: string[] = []
  let failed = false

  if (printfulLines.length > 0) {
    const result = await submitPrintfulOrder(
      {
        orderNumber: input.orderNumber,
        recipient: input.recipient,
        items: printfulLines,
        token: input.env.PRINTFUL_API_TOKEN?.trim() || "",
      },
      fetchImpl,
    )
    details.printful = result
    if (result.status === "failed") {
      failed = true
      if (result.error) errors.push(result.error)
    }
    if (result.fulfillmentId) ids.push(result.fulfillmentId)
  }

  if (printifyLines.length > 0) {
    const result = await submitPrintifyOrder(
      {
        orderNumber: input.orderNumber,
        recipient: input.recipient,
        items: printifyLines,
        token: input.env.PRINTIFY_API_TOKEN?.trim() || "",
        shopId: input.env.PRINTIFY_SHOP_ID?.trim() || "",
      },
      fetchImpl,
    )
    details.printify = result
    if (result.status === "failed") {
      failed = true
      if (result.error) errors.push(result.error)
    }
    if (result.fulfillmentId) ids.push(result.fulfillmentId)
  }

  return {
    status: failed ? "failed" : "submitted",
    provider: providerLabel(printfulLines.length > 0, printifyLines.length > 0),
    fulfillmentId: ids.length > 0 ? ids.join(",") : null,
    error: errors.length > 0 ? errors.join(" ") : undefined,
    details,
  }
}
