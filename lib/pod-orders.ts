const POD_ORDER_COLUMNS = [
  "line_items",
  "fulfillment_provider",
  "fulfillment_id",
  "fulfillment_status",
  "fulfillment_data",
  "print_file_url",
] as const

type DatabaseError = {
  code?: string
  message?: string
}

function missingColumnMessage(error: unknown): string | null {
  if (!error || typeof error !== "object") return null
  const { code, message } = error as DatabaseError
  if (code !== "PGRST204" && code !== "42703") return null
  return message?.toLowerCase() || ""
}

export function isMissingPodOrderSchema(error: unknown): boolean {
  const message = missingColumnMessage(error)
  if (message === null) return false
  return POD_ORDER_COLUMNS.some((column) => message.includes(column))
}

/** True when migration 026 (hosting_included_until) has not been applied yet. */
export function isMissingHostingSchema(error: unknown): boolean {
  const message = missingColumnMessage(error)
  return message !== null && message.includes("hosting_included_until")
}
