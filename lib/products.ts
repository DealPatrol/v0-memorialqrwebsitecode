export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  image: string
  features: string[]
  category: "plaque" | "accessory" | "pet"
}

// Monthly subscription for memorial website
export const SUBSCRIPTION_PRICE_CENTS = 499 // $4.99/month

// All products available in the store
export const PRODUCTS: Product[] = [
  {
    id: "silver-plaque",
    name: "Silver Memorial Plaque",
    description: "Premium silver aluminum plaque with laser-engraved QR code. Weather-resistant and elegant.",
    priceInCents: 3989, // $39.89
    image: "/images/f88be955-5dd5-4c48-8640.jpeg",
    features: [
      "Weather-resistant aluminum",
      "Laser-engraved QR code",
      "Mounting hardware included",
      "5-year guarantee",
    ],
    category: "plaque",
  },
  {
    id: "gold-plaque",
    name: "Gold Memorial Plaque",
    description: "Elegant gold-finished aluminum plaque with custom QR code. Perfect for indoor or outdoor use.",
    priceInCents: 4989, // $49.89
    image: "/images/f88be955-5dd5-4c48-8640.jpeg",
    features: ["Premium gold finish", "Laser-engraved QR code", "Mounting hardware included", "5-year guarantee"],
    category: "plaque",
  },
  {
    id: "black-plaque",
    name: "Black Memorial Plaque",
    description: "Classic black aluminum plaque with white QR code engraving. Timeless and dignified.",
    priceInCents: 3989, // $39.89
    image: "/images/f88be955-5dd5-4c48-8640.jpeg",
    features: ["Matte black finish", "High-contrast QR code", "Mounting hardware included", "5-year guarantee"],
    category: "plaque",
  },
  {
    id: "wooden-keychain",
    name: "Wooden QR Keychain",
    description: "Natural wood keychain with laser-engraved QR code. Carry their memory everywhere.",
    priceInCents: 1999, // $19.99
    image: "/images/2e4fdbea-5150-40fa-bb82.jpeg",
    features: ["Natural wood grain", "Portable memorial", "Durable construction", "Key ring included"],
    category: "accessory",
  },
  {
    id: "stone-memorial",
    name: "Stone Memorial Marker",
    description: "Durable stone memorial with engraved QR code. Perfect for gardens or gravesites.",
    priceInCents: 7999, // $79.99
    image: "/images/e4de3d0a-3087-4815-924d.jpg",
    features: ["Natural stone material", "Weatherproof", "Ground or wall mount", "Lifetime durability"],
    category: "plaque",
  },
  {
    id: "picture-frame-plaque",
    name: "Photo Frame Plaque",
    description: "Beautiful plaque with photo display and QR code. Shows their picture alongside their memorial.",
    priceInCents: 5999, // $59.99
    image: "/aluminum-card.jpg",
    features: ["Photo display area", "QR code engraved", "Tabletop or wall mount", "Premium aluminum"],
    category: "plaque",
  },
  {
    id: "pet-qr-frame",
    name: "Pet Memorial QR Frame",
    description: "Beautiful picture frame with laser-engraved QR code. Display their photo and link to their memorial.",
    priceInCents: 4499,
    image: "/pet-frame-qr-on-wood-border.jpg",
    features: [
      "Holds 4x6 or 5x7 photo",
      "QR code engraved in frame",
      "Solid wood construction",
      "Tabletop or wall mount",
    ],
    category: "pet",
  },
  {
    id: "pet-sketch-poster",
    name: "Custom Pet Sketch Poster",
    description: "We turn your pet's photo into a beautiful hand-drawn style sketch poster with QR code in the corner.",
    priceInCents: 5999,
    image: "/dog-portrait-sketch-artistic-poster-framed-with-sm.jpg",
    features: [
      "Photo-to-sketch conversion",
      "QR code in bottom right",
      "Premium matte paper",
      "Multiple sizes available",
    ],
    category: "pet",
  },
  {
    id: "pet-garden-stone",
    name: "Pet Garden Memorial Stone",
    description: "Weather-resistant garden stone with engraved QR code. Perfect for backyard memorials.",
    priceInCents: 3999,
    image: "/pet-memorial-garden-stone-with-qr-code-paw-print.jpg",
    features: ["Paw print design", "Weather-resistant resin", "QR code engraved", "Indoor or outdoor use"],
    category: "pet",
  },
  {
    id: "pet-collar-tag",
    name: "Pet Memorial Collar Tag",
    description: "Small memorial tag with QR code to keep their memory close. Attaches to your keychain or bag.",
    priceInCents: 1499,
    image: "/pet-memorial-tag-with-qr-code-paw-shape-metal.jpg",
    features: ["Paw-shaped design", "Stainless steel", "Micro QR code", "Keychain attachment"],
    category: "pet",
  },
]

