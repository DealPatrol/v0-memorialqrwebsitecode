const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type PublishedReview = {
  authorName: string
  rating: number
  body: string
  createdAt: string
}

export type ReviewDraft = {
  token: string
  authorName: string
  rating: number
  body: string
}

export function parseReviewSubmission(body: unknown): { ok: true; value: ReviewDraft } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Open the review link from your email." }
  const record = body as Record<string, unknown>
  const token = typeof record.token === "string" ? record.token.trim() : ""
  const authorName = typeof record.authorName === "string" ? record.authorName.trim() : ""
  const bodyText = typeof record.body === "string" ? record.body.trim() : ""
  const rating = typeof record.rating === "number" ? record.rating : Number(record.rating)

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)) {
    return { ok: false, error: "Open the review link from your email." }
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: "Choose a rating from 1 to 5." }
  }
  if (bodyText.length < 20 || bodyText.length > 2000) {
    return { ok: false, error: "Write at least a sentence, in 2000 characters or fewer." }
  }
  if (authorName.length > 80) return { ok: false, error: "Name is too long." }
  if (EMAIL_PATTERN.test(authorName)) return { ok: false, error: "Use a name, not an email address." }

  return {
    ok: true,
    value: {
      token,
      authorName: authorName || "A family",
      rating,
      body: bodyText,
    },
  }
}

/** Structured data includes ratings only when at least one published review exists. */
export function reviewStructuredData(reviews: PublishedReview[]) {
  if (reviews.length === 0) return null
  const ratingValue = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  return {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: ratingValue.toFixed(1),
      reviewCount: String(reviews.length),
    },
    review: reviews.map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.authorName },
      reviewBody: review.body,
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(review.rating),
        bestRating: "5",
        worstRating: "1",
      },
    })),
  }
}
