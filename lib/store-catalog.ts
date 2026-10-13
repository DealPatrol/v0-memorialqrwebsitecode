import type { StoreCategory } from "@/lib/catalog"
import type { EnvSource } from "@/lib/fulfillment-readiness"
import { envValue } from "@/lib/fulfillment-readiness"

/**
 * Add a product by appending one object. Collections, checkout, and Printify
 * payloads all read this list. Human Printify blueprint ids are the ones from
 * the researched sheet. Tailkept pet products take blueprint ids from env
 * because DealPatrol/pet-keepsakes was not readable from this environment.
 */

export type CollectionId =
  | "pet-memorials"
  | "human-memorials"
  | "ornaments"
  | "garden-outdoor"
  | "jewelry-keepsakes"

export type QrSurface = "print" | "cover" | "card-insert"

export type PersonalizationField = "photo" | "name" | "dates" | "message"

type PrintifyFulfillment = {
  kind: "printify"
  /** Null until PRINTIFY_<ID>_BLUEPRINT_ID is set. Human products set the sheet's id. */
  blueprintId: number | null
}

type MerchizeFulfillment = { kind: "merchize" }

export type StoreCatalogProduct = {
  id: string
  name: string
  price: number
  image: string
  imageAlt: string
  collections: CollectionId[]
  category: StoreCategory
  description: string
  features: string[]
  personalization: PersonalizationField[]
  fulfillment: PrintifyFulfillment | MerchizeFulfillment
  qr: {
    surface: QrSurface
    /** Printed size. Never under 1 inch. */
    minInches: number
    /**
     * Narrower plausible width of the print area, in inches.
     * The QR scale uses this so a larger blank still prints at least minInches.
     */
    printWidthInches: number
    note: string
  }
  googleCategory: string
}

export type StoreCollection = {
  id: CollectionId
  title: string
  description: string
}

const FIELDS: PersonalizationField[] = ["photo", "name", "dates", "message"]

function qrFeature(minInches: number, surface: QrSurface): string {
  const where =
    surface === "cover" ? " on the cover" : surface === "card-insert" ? " on a packed card insert" : ""
  return `Black-on-white QR code${where}, at least ${minInches} inches`
}

export const STORE_COLLECTIONS: StoreCollection[] = [
  {
    id: "pet-memorials",
    title: "Pet Memorials",
    description: "Keepsakes for a dog, a cat, or another companion. Each one opens their memorial page.",
  },
  {
    id: "human-memorials",
    title: "Human Memorials",
    description: "Photo keepsakes for a person, each printed with a QR code to their memorial page.",
  },
  {
    id: "ornaments",
    title: "Christmas and Remembrance Ornaments",
    description: "Ornaments and wind chimes that carry a photo, a name, and a QR code.",
  },
  {
    id: "garden-outdoor",
    title: "Garden and Outdoor",
    description: "Stones and outdoor pieces for a garden, a porch, or a grave.",
  },
  {
    id: "jewelry-keepsakes",
    title: "Jewelry and Keepsakes",
    description: "Pendants, necklaces, and small keepsakes. The QR code is large enough to scan.",
  },
]

const HOME = "Home & Garden > Decor"
const BLANKET = "Home & Garden > Linens & Bedding > Bedding > Blankets"
const BOOK = "Media > Books"
const JEWELRY = "Apparel & Accessories > Jewelry > Necklaces"
const PILLOW = "Home & Garden > Linens & Bedding > Bedding > Pillowcases & Shams"

