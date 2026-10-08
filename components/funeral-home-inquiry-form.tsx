"use client"

import { useState } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SUPPORT_EMAIL } from "@/lib/site"

type FormState = {
  name: string
  email: string
  funeralHome: string
  city: string
  phone: string
  message: string
}

const emptyForm: FormState = {
  name: "",
  email: "",
  funeralHome: "",
  city: "",
  phone: "",
  message: "",
}

export function FuneralHomeInquiryForm() {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  function update(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const response = await fetch("/api/partners/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const payload = (await response.json()) as { error?: string }
      if (!response.ok) {
        setError(payload.error || `We could not send that. Email ${SUPPORT_EMAIL} instead.`)
        return
      }
      setSent(true)
    } catch {
      setError(`We could not send that. Email ${SUPPORT_EMAIL} instead.`)
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <p className="text-muted-foreground">
        We received your inquiry and emailed {SUPPORT_EMAIL}. A copy is on its way to {form.email}. This does not place
        an order and does not charge a card.
      </p>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Your name</Label>
        <Input id="name" name="name" value={form.name} onChange={update} autoComplete="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Work email</Label>
        <Input id="email" name="email" type="email" value={form.email} onChange={update} autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="funeralHome">Funeral home</Label>
        <Input id="funeralHome" name="funeralHome" value={form.funeralHome} onChange={update} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">City and state</Label>
          <Input id="city" name="city" value={form.city} onChange={update} autoComplete="address-level2" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" value={form.phone} onChange={update} autoComplete="tel" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">What you need</Label>
        <Textarea
          id="message"
          name="message"
          value={form.message}
          onChange={update}
          rows={5}
          required
          placeholder="How you would like to offer a QR memorial plaque to families."
        />
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Sending" : "Send inquiry"}
      </Button>
    </form>
  )
}
