"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function TestSquarePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to homepage - test page disabled in production
    router.push("/")
  }, [router])

  return null
}
