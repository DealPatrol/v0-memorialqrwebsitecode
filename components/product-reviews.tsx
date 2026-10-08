"use client"

import { useEffect, useState } from "react"
import type { PublishedReview } from "@/lib/product-reviews"

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<PublishedReview[] | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`)
      .then((response) => response.json())
      .then((data: { reviews?: PublishedReview[] }) => {
        if (!cancelled) setReviews(Array.isArray(data.reviews) ? data.reviews : [])
      })
      .catch(() => {
        if (!cancelled) setReviews([])
      })
    return () => {
      cancelled = true
    }
  }, [productId])

  const published = reviews ?? []

  return (
    <section className="mt-10 space-y-4" aria-label="Reviews">
      <h2 className="text-2xl font-semibold text-foreground">Reviews</h2>
      {published.length === 0 ? (
        <p className="text-muted-foreground">
          When a family shares a review after their order is fulfilled, it will appear here.
        </p>
      ) : (
        <ul className="space-y-4">
          {published.map((review) => (
            <li key={`${review.createdAt}-${review.authorName}-${review.body.slice(0, 24)}`} className="rounded-xl border bg-white p-4">
              <p className="font-semibold text-foreground">
                {review.authorName} · {review.rating} out of 5
              </p>
              <p className="mt-2 text-muted-foreground">{review.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
