import { submitPrintfulOrder, type PrintfulLine, type ShipTo } from "@/lib/printful"
import {
  submitPrintifyBlueprintOrder,
  submitPrintifyOrder,
  type BlueprintPrintLine,
  type PrintifyLine,
} from "@/lib/printify"
import type { QrSurface } from "@/lib/store-catalog"

export type DispatchLine = {
  provider: "printful" | "printify"
  quantity: number
  printFileUrl: string
  syncVariantId?: string
  templateProductId?: string
  variantId?: string
  retailCents: number
  title: string
  blueprintId?: number | null
  printProviderId?: string | null
  photoUrl?: string | null
  qrSurface?: QrSurface
  qrMinInches?: number
  printWidthInches?: number
}

export type DispatchOutcome = {
  status: "submitted" | "failed" | "not_required" | "manual" | "mocked"
  provider: "printful" | "printify" | "mixed" | "manual" | "merchize" | null
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
  const printifyDispatch = input.lines.filter((line) => line.provider === "printify")
  const templateLines: PrintifyLine[] = printifyDispatch
    .filter((line) => line.templateProductId)
    .map((line) => ({
      templateProductId: line.templateProductId || "",
      variantId: line.variantId || "",
      quantity: line.quantity,
      printFileUrl: line.printFileUrl,
      retailCents: line.retailCents,
      title: line.title,
    }))
  const blueprintLines: BlueprintPrintLine[] = printifyDispatch
    .filter((line) => !line.templateProductId)
    .map((line) => ({
      title: line.title,
      blueprintId: line.blueprintId ?? null,
      printProviderId: line.printProviderId ?? null,
      variantId: line.variantId || "",
      quantity: line.quantity,
      printFileUrl: line.printFileUrl,
      photoUrl: line.photoUrl,
      retailCents: line.retailCents,
      qrSurface: line.qrSurface,
      qrMinInches: line.qrMinInches,
      printWidthInches: line.printWidthInches,
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

  let mocked = false

  if (templateLines.length > 0) {
    const result = await submitPrintifyOrder(
      {
        orderNumber: input.orderNumber,
        recipient: input.recipient,
        items: templateLines,
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
    if (result.status === "mocked") mocked = true
    if (result.fulfillmentId) ids.push(result.fulfillmentId)
  }

  if (blueprintLines.length > 0) {
    const result = await submitPrintifyBlueprintOrder(
      {
        orderNumber: input.orderNumber,
        recipient: input.recipient,
        items: blueprintLines,
        token: input.env.PRINTIFY_API_TOKEN?.trim() || "",
        shopId: input.env.PRINTIFY_SHOP_ID?.trim() || "",
      },
      fetchImpl,
    )
    details.printifyBlueprint = result
    if (result.payload) details.printifyPayload = result.payload
    if (result.status === "failed") {
      failed = true
      if (result.error) errors.push(result.error)
    }
    if (result.status === "mocked") mocked = true
    if (result.fulfillmentId) ids.push(result.fulfillmentId)
  }

  const status = failed ? "failed" : mocked ? "mocked" : "submitted"
  return {
    status,
    provider: providerLabel(printfulLines.length > 0, printifyDispatch.length > 0),
    fulfillmentId: ids.length > 0 ? ids.join(",") : null,
    error: errors.length > 0 ? errors.join(" ") : undefined,
    details,
  }
}
