import { HOSTING_MONTHLY_PRICE } from "@/lib/pricing"

export type StoreCategory = "Human" | "Pet"

export interface StoreProduct {
  id: string
  name: string
  price: number
  monthlyFee: number
  image: string
  badge: string
  category: StoreCategory
  features: string[]
  description: string
}

export interface CheckoutProduct {
  id: string
  name: string
  price: number
  monthlyFee: number
}

export type FulfillmentProvider = "printful" | "printify"

/** A physical product that can be sold only when every requiredEnv name is set. */
export interface PodProduct {
  id: string
  name: string
  price: number
  monthlyFee: number
  provider: FulfillmentProvider
  fulfillmentProduct: string
  /** Env var holding the Printful sync variant id or the Printify product id. */
  templateEnv: string
  /** Printify variant id. Printful leaves this null. */
  variantEnv: string | null
  requiredEnv: string[]
  category: StoreCategory
  description: string
  features: string[]
}

const PRINTFUL_SHARED = ["PRINTFUL_API_TOKEN"] as const
const PRINTIFY_SHARED = ["PRINTIFY_API_TOKEN", "PRINTIFY_SHOP_ID"] as const

/**
 * The only physical products that may be sold. Prices are USD.
 * A product stays hidden until its requiredEnv values are present on the server.
 */
