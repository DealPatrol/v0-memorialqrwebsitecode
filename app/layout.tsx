import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { LiveChatButton } from "@/components/live-chat-button"
import { OrganizationSchema, WebSiteSchema, LocalBusinessSchema, ServiceSchema } from "@/components/seo/structured-data"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://memorialsqr.com"),
  title: {
    default: "Memorial QR - Digital Memorial Plaques | QR Code Memorials with Lifetime Hosting",
    template: "%s | Memorial QR",
  },
  description:
    "Create beautiful QR code memorial plaques that connect visitors to photos, videos, and stories of your loved ones. Starting at $39.89 with lifetime hosting. Free shipping. 30-day guarantee.",
  keywords: [
    "memorial QR code",
    "digital memorial",
    "QR code memorial plaque",
    "memorial plaque",
    "grave marker QR code",
    "cemetery QR code",
    "headstone QR code",
    "remembrance plaque",
    "memorial tribute",
    "online memorial",
    "digital obituary",
    "memorial website",
    "QR code grave marker",
    "lasting tribute",
    "memorial keepsake",
    "honor loved one",
    "memorial gift",
    "personalized memorial",
    "weatherproof memorial plaque",
    "lifetime memorial hosting",
  ],
  authors: [{ name: "Memorial QR", url: "https://memorialsqr.com" }],
  creator: "Memorial QR",
  publisher: "Memorial QR",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://memorialsqr.com",
    siteName: "Memorial QR",
    title: "Memorial QR - Create Lasting Digital Memorials with QR Code Plaques",
    description:
      "Honor your loved ones with beautiful QR code memorial plaques. Unlimited photos & videos, lifetime hosting, free shipping. Starting at $39.89.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Memorial QR - Digital Memorial Plaques with QR Codes",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@memorialqr",
    creator: "@memorialqr",
    title: "Memorial QR - Digital Memorial Plaques",
    description: "Create beautiful QR code memorial plaques with lifetime hosting. Starting at $39.89.",
    images: ["/og-image.jpg"],
  },
  facebook: {
    appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "your-google-verification-code",
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  category: "Memorial Services",
  classification: "Business",
  referrer: "origin-when-cross-origin",
  generator: "Next.js",
  applicationName: "Memorial QR",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Memorial QR",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  other: {
    "msapplication-TileColor": "#7c3aed",
    "theme-color": "#7c3aed",
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
    "format-detection": "telephone=no",
    "geo.region": "US",
    "geo.placename": "United States",
    rating: "General",
    distribution: "Global",
    "revisit-after": "7 days",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#7c3aed" },
    { media: "(prefers-color-scheme: dark)", color: "#7c3aed" },
  ],
  colorScheme: "light",
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
      style={{
        fontFamily: 'var(--font-inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
      }}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Dancing+Script:wght@400;500;600;700&family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-RBP2W2XN7P"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-RBP2W2XN7P');
            `,
          }}
        />
      </head>
      <body>
        <OrganizationSchema />
        <WebSiteSchema />
        <LocalBusinessSchema />
        <ServiceSchema />

        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
          <Toaster />
          <Analytics />
          <SpeedInsights />
          <LiveChatButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
