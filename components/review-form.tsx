"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SUPPORT_EMAIL } from "@/lib/site"

export function ReviewForm({ token }: { token: string }) {
  const [authorName, setAuthorName] = useState("")
  const [rating, setRating] = useState("5")
  const [body, setBody] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [error, setError] = useState("")

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setStatus("sending")
    setError("")
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, authorName, rating: Number(rating), body }),
      })
      const data = (await response.json()) as { error?: string }
      if (!response.ok) {
        setStatus("error")
        setError(data.error || `Email ${SUPPORT_EMAIL} instead.`)
        return
      }
      setStatus("sent")
    } catch {
      setStatus("error")
      setError(`Email ${SUPPORT_EMAIL} instead.`)
    }
  }

  if (status === "sent") {
    return <p className="text-muted-foreground">Thank you. Your review will appear on the product page.</p>
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="review-name" className="text-sm font-medium">
          Name to show
        </label>
        <Input id="review-name" value={authorName} onChange={(event) => setAuthorName(event.target.value)} placeholder="A family" />
      </div>
      <div>
        <label htmlFor="review-rating" className="text-sm font-medium">
          Rating
        </label>
        <select
          id="review-rating"
          value={rating}
          onChange={(event) => setRating(event.target.value)}
          className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="5">5 out of 5</option>
          <option value="4">4 out of 5</option>
          <option value="3">3 out of 5</option>
          <option value="2">2 out of 5</option>
          <option value="1">1 out of 5</option>
        </select>
      </div>
      <div>
        <label htmlFor="review-body" className="text-sm font-medium">
          How has it been?
        </label>
        <Textarea id="review-body" required minLength={20} maxLength={2000} value={body} onChange={(event) => setBody(event.target.value)} rows={5} />
      </div>
      {status === "error" ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending" : "Share this review"}
      </Button>
    </form>
  )
}