export const POD_PRODUCTS: PodProduct[] = [
  {
    id: "keep-card",
    name: "Keep Card — Sticker + Online Memorial Profile",
    price: 39.99,
    monthlyFee: HOSTING_MONTHLY_PRICE,
    provider: "printful",
    fulfillmentProduct: "Kiss-cut vinyl sticker, 3×3 in.",
    templateEnv: "PRINTFUL_KEEP_CARD_TEMPLATE_ID",
    variantEnv: null,
    requiredEnv: [...PRINTFUL_SHARED, "PRINTFUL_KEEP_CARD_TEMPLATE_ID"],
    category: "Human",
    description:
      "A peel-and-stick memorial QR sticker for smooth indoor surfaces, paired with an online memorial page.",
    features: ["Unique QR for this memorial", "Kiss-cut vinyl sticker", "Printed by Printful", "Ships in the United States"],
  },
  {
    id: "memorial-coaster",
    name: "Cork Memorial Coaster",
    price: 19.99,
    monthlyFee: HOSTING_MONTHLY_PRICE,
    provider: "printful",
    fulfillmentProduct: "Cork-back coaster",
    templateEnv: "PRINTFUL_MEMORIAL_COASTER_TEMPLATE_ID",
    variantEnv: null,
    requiredEnv: [...PRINTFUL_SHARED, "PRINTFUL_MEMORIAL_COASTER_TEMPLATE_ID"],
    category: "Human",
    description: "A cork-back coaster printed with a QR code that opens the memorial page.",
    features: ["Unique QR for this memorial", "Cork backing", "Printed by Printful", "Ships in the United States"],
  },
  {
    id: "acrylic-keyring",
    name: "Acrylic QR Keyring",
    price: 19.99,
    monthlyFee: HOSTING_MONTHLY_PRICE,
    provider: "printify",
    fulfillmentProduct: "Acrylic keyring",
    templateEnv: "PRINTIFY_ACRYLIC_KEYRING_PRODUCT_ID",
    variantEnv: "PRINTIFY_ACRYLIC_KEYRING_VARIANT_ID",
    requiredEnv: [...PRINTIFY_SHARED, "PRINTIFY_ACRYLIC_KEYRING_PRODUCT_ID", "PRINTIFY_ACRYLIC_KEYRING_VARIANT_ID"],
    category: "Human",
    description: "A lightweight acrylic keyring printed with a QR code for the memorial page.",
    features: ["Unique QR for this memorial", "Acrylic keepsake", "Printed by Printify", "Ships in the United States"],
  },
  {
    id: "voice-keychain",
    name: "Voice Keychain",
    price: 24.99,
    monthlyFee: HOSTING_MONTHLY_PRICE,
    provider: "printify",
    fulfillmentProduct: "Acrylic keyring",
    templateEnv: "PRINTIFY_VOICE_KEYCHAIN_PRODUCT_ID",
    variantEnv: "PRINTIFY_VOICE_KEYCHAIN_VARIANT_ID",
    requiredEnv: [...PRINTIFY_SHARED, "PRINTIFY_VOICE_KEYCHAIN_PRODUCT_ID", "PRINTIFY_VOICE_KEYCHAIN_VARIANT_ID"],
    category: "Human",
    description:
      "An acrylic QR keychain for a memorial page where a voice recording can be added after checkout.",
    features: ["Unique QR for this memorial", "Same acrylic keyring blank", "Printed by Printify", "Ships in the United States"],
  },
  {
    id: "slate-plaque",
    name: "Slate Desk Plaque",
    price: 39.99,
    monthlyFee: HOSTING_MONTHLY_PRICE,
    provider: "printify",
    fulfillmentProduct: "Slate desk plaque",
    templateEnv: "PRINTIFY_SLATE_PLAQUE_PRODUCT_ID",
    variantEnv: "PRINTIFY_SLATE_PLAQUE_VARIANT_ID",
    requiredEnv: [...PRINTIFY_SHARED, "PRINTIFY_SLATE_PLAQUE_PRODUCT_ID", "PRINTIFY_SLATE_PLAQUE_VARIANT_ID"],
    category: "Human",
    description: "An indoor slate desk plaque printed with a QR code that opens the memorial page.",
    features: ["Unique QR for this memorial", "Indoor desk display", "Printed by Printify", "Ships in the United States"],
  },
  {
    id: "pet-tag",
    name: "Pet QR Tag",
    price: 24.99,
    monthlyFee: HOSTING_MONTHLY_PRICE,
    provider: "printify",
    fulfillmentProduct: "Pet tag",
    templateEnv: "PRINTIFY_PET_TAG_PRODUCT_ID",
    variantEnv: "PRINTIFY_PET_TAG_VARIANT_ID",
    requiredEnv: [...PRINTIFY_SHARED, "PRINTIFY_PET_TAG_PRODUCT_ID", "PRINTIFY_PET_TAG_VARIANT_ID"],
    category: "Pet",
    description: "A pet tag printed with a QR code that opens the pet's memorial page.",
    features: ["Unique QR for this memorial", "Pet tag blank", "Printed by Printify", "Ships in the United States"],
  },
  {
    id: "photo-block",
    name: "Memorial Photo Block",
    price: 59.99,
    monthlyFee: HOSTING_MONTHLY_PRICE,
    provider: "printify",
    fulfillmentProduct: "Acrylic photo block",
    templateEnv: "PRINTIFY_PHOTO_BLOCK_PRODUCT_ID",
    variantEnv: "PRINTIFY_PHOTO_BLOCK_VARIANT_ID",
    requiredEnv: [...PRINTIFY_SHARED, "PRINTIFY_PHOTO_BLOCK_PRODUCT_ID", "PRINTIFY_PHOTO_BLOCK_VARIANT_ID"],
    category: "Human",
    description: "An indoor photo block printed with this order's memorial QR code.",
    features: ["Unique QR for this memorial", "Indoor display", "Printed by Printify", "Ships in the United States"],
  },
]

export function getPodProduct(id: string): PodProduct | undefined {
  return POD_PRODUCTS.find((product) => product.id === id)
}

/**
 * Physical catalog kept in code so it can be sold again, but not shown or
 * charged. None of these ids have an automatic supplier order on payment.
 */
