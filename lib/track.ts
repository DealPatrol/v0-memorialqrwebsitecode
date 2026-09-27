// Minimal, vendor-neutral conversion hook. It only pushes to window.dataLayer
// and dispatches a DOM event; nothing is sent anywhere unless a tag manager /
// Google tag / Meta Pixel is later installed and configured to listen for it.
// Currency is USD, matching Square checkout.

type PurchaseItem = { id: string; name: string; price: number; quantity: number }

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

export function trackPurchase(params: { transactionId: string; value: number; currency?: string; items: PurchaseItem[] }) {
  if (typeof window === "undefined") return
  try {
    const payload = {
      event: "purchase",
      ecommerce: {
        transaction_id: params.transactionId,
        value: Number(params.value.toFixed(2)),
        currency: params.currency ?? "USD",
        items: params.items.map((item) => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    }
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ ecommerce: null })
    window.dataLayer.push(payload)
    window.dispatchEvent(new CustomEvent("mqr:purchase", { detail: payload }))
  } catch {
    // Tracking must never block checkout.
  }
}
