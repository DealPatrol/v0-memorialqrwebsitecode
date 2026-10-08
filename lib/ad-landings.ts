export type AdLanding = {
  id: string
  path: string
  title: string
  description: string
  h1: string
  paragraphs: string[]
  ctaHref: string
  ctaLabel: string
  trackProduct: boolean
}

export const adLandingPages = {
  plaqueGift: {
    id: "plaqueGift",
    path: "/ads/memorial-qr-plaque-gift",
    title: "QR Plaque Gift | MemorialsQR",
    description:
      "Give a metal QR plaque that opens a memorial page of photos and stories. $29.99 once, shipping included in the United States.",
    h1: "A memorial QR plaque you can give",
    paragraphs: [
      "The gift is a metal plaque with their name, the dates, and one QR code. The code opens a memorial page. Photos can be added after you give it.",
      "The plaque is $29.99, shipping included, to a United States address. We make it in Alabama. This page does not start a subscription.",
    ],
    ctaHref: "/checkout/simple?product=qr-memorial-plaque",
    ctaLabel: "Buy the QR Memorial Plaque",
    trackProduct: true,
  },
  petPlaque: {
    id: "petPlaque",
    path: "/ads/pet-memorial-qr-plaque",
    title: "Pet Memorial QR Plaque | MemorialsQR",
    description:
      "A pet memorial QR plaque opens photos of a companion. $29.99 once, shipping included. We do not sell collar tags.",
    h1: "A pet memorial QR plaque",
    paragraphs: [
      "The plaque is for the person who is grieving a dog, a cat, or another companion. The QR code opens a page for their photos. We do not sell a collar tag.",
      "It is $29.99, shipping included in the United States. Put the pet's name on the first line when you check out.",
    ],
    ctaHref: "/checkout/simple?product=qr-memorial-plaque",
    ctaLabel: "Buy the pet memorial plaque",
    trackProduct: true,
  },
  partner: {
    id: "partner",
    path: "/ads/funeral-home-partner",
    title: "Funeral Home Partner | MemorialsQR",
    description:
      "Funeral homes can ask about offering QR memorial plaques to families. The inquiry does not place an order or charge a card.",
    h1: "Offer a QR memorial plaque to families",
    paragraphs: [
      "Families ask for a way to share photos after the service. A QR code on a plaque opens one memorial page. Guests do not need an account.",
      "Tell us about your funeral home. We reply by email. The form does not place an order and does not charge a card.",
    ],
    ctaHref: "/funeral-homes#inquiry",
    ctaLabel: "Send a wholesale inquiry",
    trackProduct: false,
  },
} as const satisfies Record<string, AdLanding>

export const adLandingList: AdLanding[] = Object.values(adLandingPages)
