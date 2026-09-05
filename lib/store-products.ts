export const STORE_PRODUCTS = [
  {
    id: "keep-card",
    name: "Keep Card — Sticker + Online Memorial Profile",
    price: 39.99,
    monthlyFee: 4.99,
    provider: "Printful",
    fulfillmentProduct: "Kiss-cut vinyl sticker",
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
    id: "slate-plaque",
    name: "Slate Desk Plaque",
    price: 39.99,
    monthlyFee: 4.99,
    provider: "Printify",
    fulfillmentProduct: "Slate desk plaque",
    description:
      "A personalized slate desk plaque for indoor memorial display, printed with a QR code linked to the digital memorial.",
    features: [
      "Custom QR print file for each memorial",
      "Designed for indoor desk or shelf display",
      "Includes a link to the digital memorial",
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
