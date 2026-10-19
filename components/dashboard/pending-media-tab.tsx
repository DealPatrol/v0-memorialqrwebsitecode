"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { musicKind, musicYouTubeId } from "@/lib/media/shared"
import { youTubeEmbedUrl } from "@/lib/youtube"

export type PendingItem = {
  id: string
  table: "photos" | "videos" | "music"
  memorial_id: string
  created_at: string
  image_url?: string
  video_url?: string
  audio_url?: string
  title?: string
  caption?: string | null
  uploaded_by?: string | null
  kind?: string | null
  youtube_id?: string | null
  is_youtube?: boolean | null
  memorial_name?: string
}

function label(item: PendingItem): string {
  if (item.table === "photos") return "Photo"
  if (item.table === "videos") return "Video"
  const kind = musicKind(item)
  return kind === "voicemail" ? "Voicemail" : kind === "video" ? "YouTube video" : "Song"
}

function Preview({ item }: { item: PendingItem }) {
  if (item.table === "photos" && item.image_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={item.image_url} alt={item.caption ?? "Uploaded photo"} className="max-h-64 rounded-lg object-contain" />
  }
  if (item.table === "videos" && item.video_url) {
    return <video src={item.video_url} controls playsInline preload="metadata" className="max-h-64 w-full rounded-lg bg-black" />
  }
  const youTubeId = item.table === "music" ? musicYouTubeId(item) : null
  if (youTubeId) {
    return (
      <div className="aspect-video w-full max-w-md overflow-hidden rounded-lg">
        <iframe src={youTubeEmbedUrl(youTubeId)} title={item.title ?? "YouTube"} className="size-full" allowFullScreen />
      </div>
    )
  }
  if (item.audio_url) return <audio src={item.audio_url} controls preload="metadata" className="w-full" />
  return null
}

/**
 * Visitor uploads waiting for the memorial owner. Approve shows them on the
 * public page; Hide keeps them off it (nothing is deleted).
 */
export function PendingMediaTab({ items, showMemorial = false }: { items: PendingItem[]; showMemorial?: boolean }) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)
  const [done, setDone] = useState<Record<string, "approved" | "rejected">>({})
  const [error, setError] = useState<string | null>(null)

  const moderate = async (item: PendingItem, action: "approve" | "reject") => {
    setBusy(item.id)
    setError(null)
    try {
      const response = await fetch("/api/media/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: item.table, id: item.id, action }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || "Could not update")
      setDone((prev) => ({ ...prev, [item.id]: action === "approve" ? "approved" : "rejected" }))
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update")
    } finally {
      setBusy(null)
    }
  }

  const waiting = items.filter((item) => !done[item.id])

  if (waiting.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nothing waiting for approval</CardTitle>
          <CardDescription>Photos, videos, voicemails and songs shared by visitors will show up here first.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {waiting.map((item) => (
        <Card key={`${item.table}-${item.id}`}>
          <CardHeader>
            <CardTitle className="text-lg">
              {label(item)}
              {item.title ? `: ${item.title}` : ""}
            </CardTitle>
            <CardDescription>
              {showMemorial && item.memorial_name ? `${item.memorial_name} · ` : ""}
              Shared by {item.uploaded_by || "a visitor"} on {new Date(item.created_at).toLocaleString()}
              {item.caption ? ` · “${item.caption}”` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Preview item={item} />
            <div className="flex gap-3">
              <Button onClick={() => moderate(item, "approve")} disabled={busy === item.id}>
                {busy === item.id ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Check className="mr-2 size-4" />}
                Approve
              </Button>
              <Button variant="outline" onClick={() => moderate(item, "reject")} disabled={busy === item.id}>
                <EyeOff className="mr-2 size-4" />
                Hide
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
