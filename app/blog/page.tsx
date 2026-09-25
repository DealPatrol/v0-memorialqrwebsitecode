import { Header } from "@/components/header"
import { BlogContent } from "@/components/blog-content"
import { Suspense } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Memorial QR Blog | Digital Tribute Guides & Grief Support Resources",
  description:
    "Expert advice on memorial QR codes, digital tributes, and honoring loved ones. Read helpful articles about creating lasting memorials and navigating grief.",
  keywords:
    "memorial blog, digital tribute articles, QR code memorials, headstone advice, pet memorial ideas, grief support, memorial guidance",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Memorial QR Blog | Digital Tribute Guides",
    description: "Articles about digital memorials and honoring loved ones with QR code tributes.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://memorialqr.com"}/blog`,
  },
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <Suspense fallback={<div className="min-h-screen" />}>
        <BlogContent />
      </Suspense>
    </div>
  )
}
