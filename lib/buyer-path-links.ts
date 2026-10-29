/** Descriptive anchors for the pages Search Console already shows near page 1. */
export const PRIORITY_BUYER_LINKS = [
  { href: "/pet-digital-memorial-qr", label: "Pet QR memorial" },
  { href: "/pet-memorials", label: "Pet memorial QR codes" },
  { href: "/digital-memorial-page-gift", label: "Digital memorial page gift" },
  { href: "/create-memorial-qr-code-online", label: "Create a memorial QR code online" },
] as const

export function buyerPathLabel(path: string, fallback: string): string {
  const match = PRIORITY_BUYER_LINKS.find((link) => link.href === path)
  return match ? match.label : fallback
}
