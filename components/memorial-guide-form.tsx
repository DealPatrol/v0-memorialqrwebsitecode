"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SUPPORT_EMAIL } from "@/lib/site"

export function MemorialGuideForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [error, setError] = useState("")

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setStatus("sending")
    setError("")
    try {
      const response = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = (await response.json()) as { error?: string }
      if (!response.ok) {
        setStatus("error")
        setError(data.error || `Email ${SUPPORT_EMAIL} and we will send the guide.`)
        return
      }
      setStatus("sent")
    } catch {
      setStatus("error")
      setError(`Email ${SUPPORT_EMAIL} and we will send the guide.`)
    }
  }

  if (status === "sent") {
    return <p className="text-sm text-muted-foreground">The guide is on its way to {email}. It is the same guide shown above.</p>
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="sr-only" htmlFor="memorial-guide-email">
        Email address
      </label>
      <Input
        id="memorial-guide-email"
        type="email"
        required
        autoComplete="email"
        placeholder="Email address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="sm:max-w-xs"
      />
      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending" : "Email me the guide"}
      </Button>
      {status === "error" ? <p className="text-sm text-destructive">{error}</p> : null}
    </form>
  )
}
