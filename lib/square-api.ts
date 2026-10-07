/**
 * Server-only Square REST helpers. Never import this from a client component.
 * Docs: https://developer.squareup.com/reference/square
 */
const SQUARE_VERSION = "2025-09-24"

type Fetcher = typeof fetch

export type SquareConfig = {
  accessToken: string
  locationId: string
  baseUrl: string
  environment: "production" | "sandbox"
  fetcher?: Fetcher
}

export type SquareResult<T> = { ok: true; data: T } | { ok: false; status: number; error: string; code?: string }

export function getSquareConfig(env: Record<string, string | undefined> = process.env): SquareConfig | null {
  const accessToken = env.SQUARE_ACCESS_TOKEN?.trim()
  const locationId = env.SQUARE_LOCATION_ID?.trim()
  if (!accessToken || !locationId) return null
  const environment = env.SQUARE_ENVIRONMENT === "production" ? "production" : "sandbox"
  return {
    accessToken,
    locationId,
    environment,
    baseUrl: environment === "production" ? "https://connect.squareup.com" : "https://connect.squareupsandbox.com",
  }
}

async function squareRequest<T>(
  config: SquareConfig,
  method: "GET" | "POST",
  path: string,
  body?: Record<string, unknown>,
): Promise<SquareResult<T>> {
  const fetcher = config.fetcher ?? fetch
  try {
    const response = await fetcher(`${config.baseUrl}${path}`, {
      method,
      headers: {
        "Square-Version": SQUARE_VERSION,
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    })
    const data = (await response.json().catch(() => ({}))) as T & { errors?: Array<{ code?: string; detail?: string }> }
    if (!response.ok) {
      const first = data.errors?.[0]
      return { ok: false, status: response.status, error: first?.detail || `Square ${path} failed`, code: first?.code }
    }
    return { ok: true, data }
  } catch (error) {
    return { ok: false, status: 0, error: error instanceof Error ? error.message : "Square request failed" }
  }
}

export type SquarePayment = {
  id: string
  status: string
  amount_money?: { amount: number; currency: string }
  total_money?: { amount: number; currency: string }
  location_id?: string
  customer_id?: string
  reference_id?: string
}

export type SquareCard = { id: string; customer_id?: string; enabled?: boolean }

export type SquareSubscription = { id: string; status?: string; customer_id?: string; start_date?: string }

export async function createSquareCustomer(
  config: SquareConfig,
  input: { email: string; name?: string; idempotencyKey: string; referenceId?: string },
): Promise<SquareResult<{ customer: { id: string } }>> {
  const [givenName, ...rest] = (input.name || "").trim().split(/\s+/).filter(Boolean)
  return squareRequest(config, "POST", "/v2/customers", {
    idempotency_key: input.idempotencyKey,
    email_address: input.email,
    ...(givenName ? { given_name: givenName } : {}),
    ...(rest.length ? { family_name: rest.join(" ") } : {}),
    ...(input.referenceId ? { reference_id: input.referenceId } : {}),
  })
}

export async function createSquarePayment(
  config: SquareConfig,
  input: {
    sourceId: string
    verificationToken?: string
    amountCents: number
    currency: string
    idempotencyKey: string
    referenceId?: string
    customerId?: string | null
    buyerEmail?: string
    note?: string
  },
): Promise<SquareResult<{ payment: SquarePayment }>> {
  return squareRequest(config, "POST", "/v2/payments", {
    source_id: input.sourceId,
    idempotency_key: input.idempotencyKey,
    amount_money: { amount: input.amountCents, currency: input.currency },
    location_id: config.locationId,
    autocomplete: true,
    ...(input.verificationToken ? { verification_token: input.verificationToken } : {}),
    ...(input.referenceId ? { reference_id: input.referenceId.slice(0, 40) } : {}),
    ...(input.customerId ? { customer_id: input.customerId } : {}),
    ...(input.buyerEmail ? { buyer_email_address: input.buyerEmail } : {}),
    ...(input.note ? { note: input.note.slice(0, 500) } : {}),
  })
}

/**
 * Saves the card used for a completed payment. A card token is single-use, so the
 * card is stored from the payment id after the charge, not from the token.
 */
export async function saveCardFromPayment(
  config: SquareConfig,
  input: { paymentId: string; customerId: string; idempotencyKey: string },
): Promise<SquareResult<{ card: SquareCard }>> {
  return squareRequest(config, "POST", "/v2/cards", {
    idempotency_key: input.idempotencyKey,
    source_id: input.paymentId,
    card: { customer_id: input.customerId },
  })
}

export async function getSquarePayment(config: SquareConfig, paymentId: string): Promise<SquareResult<{ payment: SquarePayment }>> {
  return squareRequest(config, "GET", `/v2/payments/${encodeURIComponent(paymentId)}`)
}

export async function getSquareCard(config: SquareConfig, cardId: string): Promise<SquareResult<{ card: SquareCard }>> {
  return squareRequest(config, "GET", `/v2/cards/${encodeURIComponent(cardId)}`)
}

export async function createSquareSubscription(
  config: SquareConfig,
  input: { customerId: string; cardId: string; planVariationId: string; startDate: string; idempotencyKey: string },
): Promise<SquareResult<{ subscription: SquareSubscription }>> {
  return squareRequest(config, "POST", "/v2/subscriptions", {
    idempotency_key: input.idempotencyKey,
    location_id: config.locationId,
    customer_id: input.customerId,
    plan_variation_id: input.planVariationId,
    card_id: input.cardId,
    start_date: input.startDate,
  })
}

/**
 * The first month is paid at checkout, so billing starts one calendar month later
 * (clamped to the last day of a shorter month). Returns YYYY-MM-DD.
 */
export function subscriptionStartDate(from: Date = new Date()): string {
  const year = from.getUTCFullYear()
  const month = from.getUTCMonth() + 1
  const day = from.getUTCDate()
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const start = new Date(Date.UTC(year, month, Math.min(day, lastDay)))
  return start.toISOString().slice(0, 10)
}
