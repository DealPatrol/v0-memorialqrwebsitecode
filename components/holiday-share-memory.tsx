"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { HOLIDAY_SHARE_COPY, MEMORY_AUTHOR_MAX, MEMORY_BODY_MAX } from "@/lib/holiday-share-copy"

type ShareStatus = "idle" | "saving" | "saved" | "error"

function statusText(status: ShareStatus): string | null {
  switch (status) {
    case "idle":
    case "saving":
      return null
    case "saved":
      return HOLIDAY_SHARE_COPY.savedMemory
    case "error":
      return HOLIDAY_SHARE_COPY.saveFailed
    default: {
      const exhaustive: never = status
      return exhaustive
    }
  }
}

type Props = {
  memorialId: string
}

/** Posts a memory through the existing messages API. The owner can delete it later. */
export function HolidayShareMemory({ memorialId }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [author, setAuthor] = useState("")
  const [body, setBody] = useState("")
  const [status, setStatus] = useState<ShareStatus>("idle")

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const authorName = author.trim()
    const content = body.trim()
    if (!authorName || !content || status === "saving") return
    setStatus("saving")
    try {
      const response = await fetch(`/api/memorials/${encodeURIComponent(memorialId)}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author_name: authorName, content }),
      })
      if (!response.ok) {
        setStatus("error")
        return
      }
      setAuthor("")
      setBody("")
      setStatus("saved")
      setOpen(false)
      router.refresh()
    } catch {
      setStatus("error")
    }
  }

  const message = statusText(status)

  return (
    <div data-testid="holiday-share">
      <button
        type="button"
        className="w-full rounded-md bg-[#e6dfd2] px-4 py-3 text-center text-sm font-medium text-[#3d2c29] hover:bg-[#ddd4c4]"
        aria-expanded={open}
        aria-controls="holiday-share-form"
        onClick={() => setOpen((value) => !value)}
      >
        {HOLIDAY_SHARE_COPY.shareLabel}
      </button>
      <p className="mt-2 text-center text-sm leading-relaxed text-stone-600">{HOLIDAY_SHARE_COPY.ownerRemovalNote}</p>
      {open ? (
        <form id="holiday-share-form" className="mt-4 space-y-3" onSubmit={submit}>
          <div className="space-y-1">
            <Label htmlFor="holiday-memory-author">{HOLIDAY_SHARE_COPY.yourName}</Label>
            <Input
              id="holiday-memory-author"
              name="author"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              maxLength={MEMORY_AUTHOR_MAX}
              autoComplete="name"
              required
              autoFocus
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="holiday-memory-body">{HOLIDAY_SHARE_COPY.yourMemory}</Label>
            <Textarea
              id="holiday-memory-body"
              name="content"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              maxLength={MEMORY_BODY_MAX}
              rows={4}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-[#7a2434] hover:bg-[#641d2b]" disabled={status === "saving"}>
            {status === "saving" ? "Saving" : HOLIDAY_SHARE_COPY.shareLabel}
          </Button>
        </form>
      ) : null}
      <p aria-live="polite" className="mt-2 text-center text-sm text-stone-700">
        {message}
      </p>
    </div>
  )
}