export const STORE_CATALOG: StoreCatalogProduct[] = [
  {
    id: "human-photo-canvas",
    name: "Photo Canvas, 1.25 in",
    price: 49.99,
    image: "/images/custom-dog-portrait-drawing.jpg",
    imageAlt: "A printed portrait used as the sample for a photo canvas",
    collections: ["human-memorials"],
    category: "Human",
    description:
      "A 1.25 inch photo canvas with their picture, name, and dates. The QR code prints at 1.25 inches, black on white.",
    features: ["Photo, name, and dates", qrFeature(1.25, "print"), "Printify blueprint 1159"],
    personalization: FIELDS,
    fulfillment: { kind: "printify", blueprintId: 1159 },
    qr: {
      surface: "print",
      minInches: 1.25,
      printWidthInches: 8,
      note: "QR sits on the canvas print, black on white, 1.25 inches wide.",
    },
    googleCategory: "Home & Garden > Decor > Artwork > Posters, Prints, & Visual Artwork",
  },
  {
    id: "human-velveteen-blanket",
    name: "Velveteen Photo Blanket",
    price: 49.99,
    image: "/memorial-qr-code-products.jpg",
    imageAlt: "Memorial keepsakes that include a QR code",
    collections: ["human-memorials"],
    category: "Human",
    description: "A velveteen photo blanket with their picture and a black-on-white QR code at least 1.5 inches wide.",
    features: ["Photo, name, and dates", qrFeature(1.5, "print"), "Printify blueprint 522"],
    personalization: FIELDS,
    fulfillment: { kind: "printify", blueprintId: 522 },
    qr: { surface: "print", minInches: 1.5, printWidthInches: 30, note: "QR prints on the blanket at 1.5 inches." },
    googleCategory: BLANKET,
  },
  {
    id: "human-guest-book",
    name: "Memorial Guest Book",
    price: 39.99,
    image: "/images/memorial-plaque-books.jpeg",
    imageAlt: "A memorial book beside a plaque",
    collections: ["human-memorials"],
    category: "Human",
    description: "A hardcover guest book journal. The QR code prints on the cover, black on white, 1.5 inches wide.",
    features: ["Hardcover journal", qrFeature(1.5, "cover"), "Printify blueprint 485"],
    personalization: FIELDS,
    fulfillment: { kind: "printify", blueprintId: 485 },
    qr: { surface: "cover", minInches: 1.5, printWidthInches: 6, note: "QR prints on the cover." },
    googleCategory: BOOK,
  },
  {
    id: "human-photo-book",
    name: "Hardcover Photo Book",
    price: 39.99,
    image: "/images/memorial-plaque-books.jpeg",
    imageAlt: "A memorial book",
    collections: ["human-memorials"],
    category: "Human",
    description: "A hardcover photo book. The QR code prints on the cover, black on white, 1.5 inches wide.",
    features: ["Hardcover photo book", qrFeature(1.5, "cover"), "Printify blueprint 2737"],
    personalization: FIELDS,
    fulfillment: { kind: "printify", blueprintId: 2737 },
    qr: { surface: "cover", minInches: 1.5, printWidthInches: 6, note: "QR prints on the cover." },
    googleCategory: BOOK,
  },
  {
    id: "human-sherpa-blanket",
    name: "Sherpa Photo Blanket",
    price: 49.99,
    image: "/memorial-qr-code-products.jpg",
    imageAlt: "Memorial keepsakes that include a QR code",
    collections: ["human-memorials"],
    category: "Human",
    description: "A sherpa photo blanket with their picture and a black-on-white QR code at least 1.5 inches wide.",
    features: ["Sherpa blanket", qrFeature(1.5, "print"), "Printify blueprint 238"],
    personalization: FIELDS,
    fulfillment: { kind: "printify", blueprintId: 238 },
    qr: { surface: "print", minInches: 1.5, printWidthInches: 30, note: "QR prints on the blanket at 1.5 inches." },
    googleCategory: BLANKET,
  },
  {
    id: "human-wood-sign",
    name: "Celebration of Life Wood Sign",
    price: 49.99,
    image: "/images/plaques-gold-silver-black.jpeg",
    imageAlt: "Memorial plaques with QR codes",
    collections: ["human-memorials"],
    category: "Human",
    description: "A wood sign for a celebration of life, with their name and a 1.5 inch black-on-white QR code.",
    features: ["Wood sign", qrFeature(1.5, "print"), "Printify blueprint 1530"],
    personalization: FIELDS,
    fulfillment: { kind: "printify", blueprintId: 1530 },
    qr: { surface: "print", minInches: 1.5, printWidthInches: 8, note: "QR prints on the sign at 1.5 inches." },
    googleCategory: "Home & Garden > Decor > Decorative Plaques",
  },
  {
    id: "human-round-pendant",
    name: "Round Photo Pendant",
    price: 34.99,
    image: "/images/wooden-pendant-hand.jpeg",
    imageAlt: "A memorial pendant held in a hand",
    collections: ["human-memorials", "jewelry-keepsakes"],
    category: "Human",
    description:
      "A round photo pendant. The photo prints on the pendant. The QR code prints on a card insert, 1.25 inches, black on white.",
    features: ["Round photo pendant", qrFeature(1.25, "card-insert"), "Printify blueprint 5374"],
    personalization: FIELDS,
    fulfillment: { kind: "printify", blueprintId: 5374 },
    qr: {
      surface: "card-insert",
      minInches: 1.25,
      printWidthInches: 3.5,
      note: "QR is on the card insert, not shrunk onto the pendant.",
    },
    googleCategory: JEWELRY,
  },
  {
    id: "human-heart-pendant",
    name: "Heart Photo Pendant",
    price: 34.99,
    image: "/images/wooden-pendant-worn.jpeg",
    imageAlt: "A memorial pendant worn on a chain",
    collections: ["human-memorials", "jewelry-keepsakes"],
    category: "Human",
    description:
      "A heart photo pendant. The photo prints on the pendant. The QR code prints on a card insert, 1.25 inches, black on white.",
    features: ["Heart photo pendant", qrFeature(1.25, "card-insert"), "Printify blueprint 5444"],
    personalization: FIELDS,
    fulfillment: { kind: "printify", blueprintId: 5444 },
    qr: {
      surface: "card-insert",
      minInches: 1.25,
      printWidthInches: 3.5,
      note: "QR is on the card insert, not shrunk onto the pendant.",
    },
    googleCategory: JEWELRY,
  },
  {
    id: "human-cross-necklace",
    name: "Engraved Cross Necklace",
    price: 39.99,
    image: "/images/wooden-pendant-worn.jpeg",
    imageAlt: "A memorial necklace",
    collections: ["human-memorials", "jewelry-keepsakes"],
    category: "Human",
    description:
      "An engraved cross bar necklace. The name is engraved. The QR code prints on a card insert, 1.25 inches, black on white.",
    features: ["Engraved cross bar", qrFeature(1.25, "card-insert"), "Printify blueprint 2661"],
    personalization: FIELDS,
    fulfillment: { kind: "printify", blueprintId: 2661 },
    qr: {
      surface: "card-insert",
      minInches: 1.25,
      printWidthInches: 3.5,
      note: "The bar is engraved. The QR code is on the card insert so it stays at least 1.25 inches.",
    },
    googleCategory: JEWELRY,
  },
  {
    id: "human-slate-desk-plaque",
    name: "Slate Desk Plaque",
    price: 44.99,
    image: "/images/slate-memorial-coaster.jpeg",
    imageAlt: "A dark slate memorial piece with engraved lettering",
    collections: ["human-memorials"],
    category: "Human",
    description: "A slate desk plaque with their name and a 1.25 inch black-on-white QR code.",
    features: ["Slate desk plaque", qrFeature(1.25, "print"), "Printify blueprint 5344"],
    personalization: FIELDS,
    fulfillment: { kind: "printify", blueprintId: 5344 },
    qr: { surface: "print", minInches: 1.25, printWidthInches: 5.5, note: "QR prints on the plaque at 1.25 inches." },
    googleCategory: "Home & Garden > Decor > Decorative Plaques",
  },
  {
    id: "human-garden-stone-1",
    name: "Slate Garden Stone, One Side",
    price: 39.99,
    image: "/images/pet-garden-stone.jpeg",
    imageAlt: "A garden stone",
    collections: ["human-memorials", "garden-outdoor"],
    category: "Human",
    description:
      "A one-sided slate garden stone. Fulfilled through Merchize, not sent to Printify. The QR code is 1.5 inches, black on white.",
    features: ["One-sided slate stone", qrFeature(1.5, "print"), "Merchize, placed by hand in admin"],
    personalization: FIELDS,
    fulfillment: { kind: "merchize" },
    qr: { surface: "print", minInches: 1.5, printWidthInches: 6, note: "QR prints on the stone at 1.5 inches." },
    googleCategory: "Home & Garden > Decor",
  },
  {
    id: "human-garden-stone-2",
    name: "Slate Garden Stone, Two Sides",
    price: 39.99,
    image: "/images/pet-garden-stone.jpeg",
    imageAlt: "A garden stone",
    collections: ["human-memorials", "garden-outdoor"],
    category: "Human",
    description:
      "A two-sided slate garden stone. Fulfilled through Merchize, not sent to Printify. The QR code is 1.5 inches, black on white.",
    features: ["Two-sided slate stone", qrFeature(1.5, "print"), "Merchize, placed by hand in admin"],
    personalization: FIELDS,
    fulfillment: { kind: "merchize" },
    qr: { surface: "print", minInches: 1.5, printWidthInches: 6, note: "QR prints on the stone at 1.5 inches." },
    googleCategory: "Home & Garden > Decor",
  },
  {
    id: "human-wind-chime",
    name: "Glass Ornament Wind Chime",
    price: 44.99,
    image: "/memorial-qr-code-products.jpg",
    imageAlt: "Memorial keepsakes that include a QR code",
    collections: ["human-memorials", "ornaments", "garden-outdoor"],
    category: "Human",
    description:
      "A glass ornament wind chime. Fulfilled through Merchize, not sent to Printify. The QR code is 1.25 inches, black on white.",
    features: ["Glass ornament wind chime", qrFeature(1.25, "print"), "Merchize, placed by hand in admin"],
    personalization: FIELDS,
    fulfillment: { kind: "merchize" },
    qr: { surface: "print", minInches: 1.25, printWidthInches: 3, note: "QR prints at 1.25 inches on the ornament." },
    googleCategory: HOME,
  },
  {
    id: "human-pillow-case",
    name: "Memorial Pillow Case",
    price: 34.99,
    image: "/memorial-qr-code-products.jpg",
    imageAlt: "Memorial keepsakes that include a QR code",
    collections: ["human-memorials"],
    category: "Human",
    description:
      "A pillow case with their photo. Fulfilled through Merchize, not sent to Printify. The QR code is 1.5 inches, black on white.",
    features: ["Pillow case", qrFeature(1.5, "print"), "Merchize, placed by hand in admin"],
    personalization: FIELDS,
    fulfillment: { kind: "merchize" },
    qr: { surface: "print", minInches: 1.5, printWidthInches: 15, note: "QR prints on the pillow case at 1.5 inches." },
    googleCategory: PILLOW,
  },
  {
    id: "pet-photo-ornament",
    name: "Pet Photo Ornament",
    price: 24.99,
    image: "/images/pet-frame-dog-photo.jpg",
    imageAlt: "A framed photo of a dog",
    collections: ["pet-memorials", "ornaments"],
    category: "Pet",
    description:
      "A round ceramic ornament printed with a pet photo and name. US shipping is included. The QR code is 1 inch, black on white.",
    features: ["Round ceramic ornament", qrFeature(1, "print"), "Printed after checkout"],
    personalization: FIELDS,
    fulfillment: { kind: "printify", blueprintId: null },
    qr: { surface: "print", minInches: 1, printWidthInches: 3, note: "QR prints on the ornament at 1 inch." },
    googleCategory: HOME,
  },
  {
    id: "pet-ornament-2-pack",
    name: "Pet Photo Ornament 2-Pack",
    price: 44.99,
    image: "/images/pet-frame-dog-photo.jpg",
    imageAlt: "A framed photo of a dog",
    collections: ["pet-memorials", "ornaments"],
    category: "Pet",
    description: "Two matching ceramic photo ornaments, one to keep and one to give, with one shared memorial QR code.",
    features: ["Two ornaments", qrFeature(1, "print"), "One memorial page for the pair"],
    personalization: FIELDS,
    fulfillment: { kind: "printify", blueprintId: null },
    qr: { surface: "print", minInches: 1, printWidthInches: 3, note: "Each ornament carries the same 1 inch QR code." },
    googleCategory: HOME,
  },
  {
    id: "pet-memorial-canvas",
    name: "Pet Memorial Canvas",
    price: 59.99,
    image: "/images/custom-dog-portrait-drawing.jpg",
    imageAlt: "A printed pet portrait",
    collections: ["pet-memorials"],
    category: "Pet",
    description: "A 12 by 16 inch memorial canvas with the pet's photo, name, dates, and a 1.25 inch QR code.",
    features: ["12 by 16 inch canvas", qrFeature(1.25, "print"), "Memorial page included"],
    personalization: FIELDS,
    fulfillment: { kind: "printify", blueprintId: null },
    qr: { surface: "print", minInches: 1.25, printWidthInches: 12, note: "QR prints on the canvas at 1.25 inches." },
    googleCategory: "Home & Garden > Decor > Artwork > Posters, Prints, & Visual Artwork",
  },
  {
    id: "pet-sherpa-blanket",
    name: "Pet Photo Sherpa Blanket",
    price: 64.99,
    image: "/images/pet-frame-dog-photo.jpg",
    imageAlt: "A photo of a dog",
    collections: ["pet-memorials"],
    category: "Pet",
    description: "A 50 by 60 inch sherpa blanket with a large pet photo and a 1.5 inch QR code.",
    features: ["50 by 60 inch sherpa", qrFeature(1.5, "print"), "Memorial page included"],
    personalization: FIELDS,
    fulfillment: { kind: "printify", blueprintId: null },
    qr: { surface: "print", minInches: 1.5, printWidthInches: 30, note: "QR prints on the blanket at 1.5 inches." },
    googleCategory: BLANKET,
  },
  {
    id: "pet-framed-portrait",
    name: "Framed Pet Portrait",
    price: 59.99,
    image: "/images/pet-frame-dog-photo.jpg",
    imageAlt: "A framed photo of a dog",
    collections: ["pet-memorials"],
    category: "Pet",
    description: "A 12 by 16 inch framed portrait with the pet's photo, name, and a 1.25 inch QR code.",
    features: ["12 by 16 inch framed print", qrFeature(1.25, "print"), "Memorial page included"],
    personalization: FIELDS,
    fulfillment: { kind: "printify", blueprintId: null },
    qr: { surface: "print", minInches: 1.25, printWidthInches: 12, note: "QR prints on the portrait at 1.25 inches." },
    googleCategory: "Home & Garden > Decor > Picture Frames",
  },
]