const WITHHELD_PHYSICAL_PRODUCTS: StoreProduct[] = [
  {
    id: "memorial-locket",
    name: "Vintage Flower of Life Urn Necklace with Mini Jar Cremation Locket",
    price: 39.99,
    monthlyFee: HOSTING_MONTHLY_PRICE,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/04933625-2735-47aa-b480-d34dc7292a74.jpeg",
    badge: "Most Popular",
    category: "Human",
    features: [
      "Stainless steel filigree design with opening compartment",
      "Holds cremated ashes securely and safely",
      "Includes QR code linking to digital memorial",
      "Rose gold and silver finish options",
    ],
    description:
      "Stainless steel ash-filled memorial pendant featuring the sacred Flower of Life design. This elegant cremation urn necklace opens to hold a small amount of ashes or precious mementos. Perfect for women and men, this durable jewelry piece includes a QR code linking to your loved one's complete digital memorial, combining timeless design with modern technology for lasting remembrance.",
  },
  {
    id: "wooden-keychain-necklace",
    name: "Memorial QR Code Wooden Keychain or Necklace",
    price: 14.99,
    monthlyFee: HOSTING_MONTHLY_PRICE,
    image: "/images/17c80bbb-d33f-4068-8656.jpeg",
    badge: "Best Seller",
    category: "Human",
    features: [
      "Natural wood with laser-engraved QR code",
      "Choose keychain or necklace option",
      "Includes keyring or silver chain",
      "Portable memorial keepsake",
    ],
    description:
      "Beautiful wooden memorial QR code charm - wear as a necklace or carry as a keychain. Laser-engraved natural wood keeps your loved one's memory close always.",
  },
  {
    id: "slate-memorial-coaster",
    name: "Memorial Slate Coaster with QR Code",
    price: 24.99,
    monthlyFee: HOSTING_MONTHLY_PRICE,
    image: "/images/slate-memorial-coaster.jpeg",
    badge: "Popular",
    category: "Human",
    features: [
      "Natural slate with laser engraving",
      "Custom memorial text included",
      "QR code for digital tribute",
      "Beautiful home keepsake",
    ],
    description:
      "Elegant natural slate memorial coaster featuring 'Gone But Never Forgotten' with personalized name, dates, and laser-engraved QR code linking to a digital memorial.",
  },
  {
    id: "memorial-photo-frame",
    name: "Memorial Photo Frame with QR Code",
    price: 49.99,
    monthlyFee: HOSTING_MONTHLY_PRICE,
    image: "/images/0d120a50-1c8d-4a75-a564.jpeg",
    badge: "Premium",
    category: "Human",
    features: [
      "Displays cherished memorial photo",
      "Laser-engraved QR code plaque",
      "Elegant desktop or shelf display",
      "Personalized name engraving",
    ],
    description:
      "Beautiful memorial photo frame with integrated QR code plaque. Display your loved one's photo while providing instant access to their full digital memorial tribute.",
  },
  {
    id: "human-cremation-urn-wood",
    name: "Wooden Cremation Urn with QR Memorial Plaque",
    price: 89.99,
    monthlyFee: HOSTING_MONTHLY_PRICE,
    image: "/images/human-cremation-urn-wood.jpg",
    badge: "Premium",
    category: "Human",
    features: [
      "Solid wood construction (oak, walnut, or cherry)",
      "Large capacity for adult cremains",
      "Brass QR code memorial plaque",
      "Elegant tribute keepsake",
    ],
    description:
      "Premium wooden cremation urn with integrated QR code plaque. Beautiful, dignified memorial that connects to a full digital tribute honoring your loved one's life and legacy.",
  },
  {
    id: "pet-collar-memorial-tag",
    name: "Pet Memorial Collar with QR Code Tag",
    price: 19.99,
    monthlyFee: HOSTING_MONTHLY_PRICE,
    image: "/images/pet-collar-memorial.jpg",
    badge: "Pet",
    category: "Pet",
    features: [
      "Durable nylon or leather collar",
      "Stainless steel QR code tag",
      "Adjustable sizing for all breeds",
      "QR code opens the memorial page",
    ],
    description:
      "Keep your pet's memory close with this memorial collar featuring a durable QR code tag. Perfect for displaying on a photo or shadow box as a lasting tribute to your beloved companion.",
  },
  {
    id: "pet-garden-tombstone",
    name: "Pet Memorial Garden Stone with QR Code",
    price: 44.99,
    monthlyFee: HOSTING_MONTHLY_PRICE,
    image: "/images/pet-tombstone-garden.jpg",
    badge: "Pet",
    category: "Pet",
    features: [
      "Durable resin or composite stone",
      "Weather-proof outdoor display",
      "Brass QR code memorial plaque",
      "Garden or grave site marker",
    ],
    description:
      "Beautiful outdoor pet memorial stone perfect for gardens or grave sites. Features a permanent brass QR code plaque that links to your pet's digital memorial tribute.",
  },
  {
    id: "pet-cremation-urn-wood",
    name: "Wooden Pet Cremation Urn with QR Code",
    price: 34.99,
    monthlyFee: HOSTING_MONTHLY_PRICE,
    image: "/images/pet-cremation-urn-wood.jpg",
    badge: "Best Seller",
    category: "Pet",
    features: [
      "Natural wood with paw print design",
      "Laser-engraved QR code memorial",
      "Multiple sizes for all pets",
      "Beautiful tribute keepsake",
    ],
    description:
      "Elegant wooden pet cremation urn featuring a laser-engraved paw print and QR code. Available in multiple sizes to honor pets of all sizes with dignity and love.",
  },
  {
    id: "pet-cremation-urn-ceramic",
    name: "Ceramic Pet Cremation Urn with QR Memorial",
    price: 39.99,
    monthlyFee: HOSTING_MONTHLY_PRICE,
    image: "/images/pet-urn-ceramic.jpg",
    badge: "Pet",
    category: "Pet",
    features: [
      "High-quality ceramic construction",
      "Paw print and QR code design",
      "Multiple color options",
      "Elegant memorial display",
    ],
    description:
      "Beautiful ceramic pet urn with integrated paw print and QR code design. Modern, minimalist tribute that connects to your pet's full digital memorial story.",
  },
  {
    id: "pet-photo-frame-qr",
    name: "Pet Memorial Photo Frame with QR Code",
    price: 29.99,
    monthlyFee: HOSTING_MONTHLY_PRICE,
    image: "/images/pet-frame-dog-photo.jpg",
    badge: "Pet",
    category: "Pet",
    features: [
      "Displays favorite pet photo (5x7 or 4x6)",
      "QR code plaque at bottom",
      "Desktop or wall mount options",
      "Personalized with pet's name",
    ],
    description:
      "Cherish your pet's memory with this beautiful photo frame featuring an integrated QR code plaque. Display their photo while providing access to their complete digital memorial tribute.",
  },
  {
    id: "custom-pet-portrait-drawing",
    name: "Custom Pet Portrait Drawing with QR Code",
    price: 54.99,
    monthlyFee: HOSTING_MONTHLY_PRICE,
    image: "/images/custom-dog-portrait-drawing.jpg",
    badge: "Premium",
    category: "Pet",
    features: [
      "Custom illustrated pet portrait from photo",
      "Pet name and dates included",
      "QR code at bottom center",
      "High-quality digital print (11x14)",
    ],
    description:
      "Beautiful custom illustrated portrait of your beloved pet featuring their name, special dates, and QR code memorial at the bottom. A unique, artistic tribute to honor their memory.",
  },
  {
    id: "pet-shadow-box-collar",
    name: "Pet Memorial Shadow Box with Collar Display",
    price: 64.99,
    monthlyFee: HOSTING_MONTHLY_PRICE,
    image: "/images/pet-shadow-box-collar.jpg",
    badge: "Premium",
    category: "Pet",
    features: [
      "3D shadow box frame (8x10)",
      "Space for collar, tags, and photo",
      "Laser-engraved QR code plaque",
      "Wall-mount display case",
    ],
    description:
      "Preserve your pet's memory in this elegant 3D shadow box that holds their collar, tags, and favorite photo. Features an engraved QR code plaque connecting to their digital memorial.",
  },
]

