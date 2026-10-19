/** YouTube IDs are always 11 characters of letters, digits, "-" or "_". */
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/

/**
 * Pull the video ID out of any common YouTube link:
 * watch?v=, youtu.be/, /embed/, /shorts/, /live/, /v/, music.youtube.com, m.youtube.com,
 * and youtube-nocookie.com. Returns null for anything that is not a YouTube video link.
 */
export function extractYouTubeId(input: string | null | undefined): string | null {
  const raw = (input ?? "").trim()
  if (!raw) return null
  if (YOUTUBE_ID.test(raw)) return raw

  let url: URL
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`)
  } catch {
    return null
  }

  const host = url.hostname.toLowerCase().replace(/^(www\.|m\.|music\.)/, "")
  let candidate: string | null = null

  if (host === "youtu.be") {
    candidate = url.pathname.split("/")[1] ?? null
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") {
      candidate = url.searchParams.get("v")
    } else {
      const match = url.pathname.match(/^\/(?:embed|shorts|live|v|e)\/([^/?#]+)/)
      candidate = match?.[1] ?? null
    }
  }

  return candidate && YOUTUBE_ID.test(candidate) ? candidate : null
}

export function youTubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`
}

/** Privacy-friendly embed URL (no tracking cookies until the visitor presses play). */
export function youTubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0`
}
