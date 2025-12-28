import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { CookieConsent } from "@/components/cookie-consent"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { Suspense } from "react"
import Link from "next/link"
import { Header } from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Memorial QR - Preserve Memories with QR Codes",
  description: "Create lasting digital memorials with our weather-resistant QR codes for headstones and memorials.",
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-rose-600">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#e11d48" />
        <meta property="og:title" content="Memorial QR - Preserve Memories with QR Codes" />
        <meta
          property="og:description"
          content="Create lasting digital memorials with our weather-resistant QR codes for headstones and memorials."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://memorialqr.com" />
        <meta property="og:image" content="https://memorialqr.com/images/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body className={`${inter.className} bg-rose-600 min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AnalyticsProvider>
            <Suspense>
              <Header />
              <div className="bg-rose-600 min-h-screen">{children}</div>
              <CookieConsent />
            </Suspense>
          </AnalyticsProvider>
        </ThemeProvider>
        {/* Footer with Privacy and Terms links */}
        <footer className="bg-rose-700 border-t border-rose-500 py-6 text-white">
          <div className="container mx-auto px-4 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Memorial QR. All rights reserved.</p>
            <div className="flex justify-center space-x-4 mt-2">
              <Link href="/privacy-policy" className="hover:text-rose-200">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-rose-200">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-rose-200">
                Contact Us
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
