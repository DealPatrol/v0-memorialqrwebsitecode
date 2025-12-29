import { Header } from "@/components/header"
import { BlogContent } from "@/components/blog-content"
import { Suspense } from "react"

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <Suspense fallback={<div className="min-h-screen" />}>
        <BlogContent />
      </Suspense>
    </div>
  )
}