/** Nothing physical is listed for sale until a supplier can fulfill it. */
export const STORE_PRODUCTS: StoreProduct[] = []

/** Standard metal plaque price, retained for the withheld catalog. */
export const PLAQUE_PRICE = 29.99

const WITHHELD_PLAQUE_PRODUCTS: CheckoutProduct[] = [
  { id: "gold-plaque", name: "Gold Memorial Plaque", price: PLAQUE_PRICE, monthlyFee: HOSTING_MONTHLY_PRICE },
  { id: "silver-plaque", name: "Silver Memorial Plaque", price: PLAQUE_PRICE, monthlyFee: HOSTING_MONTHLY_PRICE },
  { id: "black-plaque", name: "Black Memorial Plaque", price: PLAQUE_PRICE, monthlyFee: HOSTING_MONTHLY_PRICE },
]

export const PLAQUE_PRODUCTS: CheckoutProduct[] = []

/**
 * Concierge checkout charges $299.99 and $329.99. The marketing cards rounded
 * those to $299 and $329; the charged amounts are the source of truth.
 */
export const CONCIERGE_PRODUCTS: CheckoutProduct[] = [
  {
    id: "concierge-digital",
    name: "Concierge Service - Digital Link",
    price: 299.99,
    monthlyFee: HOSTING_MONTHLY_PRICE,
  },
  {
    id: "concierge-service",
    name: "Concierge Memorial Service",
    price: 299.99,
    monthlyFee: HOSTING_MONTHLY_PRICE,
  },
]

