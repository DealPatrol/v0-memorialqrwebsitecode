import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Dancing_Script, Great_Vibes } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ExitIntentPopup } from "@/components/exit-intent-popup"
import { LiveChatButton } from "@/components/live-chat-button"
import { SocialProofTicker } from "@/components/social-proof-ticker"
import { Footer } from "@/components/footer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
})

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing-script",
  display: "swap",
  preload: false,
})

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
  display: "swap",
  preload: false,
})

export const metadata: Metadata = {
  title: "Memorial QR Codes | Digital Tombstone & Pet Memorials with Lifetime Hosting",
  description:
    "Transform cemetery tombstones and pet memorials with weather-resistant QR plaques. Create interactive digital tributes with photos, videos & lifetime hosting. Trusted by 10,000+ families.",
  keywords:
    "memorial QR codes, QR code tombstones, headstone memorial tags, cemetery QR codes, gravestone QR plaque, digital memorial, pet memorial QR, tombstone QR code, headstone memorial, memorial services",
  authors: [{ name: "Memorial QR" }],
  creator: "Memorial QR",
  publisher: "Memorial QR",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://memorialqr.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Memorial QR Codes | Digital Cemetery & Pet Memorials",
    description:
      "Transform traditional tombstone memorials with weather-resistant QR codes. Create lifetime digital tributes with photos, videos & stories. Trusted by 10,000+ families.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://memorialqr.com",
    siteName: "Memorial QR",
    images: [
      {
        url: "/images/41730040-9590-452b-80df.jpeg",
        width: 1200,
        height: 630,
        alt: "Memorial QR Codes for Tombstones & Pet Memorials - Digital Gravestone Tributes with Lifetime Hosting",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  facebook: {
    appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
  },
  twitter: {
    card: "summary_large_image",
    title: "Memorial QR Codes | Digital Memorials with Lifetime Hosting",
    description:
      "Weather-resistant QR plaques for cemetery headstones and pet memorials. Create lasting digital tributes.",
    images: ["/images/41730040-9590-452b-80df.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563eb",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Memorial QR",
    description: "Premium memorial QR code service providing digital tombstone memorials and cemetery tributes",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://memorialqr.com",
    telephone: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "",
    email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "",
    priceRange: "$$",
    servesCuisine: null,
    paymentAccepted: ["Credit Card", "Debit Card"],
    openingHours: "Mo-Su 00:00-23:59",
    image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://memorialqr.com"}/images/41730040-9590-452b-80df.jpeg`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "10000",
    },
    sameAs: [],
  }

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Memorial QR Code Services",
    description:
      "Premium memorial QR codes for tombstones, headstones, and pet memorials. Weather-resistant digital memorial solutions.",
    brand: {
      "@type": "Brand",
      name: "Memorial QR",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "CAD",
      lowPrice: "14.99",
      highPrice: "89.99",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "10000",
    },
  }

  return (
    <html
      lang="en-CA"
      suppressHydrationWarning
      className={`${inter.variable} ${dancingScript.variable} ${greatVibes.variable} bg-background`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Memorial QR Blog RSS Feed"
          href={`${process.env.NEXT_PUBLIC_SITE_URL || "https://memorialqr.com"}/feed.xml`}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
          <Footer />
          <Toaster />
          <Analytics />
          <SpeedInsights />
          <ExitIntentPopup />
          <LiveChatButton />
          <SocialProofTicker />
        </ThemeProvider>
      </body>
    </html>
  )
}
