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

/**
 * Sellable store catalog. Prices are the amounts /checkout/simple charges
 * for each product id. The slate coaster is $24.99 here (store Buy Now id
 * slate-memorial-coaster). The homepage previously listed the same coaster
 * as slate-coaster at $46.99; that id is an alias of this product.
 */
export const STORE_PRODUCTS: StoreProduct[] = [
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
      "Weather-resistant QR memorial",
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

/** Standard metal plaques. Homepage and checkout both charge this amount. */
export const PLAQUE_PRICE = 29.99

export const PLAQUE_PRODUCTS: CheckoutProduct[] = [
  { id: "gold-plaque", name: "Gold Memorial Plaque", price: PLAQUE_PRICE, monthlyFee: HOSTING_MONTHLY_PRICE },
  { id: "silver-plaque", name: "Silver Memorial Plaque", price: PLAQUE_PRICE, monthlyFee: HOSTING_MONTHLY_PRICE },
  { id: "black-plaque", name: "Black Memorial Plaque", price: PLAQUE_PRICE, monthlyFee: HOSTING_MONTHLY_PRICE },
]

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
  {
    id: "concierge-plaque",
    name: "Concierge Service - Physical Plaque",
    price: 329.99,
    monthlyFee: HOSTING_MONTHLY_PRICE,
  },
]

/** Older homepage ids that refer to a current store product. */
const PRODUCT_ALIASES: Record<string, string> = {
  "slate-coaster": "slate-memorial-coaster",
  "wooden-keychain": "wooden-keychain-necklace",
  "photo-frame": "memorial-photo-frame",
}

const CHECKOUT_PRODUCTS: CheckoutProduct[] = [
  ...STORE_PRODUCTS.map(({ id, name, price, monthlyFee }) => ({ id, name, price, monthlyFee })),
  ...PLAQUE_PRODUCTS,
  ...CONCIERGE_PRODUCTS,
]

const CHECKOUT_BY_ID = new Map(CHECKOUT_PRODUCTS.map((product) => [product.id, product]))

export function getCheckoutProduct(id: string): CheckoutProduct | undefined {
  const canonicalId = PRODUCT_ALIASES[id] ?? id
  return CHECKOUT_BY_ID.get(canonicalId)
}

export function getStoreProduct(id: string): StoreProduct | undefined {
  const canonicalId = PRODUCT_ALIASES[id] ?? id
  return STORE_PRODUCTS.find((product) => product.id === canonicalId)
}
