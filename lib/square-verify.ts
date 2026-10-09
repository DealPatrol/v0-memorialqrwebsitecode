export type SquarePaymentCheck =
  | { ok: true; paymentId: string; amountCents: number; currency: string }
  | { ok: false; reason: string; status: number }

type FetchLike = (input: string, init?: RequestInit) => Promise<Pick<Response, "ok" | "status" | "json">>

export function squareBaseUrl(env: Record<string, string | undefined>): string {
  return (env.SQUARE_ENVIRONMENT || "sandbox") === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com"
}

/**
 * Looks the payment up on Square and accepts it only when it is COMPLETED, at our
 * location, for exactly the expected amount and currency.
 */
export async function verifySquarePayment(
  paymentId: unknown,
  expected: { amountCents: number; currency: string },
  env: Record<string, string | undefined> = process.env,
  fetchImpl: FetchLike = fetch,
): Promise<SquarePaymentCheck> {
  if (typeof paymentId !== "string" || !/^[A-Za-z0-9_-]{8,128}$/.test(paymentId)) {
    return { ok: false, reason: "Invalid payment id", status: 400 }
  }
  const accessToken = env.SQUARE_ACCESS_TOKEN
  const locationId = env.SQUARE_LOCATION_ID
  if (!accessToken || !locationId) return { ok: false, reason: "Square not configured", status: 503 }

  let response: Pick<Response, "ok" | "status" | "json">
  try {
    response = await fetchImpl(`${squareBaseUrl(env)}/v2/payments/${encodeURIComponent(paymentId)}`, {
      method: "GET",
      headers: { "Square-Version": "2024-12-18", Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    })
  } catch {
    return { ok: false, reason: "Could not reach Square to verify the payment", status: 502 }
  }
  if (response.status === 404) return { ok: false, reason: "Payment not found", status: 402 }
  if (!response.ok) return { ok: false, reason: `Square payment lookup failed (${response.status})`, status: 502 }

  const data = (await response.json().catch(() => null)) as {
    payment?: { id?: string; status?: string; location_id?: string; amount_money?: { amount?: number; currency?: string } }
  } | null
  const payment = data?.payment
  if (!payment || payment.id !== paymentId) return { ok: false, reason: "Payment not found", status: 402 }
  if (payment.status !== "COMPLETED") return { ok: false, reason: `Payment is ${payment.status || "unknown"}`, status: 402 }
  if (payment.location_id !== locationId) return { ok: false, reason: "Payment belongs to another location", status: 402 }
  const amount = payment.amount_money?.amount
  const currency = payment.amount_money?.currency
  if (amount !== expected.amountCents || currency !== expected.currency) {
    return { ok: false, reason: "Payment amount does not match the order", status: 402 }
  }
  return { ok: true, paymentId, amountCents: amount, currency }
}
