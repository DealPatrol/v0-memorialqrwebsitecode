"use client"

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { Download, Mic, MusicIcon, Plus, VideoIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { VideoUpload } from "@/components/video-upload"
import { MusicUpload } from "@/components/music-upload"
import { fileExtension, isApproved, musicKind, musicYouTubeId } from "@/lib/media/shared"
import { youTubeEmbedUrl } from "@/lib/youtube"

export type VideoRow = {
  id: string
  video_url: string
  title: string
  uploaded_by?: string | null
  created_at?: string
  status?: string | null
}

export type MusicRow = {
  id: string
  title: string
  artist?: string | null
  audio_url: string
  created_at?: string
  kind?: string | null
  is_youtube?: boolean | null
  youtube_id?: string | null
  uploaded_by?: string | null
  status?: string | null
}

type Props = {
  memorialId: string
  initialVideos?: VideoRow[]
  initialMusic?: MusicRow[]
  /** Load from the API on mount (client-rendered memorial pages). */
  fetchOnMount?: boolean
  /** Bump to reload after an upload made elsewhere on the page. */
  refreshKey?: number
  allowUploads?: boolean
  /** Hide sections that have nothing in them (and no upload button). */
  hideEmpty?: boolean
}

/** MOV files with H.264 play in Chrome when announced as MP4; HEVC is converted server-side. */
function sourceType(url: string): string | undefined {
  const ext = fileExtension(url.split(/[?#]/)[0])
  if (ext === "mp4" || ext === "m4v" || ext === "mov") return "video/mp4"
  if (ext === "webm") return "video/webm"
  return undefined
}

function Unplayable({ url, noun }: { url: string; noun: string }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
      This {noun} is in a format your browser can't play.{" "}
      <a href={url} download className="inline-flex items-center gap-1 font-medium underline">
        <Download className="size-4" aria-hidden /> Download it
      </a>{" "}
      to listen on your device.
    </div>
  )
}

function VideoTile({ video }: { video: VideoRow }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="space-y-2">
      {failed ? (
        <Unplayable url={video.video_url} noun="video" />
      ) : (
        <video controls playsInline preload="metadata" className="w-full rounded-lg bg-black" onError={() => setFailed(true)}>
          <source src={video.video_url} type={sourceType(video.video_url)} onError={() => setFailed(true)} />
        </video>
      )}
      <h4 className="font-semibold text-sm">{video.title}</h4>
      {video.uploaded_by && <p className="text-xs text-slate-500">Shared by {video.uploaded_by}</p>}
    </div>
  )
}

function YouTubeTile({ id, title, subtitle }: { id: string; title: string; subtitle?: string | null }) {
  return (
    <div className="space-y-2">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
        <iframe
          src={youTubeEmbedUrl(id)}
          title={title}
          className="size-full"
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <h4 className="font-semibold text-sm">{title}</h4>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </div>
  )
}

function AudioTile({ track, icon }: { track: MusicRow; icon: "voicemail" | "song" }) {
  const [failed, setFailed] = useState(false)
  const youTubeId = musicYouTubeId(track)
  const Icon = icon === "voicemail" ? Mic : MusicIcon
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <div className="mb-2 flex items-center gap-3">
        <Icon className="size-4 shrink-0 text-purple-600" aria-hidden />
        <div className="min-w-0">
          <h4 className="truncate font-semibold text-sm">{track.title}</h4>
          {(track.artist || track.uploaded_by) && (
            <p className="text-xs text-slate-500">{track.artist || `Shared by ${track.uploaded_by}`}</p>
          )}
        </div>
      </div>
      {youTubeId ? (
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          <iframe
            src={youTubeEmbedUrl(youTubeId)}
            title={track.title}
            className="size-full"
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : failed ? (
        <Unplayable url={track.audio_url} noun="recording" />
      ) : (
        <audio controls preload="metadata" className="w-full" src={track.audio_url} onError={() => setFailed(true)} />
      )}
    </div>
  )
}

function AddDialog({
  label,
  title,
  description,
  children,
  open,
  onOpenChange,
}: {
  label: string
  title: string
  description: string
  children: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-1 size-4" aria-hidden />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

/**
 * Video Memories, Voicemails and Music sections for a memorial page, with
 * optional "add" buttons. Only approved items are listed (the API filters them).
 */
export function MemorialMediaSections({
  memorialId,
  initialVideos = [],
  initialMusic = [],
  fetchOnMount = false,
  refreshKey = 0,
  allowUploads = true,
  hideEmpty = false,
}: Props) {
  const [videos, setVideos] = useState<VideoRow[]>(initialVideos)
  const [music, setMusic] = useState<MusicRow[]>(initialMusic)
  const [loading, setLoading] = useState(fetchOnMount)
  const [open, setOpen] = useState<"video" | "voicemail" | "song" | null>(null)

  const refresh = useCallback(async () => {
    try {
      const [videoResponse, musicResponse] = await Promise.all([
        fetch(`/api/memorials/${memorialId}/videos`, { cache: "no-store" }),
        fetch(`/api/memorials/${memorialId}/music`, { cache: "no-store" }),
      ])
      if (videoResponse.ok) setVideos(((await videoResponse.json()).videos ?? []) as VideoRow[])
      if (musicResponse.ok) setMusic(((await musicResponse.json()).music ?? []) as MusicRow[])
    } catch {
      // Keep what is already shown.
    } finally {
      setLoading(false)
    }
  }, [memorialId])

  useEffect(() => {
    if (fetchOnMount || refreshKey > 0) void refresh()
  }, [fetchOnMount, refreshKey, refresh])

  const { voicemails, songs, youTubeVideos } = useMemo(() => {
    const approved = music.filter(isApproved)
    return {
      voicemails: approved.filter((track) => musicKind(track) === "voicemail"),
      songs: approved.filter((track) => musicKind(track) === "song"),
      youTubeVideos: approved.filter((track) => musicKind(track) === "video" && musicYouTubeId(track)),
    }
  }, [music])
  const visibleVideos = videos.filter(isApproved)

  const done = () => {
    setOpen(null)
    void refresh()
  }

  const showVideos = !hideEmpty || allowUploads || visibleVideos.length + youTubeVideos.length > 0
  const showVoicemails = !hideEmpty || allowUploads || voicemails.length > 0
  const showSongs = !hideEmpty || allowUploads || songs.length > 0

  return (
    <>
      {showVideos && (
        <Card id="videos-section">
          <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
            <CardTitle className="flex items-center gap-2">
              <VideoIcon className="size-5" aria-hidden />
              Video Memories
            </CardTitle>
            {allowUploads && (
              <AddDialog
                label="Add video"
                title="Share a video"
                description="Up to 100MB. iPhone (MOV/HEVC) and Android videos are converted so they play everywhere."
                open={open === "video"}
                onOpenChange={(value) => setOpen(value ? "video" : null)}
              >
                <VideoUpload memorialId={memorialId} onUploadComplete={done} />
              </AddDialog>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="py-8 text-center text-slate-500">Loading videos...</p>
            ) : visibleVideos.length + youTubeVideos.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {visibleVideos.map((video) => (
                  <VideoTile key={video.id} video={video} />
                ))}
                {youTubeVideos.map((track) => (
                  <YouTubeTile key={track.id} id={musicYouTubeId(track)!} title={track.title} subtitle={track.artist} />
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-slate-500">No videos yet. Share a favorite video memory.</p>
            )}
          </CardContent>
        </Card>
      )}

      {showVoicemails && (
        <Card id="voicemails-section">
          <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
            <CardTitle className="flex items-center gap-2">
              <Mic className="size-5" aria-hidden />
              Voicemails
            </CardTitle>
            {allowUploads && (
              <AddDialog
                label="Add voicemail"
                title="Share a voicemail or voice recording"
                description="Saved voicemails from Android (AMR/3GP) or iPhone (M4A) work. Up to 20MB."
                open={open === "voicemail"}
                onOpenChange={(value) => setOpen(value ? "voicemail" : null)}
              >
                <MusicUpload memorialId={memorialId} onUploadComplete={done} defaultKind="voicemail" defaultTab="file" />
              </AddDialog>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="py-8 text-center text-slate-500">Loading voicemails...</p>
            ) : voicemails.length > 0 ? (
              <div className="space-y-4">
                {voicemails.map((track) => (
                  <AudioTile key={track.id} track={track} icon="voicemail" />
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-slate-500">No voicemails yet. Hearing their voice again can mean so much.</p>
            )}
          </CardContent>
        </Card>
      )}

      {showSongs && (
        <Card id="music-section">
          <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
            <CardTitle className="flex items-center gap-2">
              <MusicIcon className="size-5" aria-hidden />
              Music
            </CardTitle>
            {allowUploads && (
              <AddDialog
                label="Add song"
                title="Add a song"
                description="Paste a YouTube link or upload an audio file (up to 20MB)."
                open={open === "song"}
                onOpenChange={(value) => setOpen(value ? "song" : null)}
              >
                <MusicUpload memorialId={memorialId} onUploadComplete={done} defaultKind="song" defaultTab="youtube" />
              </AddDialog>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="py-8 text-center text-slate-500">Loading music...</p>
            ) : songs.length > 0 ? (
              <div className="space-y-4">
                {songs.map((track) => (
                  <AudioTile key={track.id} track={track} icon="song" />
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-slate-500">No songs yet. Add a song that reminds you of them.</p>
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}
