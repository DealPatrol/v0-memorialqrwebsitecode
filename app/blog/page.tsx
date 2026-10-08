import { Header } from "@/components/header"
import { BlogContent } from "@/components/blog-content"
import { Suspense } from "react"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.blog)

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
