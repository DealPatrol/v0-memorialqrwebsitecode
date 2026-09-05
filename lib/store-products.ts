export type StoreProduct = {
  id: string
  name: string
  price: number
  monthlyFee: number
  category: "Human"
  image: string
  badge: string
  description: string
  features: string[]
  fulfillment: {
    provider: "Printify"
    product: "Acrylic Keychain"
  }
  memorialType: "voice-keychain"
}

export const VOICE_KEYCHAIN_PRODUCT: StoreProduct = {
  id: "voice-keychain",
  name: "Voice Memorial Acrylic Keychain",
  price: 24.99,
  monthlyFee: 4.99,
  category: "Human",
  image: "/images/voice-keychain.svg",
  badge: "New",
  description:
    "A Printify acrylic keychain with a unique QR code that opens your loved one's memorial and puts their voice front and center.",
  features: [
    "Printify acrylic keychain (print-on-demand fulfillment)",
    "Unique QR code for one memorial",
    "Prominent voicemail or voice-recording player",
    "Photos, videos, music, biography, family and links",
  ],
  fulfillment: {
    provider: "Printify",
    product: "Acrylic Keychain",
  },
  memorialType: "voice-keychain",
}

export const STORE_PRODUCTS = [VOICE_KEYCHAIN_PRODUCT] as const

export function getStoreProduct(productId: string) {
  return STORE_PRODUCTS.find((product) => product.id === productId)
}
