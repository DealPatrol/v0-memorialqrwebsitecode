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
            className={`${sizeClasses[size]}`}
            fill={i < rating ? "#facc15" : "none"}
            stroke={i < rating ? "#facc15" : "#d1d5db"}
            strokeWidth={2}
          />
        ))}
      </div>
      {showReviews && (
        <span
          className={`${textSizeClasses[size]} text-white font-medium`}
          style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
        >
          {rating}.0 ({reviewCount.toLocaleString()} reviews)
        </span>
      )}
    </div>
  )
}

export default StarRating
