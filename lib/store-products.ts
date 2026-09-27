export const STORE_PRODUCTS = [
  {
    id: "keep-card",
    name: "Keep Card — Sticker + Online Memorial Profile",
    price: 39.99,
    monthlyFee: 4.99,
    provider: "Printful",
    fulfillmentProduct: "Kiss-cut vinyl sticker",
    templateIdEnvironment: "PRINTFUL_KEEP_CARD_TEMPLATE_ID",
    description:
      "A peel-and-stick memorial QR sticker for smooth indoor surfaces, paired with a personalized online memorial profile.",
    features: [
      "Custom QR print file for each memorial",
      "Peel-and-stick kiss-cut vinyl",
      "Includes a link to the digital memorial",
      "Printed and fulfilled by Printful",
    ],
  },
  {
    id: "memorial-coaster",
    name: "Cork Memorial Coaster",
    price: 19.99,
    monthlyFee: 4.99,
    provider: "Printful",
    fulfillmentProduct: "Cork-back coaster",
    templateIdEnvironment: "PRINTFUL_MEMORIAL_COASTER_TEMPLATE_ID",
    description:
      "A custom cork-back coaster printed with a unique QR code that opens the linked digital memorial.",
    features: [
      "Custom QR print file for each memorial",
      "Cork backing protects indoor surfaces",
      "Includes a link to the digital memorial",
      "Printed and fulfilled by Printful",
    ],
  },
  {
    id: "acrylic-keyring",
    name: "Acrylic QR Keyring",
    price: 19.99,
    monthlyFee: 4.99,
    provider: "Printify",
    fulfillmentProduct: "Acrylic keyring",
    templateIdEnvironment: "PRINTIFY_ACRYLIC_KEYRING_PRODUCT_ID",
    description:
      "A lightweight acrylic keepsake keyring printed with a unique QR code for the digital memorial.",
    features: [
      "Custom QR print file for each memorial",
      "Portable acrylic keepsake",
      "Includes a link to the digital memorial",
      "Printed and fulfilled by Printify",
    ],
  },
  {
    id: "voice-keychain",
    name: "Voice Keychain",
    price: 24.99,
    monthlyFee: 4.99,
    provider: "Printify",
    fulfillmentProduct: "Acrylic keyring",
    templateIdEnvironment: "PRINTIFY_VOICE_KEYCHAIN_PRODUCT_ID",
    description:
      "An acrylic QR keychain linked to a memorial page where your loved one's voicemail or voice recording is featured prominently.",
    features: [
      "Custom QR print file for each memorial",
      "Guided voicemail or voice recording upload",
      "Opens the memorial's featured voice player",
      "Printed and fulfilled by Printify",
    ],
  },
  {
    id: "slate-plaque",
    name: "Slate Desk Plaque",
    // Cole decision (Sep 25, 2026): $49 with 10 years of memorial hosting included.
    // Square has no catalog item for this; the charge is computed from this price.
    price: 49.0,
    monthlyFee: 0,
    provider: "Printify",
    fulfillmentProduct: "Slate desk plaque",
    templateIdEnvironment: "PRINTIFY_SLATE_PLAQUE_PRODUCT_ID",
    description:
      "A personalized slate desk plaque for indoor memorial display, printed with a QR code linked to the digital memorial.",
    features: [
      "Custom QR print file for each memorial",
      "Designed for indoor desk or shelf display",
      "10 years of memorial page hosting included",
      "Printed and fulfilled by Printify",
    ],
  },
  {
    id: "pet-tag",
    name: "Pet QR Tag",
    price: 24.99,
    monthlyFee: 4.99,
    provider: "Printify",
    fulfillmentProduct: "Pet/dog tag",
    templateIdEnvironment: "PRINTIFY_PET_TAG_PRODUCT_ID",
    description:
      "A personalized pet tag printed with a unique QR code that opens your pet's digital memorial.",
    features: [
      "Custom QR print file for each memorial",
      "Compact pet memorial keepsake",
      "Includes a link to the digital memorial",
      "Printed and fulfilled by Printify",
    ],
  },
  {
    id: "photo-block",
    name: "Memorial Photo Block",
    price: 59.99,
    monthlyFee: 4.99,
    provider: "Printify",
    fulfillmentProduct: "Photo block",
    templateIdEnvironment: "PRINTIFY_PHOTO_BLOCK_PRODUCT_ID",
    description:
      "A personalized indoor photo block featuring a favorite image and a unique QR code linked to the digital memorial.",
    features: [
      "Custom photo and QR print file",
      "Designed for indoor display",
      "Includes a link to the digital memorial",
      "Printed and fulfilled by Printify",
    ],
  },
] as const

export type StoreProduct = (typeof STORE_PRODUCTS)[number]
export type StoreProductId = StoreProduct["id"]

export const STORE_PRODUCTS_BY_ID: Record<StoreProductId, StoreProduct> = Object.fromEntries(
  STORE_PRODUCTS.map((product) => [product.id, product]),
) as Record<StoreProductId, StoreProduct>

export function isStoreProductId(id: string): id is StoreProductId {
  return id in STORE_PRODUCTS_BY_ID
}

/** Years of memorial page hosting included with a product (no monthly fee during that term). */
export const HOSTING_INCLUDED_YEARS: Partial<Record<StoreProductId, number>> = {
  "slate-plaque": 10,
}

export function hostingIncludedYears(id: string): number {
  return isStoreProductId(id) ? HOSTING_INCLUDED_YEARS[id] ?? 0 : 0
}

/** A cart is one memorial; if it contains a hosting-included product, no monthly subscription is created. */
export function cartIncludesHosting(items: { id: string }[]): boolean {
  return items.some((item) => hostingIncludedYears(item.id) > 0)
}