export interface Package {
  id: string
  name: string
  description: string
  priceInCents: number
  videos: number
  audio: number
  photos: number
}

export interface AddOn {
  id: string
  name: string
  description: string
  priceInCents: number
  image: string
}

// Legacy packages (kept for backward compatibility)
export const PACKAGES: Record<string, Package> = {
  basic: {
    id: "basic",
    name: "Basic Memorial",
    description: "Digital memorial with QR plaque",
    priceInCents: 3989,
    videos: 3,
    audio: 10,
    photos: 30,
  },
  standard: {
    id: "standard",
    name: "Standard Memorial",
    description: "Enhanced memorial with more storage",
    priceInCents: 4989,
    videos: 5,
    audio: 15,
    photos: 50,
  },
  premium: {
    id: "premium",
    name: "Premium Memorial",
    description: "Full-featured memorial experience",
    priceInCents: 7999,
    videos: 10,
    audio: 30,
    photos: 100,
  },
}

// Legacy add-ons (kept for backward compatibility)
export const ADDONS: Record<string, AddOn> = {
  wooden_qr: {
    id: "wooden_qr",
    name: "Wooden QR Keychain",
    description: "Natural wood finish with laser-engraved QR code",
    priceInCents: 1999,
    image: "/images/2e4fdbea-5150-40fa-bb82.jpeg",
  },
  picture_plaque: {
    id: "picture_plaque",
    name: "Picture Plaque",
    description: "Custom photo plaque with memorial details",
    priceInCents: 3998,
    image: "/aluminum-card.jpg",
  },
  stone_qr: {
    id: "stone_qr",
    name: "Stone Memorial",
    description: "Durable stone memorial with engraved QR code",
    priceInCents: 5699,
    image: "/images/e4de3d0a-3087-4815-924d.jpg",
  },
}

// Legacy plaque options (kept for backward compatibility)
export const PLAQUES = {
  silver: {
    id: "silver_plaque",
    name: "Silver Memorial Plaque",
    description: "Premium silver finish with engraved QR code",
    image: "/images/silver.jpg",
  },
  gold: {
    id: "gold_plaque",
    name: "Gold Memorial Plaque",
    description: "Elegant gold finish with engraved QR code",
    image: "/images/gold.jpg",
  },
  black: {
    id: "black_plaque",
    name: "Black Memorial Plaque",
    description: "Classic black finish with engraved QR code",
    image: "/images/black.jpg",
  },
}

// Helper to format cents to dollars
export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2)
}

// Helper to get product by ID
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

// Legacy helper for calculating totals
export function calculateTotalCents(packageId: string, addonIds: string[]): number {
  const pkg = PACKAGES[packageId]
  if (!pkg) return 0

  const addonsTotal = addonIds.reduce((sum, id) => {
    const addon = ADDONS[id]
    return sum + (addon?.priceInCents || 0)
  }, 0)

  return pkg.priceInCents + addonsTotal
}