const WITHHELD_CONCIERGE_PLAQUE: CheckoutProduct = {
  id: "concierge-plaque",
  name: "Concierge Service - Physical Plaque",
  price: 329.99,
  monthlyFee: HOSTING_MONTHLY_PRICE,
}

/** The digital page itself. Hosting is billed monthly and nothing is shipped. */
export const DIGITAL_MEMORIAL: CheckoutProduct = {
  id: "digital-memorial",
  name: "Digital Memorial Page",
  price: 0,
  monthlyFee: HOSTING_MONTHLY_PRICE,
}

const REMOVED_PHYSICAL_IDS = new Set<string>([
  ...WITHHELD_PHYSICAL_PRODUCTS.map((product) => product.id),
  ...WITHHELD_PLAQUE_PRODUCTS.map((product) => product.id),
  WITHHELD_CONCIERGE_PLAQUE.id,
  "slate-coaster",
  "wooden-keychain",
  "photo-frame",
  "basic",
  "standard",
  "premium",
  "picture_plaque",
  "picture-plaque",
  "stone-qr",
  "stone_qr",
])

const CHECKOUT_PRODUCTS: CheckoutProduct[] = [...CONCIERGE_PRODUCTS]

const CHECKOUT_BY_ID = new Map(CHECKOUT_PRODUCTS.map((product) => [product.id, product]))

export function getCheckoutProduct(id: string): CheckoutProduct | undefined {
  if (REMOVED_PHYSICAL_IDS.has(id)) return undefined
  return CHECKOUT_BY_ID.get(id)
}

export function getStoreProduct(id: string): StoreProduct | undefined {
  if (REMOVED_PHYSICAL_IDS.has(id)) return undefined
  return STORE_PRODUCTS.find((product) => product.id === id)
}

export type ResolvedCheckoutItem = CheckoutProduct & { quantity: number }

/** Paid checkout lines. Physical and unknown ids return null so the order is rejected. */
export function resolvePaidCheckoutItems(items: unknown): ResolvedCheckoutItem[] | null {
  if (!Array.isArray(items) || items.length === 0) return null

  const resolved = items.flatMap((item): ResolvedCheckoutItem[] => {
    if (!item || typeof item !== "object" || !("id" in item) || typeof item.id !== "string") return []
    const product = getCheckoutProduct(item.id)
    if (!product) return []
    const rawQuantity = "quantity" in item && typeof item.quantity === "number" ? item.quantity : 1
    const quantity = Math.floor(rawQuantity)
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 99) return []
    return [{ ...product, quantity }]
  })

  return resolved.length === items.length ? resolved : null
}
