import { Header } from "@/components/header"
import { ReviewForm } from "@/components/review-form"
import { assertMetadataLength, pageMetadata } from "@/lib/seo"

const title = "Share a Review | MemorialsQR"
const description = "Share how a fulfilled memorial order has been for your family. This page opens from the review email."
assertMetadataLength(title, description, "/review")

export const metadata = pageMetadata({
  title,
  description,
  path: "/review",
  index: false,
})

export default function ReviewPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token?.trim() ?? ""
  const valid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <Header />
      <main className="mx-auto max-w-xl px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground">Share a review</h1>
        <p className="mt-4 text-muted-foreground">
          This is for a family whose order has been fulfilled. A review is optional. We do not offer anything in exchange
          for one.
        </p>
        <div className="mt-8">
          {valid ? (
            <ReviewForm token={token} />
          ) : (
            <p className="text-muted-foreground">Open the link in the review email to write one.</p>
          )}
        </div>
      </main>
    </div>
  )
}
