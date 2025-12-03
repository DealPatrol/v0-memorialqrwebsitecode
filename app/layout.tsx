import type React from "react"
import type { Metadata } from "next"
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
  title: "Memorial QR - Digital Memorial Plaques",
  description:
    "Create beautiful QR code memorial plaques that connect visitors to photos, videos, and stories of your loved ones life.",
  keywords: "memorial, QR code, digital memorial, memorial plaque, remembrance, tribute",
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
    title: "Memorial QR - Digital Memorial Plaques",
    description:
      "Create beautiful QR code memorial plaques that connect visitors to photos, videos, and stories of your loved ones life.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://memorialqr.com",
    siteName: "Memorial QR",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Memorial QR - Digital Memorial Plaques",
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
    title: "Memorial QR - Digital Memorial Plaques",
    description:
      "Create beautiful QR code memorial plaques that connect visitors to photos, videos, and stories of your loved ones life.",
    images: ["/og-image.jpg"],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${dancingScript.variable} ${greatVibes.variable}`}
    >
      <head>
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
