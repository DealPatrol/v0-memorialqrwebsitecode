import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Dancing_Script, Great_Vibes } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { LiveChatButton } from "@/components/live-chat-button"
import { Footer } from "@/components/footer"
import { Analytics } from "@vercel/analytics/next"
import { CONCIERGE_PRODUCTS } from "@/lib/catalog"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { SITE_NAME, SITE_URL, SUPPORT_EMAIL } from "@/lib/site"

const conciergeOffer = CONCIERGE_PRODUCTS.find((product) => product.id === "concierge-digital")

if (!conciergeOffer) {
  throw new Error("Concierge digital offer is missing from the catalog")
}

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION

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
  title: {
    default: "MemorialsQR",
  },
  description: `MemorialsQR sells QR memorial keepsakes. Each one opens an online memorial page with ${HOSTING_INCLUDED_YEARS} years of hosting included.`,
  keywords:
    "online memorial page, digital memorial for loved one, QR code memorial, pet memorial page, memorial website, concierge memorial service",
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  facebook: {
    appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
  },
  twitter: {
    card: "summary_large_image",
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
  ...(googleSiteVerification ? { verification: { google: googleSiteVerification } } : {}),
  applicationName: SITE_NAME,
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
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/icon.svg`,
        },
        email: SUPPORT_EMAIL,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Hanceville",
          addressRegion: "AL",
          addressCountry: "US",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Service",
        name: "Concierge memorial service",
        description: `We build the memorial page. ${HOSTING_INCLUDED_YEARS} years of hosting included.`,
        serviceType: "Concierge memorial service",
        provider: { "@id": `${SITE_URL}/#organization` },
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}/concierge`,
          price: conciergeOffer.price.toFixed(2),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      },
    ],
  }

  return (
    <html
      lang="en-US"
      suppressHydrationWarning
      className={`${inter.variable} ${dancingScript.variable} ${greatVibes.variable} bg-background`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="MemorialsQR Blog RSS Feed"
          href={`${SITE_URL}/feed.xml`}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
          <Footer />
          <Toaster />
          <LiveChatButton />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
