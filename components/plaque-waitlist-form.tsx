"use client"

import { useState, type FormEvent } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { waitlistEmailError } from "@/lib/plaque-waitlist"

export function PlaqueWaitlistForm({
  productId,
  anchor = true,
}: {
  productId: string
  /** Product pages use #waitlist. A page with two forms must pass false so ids stay unique. */
  anchor?: boolean
}) {
  const pathname = usePathname()
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle")
  const [message, setMessage] = useState("")
  const fieldId = `waitlist-email-${productId}`
  const hintId = `waitlist-hint-${productId}`
  const messageId = `waitlist-message-${productId}`

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const emailError = waitlistEmailError(email)
    if (emailError) {
      setState("error")
      setMessage(emailError)
      return
    }
    setState("saving")
    setMessage("")
    try {
      const res = await fetch("/api/plaque-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productId, sourcePath: pathname }),
      })
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string }
      if (res.ok && data.success) {
        setState("done")
        setMessage("You are on the list. We will email you once when it can be ordered.")
      } else {
        setState("error")
        setMessage(data.error || "Could not save your email. Please try again.")
      }
    } catch {
      setState("error")
      setMessage("Could not save your email. Please try again.")
    }
  }

  if (state === "done") {
    return (
      <div id={anchor ? "waitlist" : undefined} role="status" className="scroll-mt-24 space-y-2 rounded-lg border border-border bg-secondary/40 p-4">
        <p className="text-sm font-medium text-foreground">You are on the list.</p>
        <p className="text-sm text-muted-foreground">
          We will email {email.trim()} once when it can be ordered. Nothing was charged. No newsletter, and no email before then.
        </p>
      </div>
    )
  }

  return (
    <form id={anchor ? "waitlist" : undefined} onSubmit={onSubmit} className="scroll-mt-24 space-y-3" noValidate>
      <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
        Email me when it can be ordered
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id={fieldId}
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          maxLength={254}
          placeholder="you@example.com"
          value={email}
          aria-invalid={state === "error"}
          aria-describedby={state === "error" ? `${hintId} ${messageId}` : hintId}
          onChange={(event) => {
            setEmail(event.target.value)
            if (state === "error") {
              setState("idle")
              setMessage("")
            }
          }}
          disabled={state === "saving"}
        />
        <Button type="submit" disabled={state === "saving"}>
          {state === "saving" ? "Saving..." : "Join the list"}
        </Button>
      </div>
      {message ? (
        <p id={messageId} role="alert" className="text-sm text-red-700">
          {message}
        </p>
      ) : null}
      <p id={hintId} className="text-xs text-muted-foreground">
        One email when it is ready. No newsletter. Joining does not place an order.
      </p>
    </form>
  )
}
