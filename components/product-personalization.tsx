"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type SavedPersonalization = {
  name: string
  birthDate: string | null
  deathDate: string | null
  message: string | null
  photoUrl: string | null
}

export function ProductPersonalization({
  productId,
  qrNote,
}: {
  productId: string
  qrNote: string
}) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [deathDate, setDeathDate] = useState("")
  const [message, setMessage] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  async function uploadPhoto(): Promise<string | null> {
    if (!file) return null
    const body = new FormData()
    body.set("file", file)
    const response = await fetch("/api/upload", { method: "POST", body })
    const payload = (await response.json()) as { url?: string; error?: string }
    if (!response.ok || !payload.url) {
      throw new Error(payload.error || "The photo did not upload")
    }
    return payload.url
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError("Enter the name that should appear on the keepsake.")
      return
    }
    setSaving(true)
    setError("")
    try {
      const photoUrl = await uploadPhoto()
      const personalization: SavedPersonalization = {
        name: trimmed.slice(0, 80),
        birthDate: birthDate || null,
        deathDate: deathDate || null,
        message: message.trim().slice(0, 280) || null,
        photoUrl,
      }
      const stored = localStorage.getItem("checkoutItems")
      const existing = stored ? (JSON.parse(stored) as Array<{ id?: string }>) : []
      const next = Array.isArray(existing) ? existing.filter((item) => item?.id !== productId) : []
      next.push({ id: productId, quantity: 1, personalization })
      localStorage.setItem("checkoutItems", JSON.stringify(next))
      router.push("/checkout/simple")
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "The photo did not upload")
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="keepsake-name">Name</Label>
        <Input id="keepsake-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="keepsake-birth">Birth date</Label>
          <Input id="keepsake-birth" type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="keepsake-death">Death date</Label>
          <Input id="keepsake-death" type="date" value={deathDate} onChange={(event) => setDeathDate(event.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="keepsake-message">Short message</Label>
        <Textarea
          id="keepsake-message"
          value={message}
          maxLength={280}
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="keepsake-photo">Photo</Label>
        <Input
          id="keepsake-photo"
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
      </div>
      <p className="text-sm text-muted-foreground">{qrNote} The code is black on white.</p>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className="w-full" size="lg" disabled={saving}>
        {saving ? "Saving..." : "Continue to checkout"}
      </Button>
    </form>
  )
}