const EXTRA_COLLECTIONS: Record<string, CollectionId[]> = {
  "qr-memorial-plaque": ["human-memorials"],
  "pet-memorial-plaque": ["pet-memorials"],
  "keep-card": ["human-memorials"],
  "memorial-coaster": ["human-memorials"],
  "acrylic-keyring": ["human-memorials", "jewelry-keepsakes"],
  "voice-keychain": ["human-memorials", "jewelry-keepsakes"],
  "slate-plaque": ["human-memorials"],
  "pet-tag": ["pet-memorials", "jewelry-keepsakes"],
  "photo-block": ["human-memorials"],
}

export function getStoreCatalogProduct(id: string): StoreCatalogProduct | undefined {
  return STORE_CATALOG.find((product) => product.id === id)
}

export function collectionIdsForProduct(id: string): CollectionId[] {
  return getStoreCatalogProduct(id)?.collections ?? EXTRA_COLLECTIONS[id] ?? []
}

export function printifyEnvNames(productId: string): { blueprint: string; provider: string; variant: string } {
  const key = productId.toUpperCase().replace(/[^A-Z0-9]+/g, "_")
  return {
    blueprint: `PRINTIFY_${key}_BLUEPRINT_ID`,
    provider: `PRINTIFY_${key}_PROVIDER_ID`,
    variant: `PRINTIFY_${key}_VARIANT_ID`,
  }
}

export function resolvedBlueprintId(product: StoreCatalogProduct, env: EnvSource): number | null {
  if (product.fulfillment.kind !== "printify") return null
  const fromEnv = envValue(env, printifyEnvNames(product.id).blueprint)
  if (/^[1-9]\d*$/.test(fromEnv)) return Number(fromEnv)
  return product.fulfillment.blueprintId
}

export function isMerchizeProduct(id: string): boolean {
  return getStoreCatalogProduct(id)?.fulfillment.kind === "merchize"
}
