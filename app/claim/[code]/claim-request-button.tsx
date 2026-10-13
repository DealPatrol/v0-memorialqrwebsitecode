"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function ClaimRequestButton({ code }: { code: string }) {
  const [message, setMessage] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function send() {
    setPending(true)
    setMessage(null)
    try {
      const response = await fetch(`/api/claim/${code}`, { method: "POST" })
      const payload = (await response.json()) as { error?: string }
      if (!response.ok) {
        setMessage(payload.error || "The email could not be sent.")
        return
      }
      setMessage("Check your email for a link to claim this memorial.")
    } catch {
      setMessage("The email could not be sent.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mt-6">
      <Button type="button" onClick={send} disabled={pending}>
        {pending ? "Sending…" : "Email me the claim link"}
      </Button>
      {message ? <p className="mt-3 text-sm text-stone-700">{message}</p> : null}
    </div>
  )
}
