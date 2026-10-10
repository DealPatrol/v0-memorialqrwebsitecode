"use client"

import { useState, type FormEvent } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function PlaqueWaitlistForm({ productId }: { productId: string }) {
  const pathname = usePathname()
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle")
  const [message, setMessage] = useState("")

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
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

  return (
    <form id="waitlist" onSubmit={onSubmit} className="scroll-mt-24 space-y-3">
      <label htmlFor={`waitlist-${productId}`} className="text-sm font-medium text-foreground">
        Email me when it can be ordered
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id={`waitlist-${productId}`}
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={state === "saving" || state === "done"}
        />
        <Button type="submit" disabled={state === "saving" || state === "done"}>
          {state === "saving" ? "Saving..." : state === "done" ? "Saved" : "Join the list"}
        </Button>
      </div>
      {message ? (
        <p role="status" className={`text-sm ${state === "error" ? "text-red-700" : "text-muted-foreground"}`}>
          {message}
        </p>
      ) : null}
      <p className="text-xs text-muted-foreground">One email when it is ready. No newsletter.</p>
    </form>
  )
}
