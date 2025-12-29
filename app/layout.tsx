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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing-script",
  display: "swap",
})

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Memorial QR Codes for Tombstones & Headstones | Digital Gravestone Memorials",
  description:
    "Premium memorial QR codes for tombstones, headstones, and gravestones. Transform cemetery memorials with weather-resistant QR code plaques. Lifetime digital tributes with photos, videos, and stories. Free shipping.",
  keywords:
    "memorial QR codes for tombstones, QR code for headstone, gravestone QR code, cemetery memorial QR, tombstone QR plaque, headstone memorial tag, QR code cemetery marker, digital gravestone memorial, pet memorial QR, memorial QR tag, interactive tombstone, cemetery QR tribute",
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
    title: "Memorial QR Codes for Tombstones & Headstones | Digital Cemetery Memorials",
    description:
      "Transform traditional tombstone memorials with QR codes. Weather-resistant headstone tags link to unlimited photos, videos, and life stories. Perfect for cemetery memorials and gravestone tributes.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://memorialqr.com",
    siteName: "Memorial QR",
    images: [
      {
        url: "/images/41730040-9590-452b-80df.jpeg",
        width: 1200,
        height: 630,
        alt: "Memorial QR Codes for Tombstones and Headstones - Digital Gravestone Tributes",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  facebook: {
    appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
  },
  twitter: {
    card: "summary_large_image",
    title: "Memorial QR Codes for Tombstones & Headstones",
    description:
      "Premium weather-resistant QR code plaques for cemetery headstones. Create interactive digital memorials with unlimited photos and videos.",
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
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${dancingScript.variable} ${greatVibes.variable} bg-background`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
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
