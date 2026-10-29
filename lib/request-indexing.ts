/** Host and path rules for the apex canonical and pages Google should not index. */

export const WWW_HOST = "www.memorialsqr.com"

const NOINDEX_EXACT = new Set([
  "/cart",
  "/order-success",
  "/order-confirmation",
  "/create-sample-memorial",
  "/sample-memorial-created",
  "/create-profile",
  "/test-square",
])

export function isWwwHost(hostHeader: string | null): boolean {
  return hostHeader?.split(":")[0] === WWW_HOST
}

/** Thin, simulated, or account pages. A 200 with almost no content was showing up as a soft 404. */
export function shouldNoindexPath(pathname: string): boolean {
  if (NOINDEX_EXACT.has(pathname)) return true
  if (pathname === "/auth" || pathname.startsWith("/auth/")) return true
  if (pathname.startsWith("/dashboard")) return true
  if (pathname.startsWith("/admin")) return true
  return false
}

/**
 * URLs that render an empty or "not found" shell. Real order links keep their query
 * and stay reachable; the bare URL does not.
 */
export function shouldRewriteNotFound(pathname: string, params: { get(name: string): string | null }): boolean {
  if (pathname === "/test-square") return true
  if (pathname === "/order-confirmation" && !params.get("orderNumber")?.trim()) return true
  if (pathname === "/order-success" && !params.get("order")?.trim()) return true
  return false
}
