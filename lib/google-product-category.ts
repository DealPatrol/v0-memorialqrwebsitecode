/**
 * Official Google product taxonomy paths. Numeric ids are accepted too;
 * the path is what a person reviewing the feed can check.
 * Photo blocks have no exact taxonomy entry; picture frames is the closest real one.
 * The digital memorial is a file and a page, not a shipped plaque.
 */
const GOOGLE_PRODUCT_CATEGORY: Record<string, string> = {
  "digital-memorial": "Software > Digital Goods & Currency",
  "keep-card":
    "Arts & Entertainment > Hobbies & Creative Arts > Arts & Crafts > Art & Crafting Materials > Embellishments & Trims > Decorative Stickers",
  "memorial-coaster": "Home & Garden > Kitchen & Dining > Barware > Coasters",
  "acrylic-keyring": "Apparel & Accessories > Handbag & Wallet Accessories > Keychains",
  "voice-keychain": "Apparel & Accessories > Handbag & Wallet Accessories > Keychains",
  "slate-plaque": "Home & Garden > Decor > Decorative Plaques",
  "pet-tag": "Animals & Pet Supplies > Pet Supplies > Pet ID Tags",
  "photo-block": "Home & Garden > Decor > Picture Frames",
  "qr-memorial-plaque": "Home & Garden > Decor > Decorative Plaques",
  "pet-memorial-plaque": "Home & Garden > Decor > Decorative Plaques",
}

export function hasGoogleProductCategory(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(GOOGLE_PRODUCT_CATEGORY, id)
}

export function googleProductCategory(id: string): string {
  const category = GOOGLE_PRODUCT_CATEGORY[id]
  if (!category) {
    throw new Error(`Missing Google product category for ${id}`)
  }
  return category
}
