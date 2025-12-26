import type { Metadata } from "next"
import ProductPageClient from "./ProductPageClient"

// Single product data
const getProduct = (id: string) => {
  if (id !== "memorial-qr-plaque") return null

  return {
    id: "memorial-qr-plaque",
    name: "Memorial QR Plaque",
    category: "memorial",
    material: "Premium Aluminum",
    price: 149,
    originalPrice: 199,
    rating: 4.9,
    reviews: 247,
    images: [
      "/placeholder.svg?height=500&width=500&text=Memorial+QR+Main",
      "/placeholder.svg?height=500&width=500&text=Memorial+QR+Side",
      "/placeholder.svg?height=500&width=500&text=Memorial+QR+Back",
      "/placeholder.svg?height=500&width=500&text=Memorial+QR+Detail",
    ],
    description:
      "Honor your loved one with our beautiful Memorial QR Plaque. This weather-resistant aluminum plaque features a custom QR code that links to a digital memorial page where family and friends can share memories, photos, and stories forever.",
    features: [
      "Weather Resistant Premium Aluminum Construction",
      "Lifetime Digital Memorial Page Included",
      "Custom QR Code Laser Engraved",
      "Professional Text Engraving (up to 6 lines)",
      "Easy Wall or Ground Mounting Hardware",
      "5 Year Fade & Weather Guarantee",
      "Free Shipping & Professional Setup",
      "24/7 Memorial Support & Maintenance",
    ],
    specifications: {
      Material: "Premium Aluminum with Powder Coating",
      Finish: "Weather-Resistant Powder Coat",
      Mounting: "Wall or Ground Mount (hardware included)",
      "QR Code": "Laser Engraved for Permanence",
      Warranty: "5 Years Against Fading & Weather Damage",
      "Production Time": "3-5 Business Days",
      "Digital Memorial": "Lifetime Hosting Included",
      Support: "24/7 Customer Support",
    },
    sizes: [
      { name: "6x4 inches", price: 149, popular: false, description: "Perfect for intimate settings" },
      { name: "8x6 inches", price: 179, popular: true, description: "Most popular size" },
      { name: "10x8 inches", price: 209, popular: false, description: "Great for outdoor display" },
      { name: "12x10 inches", price: 249, popular: false, description: "Premium large format" },
    ],
    colors: [
      { name: "Classic Black", hex: "#1a1a1a", available: true, description: "Timeless and elegant" },
      { name: "Elegant Silver", hex: "#c0c0c0", available: true, description: "Modern and sophisticated" },
      { name: "Antique Bronze", hex: "#cd7f32", available: true, description: "Warm and traditional" },
      { name: "Pearl White", hex: "#f8f8ff", available: true, description: "Pure and peaceful" },
    ],
    engraving: {
      included: "Professional text engraving (up to 6 lines)",
      additional: "Custom artwork and photos available for $25",
    },
    shipping: {
      free: true,
      time: "5-7 business days",
      expedited: "2-3 business days (+$25)",
    },
    testimonials: [
      {
        name: "Sarah Johnson",
        rating: 5,
        text: "The quality exceeded our expectations. The QR code makes it so easy for family members to share memories and photos. Highly recommend!",
        location: "California",
        verified: true,
      },
      {
        name: "Michael Chen",
        rating: 5,
        text: "Beautiful craftsmanship and the digital memorial page is perfect for our family. Customer service was exceptional throughout the process.",
        location: "Texas",
        verified: true,
      },
      {
        name: "Emily Rodriguez",
        rating: 5,
        text: "This memorial plaque has brought our family together. Being able to scan the QR code and see all the memories is truly special.",
        location: "Florida",
        verified: true,
      },
    ],
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = getProduct(params.id)

  if (!product) {
    return {
      title: "Product Not Found | Memorial QR",
      description: "The requested product could not be found.",
    }
  }

  return {
    title: `${product.name} - ${product.material} | Memorial QR`,
    description: `${product.description} • ${product.price} with free shipping • ${product.rating} stars from ${product.reviews} reviews • 5-year guarantee.`,
    keywords: `${product.name}, ${product.material}, memorial plaque, QR code memorial, weather resistant memorial, ${product.category}`,
    openGraph: {
      title: `${product.name} - Premium ${product.material}`,
      description: product.description,
      type: "product",
      url: `https://memorialsqr.com/products/${params.id}`,
      images: [
        {
          url: product.images?.[0] || "https://memorialsqr.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - $${product.price}`,
      description: `${product.rating} ⭐ • ${product.reviews} reviews • Free shipping • 5-year guarantee`,
      images: [product.images?.[0] || "https://memorialsqr.com/og-image.jpg"],
    },
    alternates: {
      canonical: `https://memorialsqr.com/products/${params.id}`,
    },
  }
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id as string)
  return <ProductPageClient product={product} />
}
