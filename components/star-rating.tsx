"use client"

import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  showReviews?: boolean
  reviewCount?: number
  size?: "sm" | "md" | "lg"
}

export function StarRating({ rating, showReviews = false, reviewCount = 0, size = "md" }: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeClasses[size]} ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
      {showReviews && (
        <span className={`${textSizeClasses[size]} text-white/90 font-medium drop-shadow-md`}>
          {rating}.0 ({reviewCount.toLocaleString()} reviews)
        </span>
      )}
    </div>
  )
}

export default StarRating
