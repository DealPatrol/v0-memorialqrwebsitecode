"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Loader2, LinkIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { uploadMemorialMedia, uploadResultMessage, type UploadStage } from "@/lib/media/client-upload"
import { ACCEPT_ATTR, ACCEPT_LABEL, audioNeedsConversion, checkMediaFile, formatLimit, type AudioKind } from "@/lib/media/shared"
import { extractYouTubeId } from "@/lib/youtube"

interface MusicUploadProps {
  memorialId: string
  onUploadComplete: () => void
  /** Preselect "voicemail" for the Voicemails section, "song" for Music. */
  defaultKind?: AudioKind
  /** Start on the YouTube tab or the file tab. */
  defaultTab?: "youtube" | "file"
  creatorToken?: string | null
}

export function MusicUpload({ memorialId, onUploadComplete, defaultKind = "song", defaultTab, creatorToken }: MusicUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [kind, setKind] = useState<AudioKind>(defaultKind)
  const [youtubeKind, setYoutubeKind] = useState<"song" | "video">("song")
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [uploaderName, setUploaderName] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState<UploadStage>("uploading")
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    const check = checkMediaFile(selectedFile, "audio")
    if (!check.ok) {
      toast({ title: "Can't use this file", description: check.error, variant: "destructive" })
      e.target.value = ""
      return
    }
    setFile(selectedFile)
    // Android voicemails are AMR/3GP files; preselect Voicemail for them.
    if (/\.(amr|awb|3gp|3gpp|3g2)$/i.test(selectedFile.name)) setKind("voicemail")
    if (!title) setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""))
  }

  const handleYouTubeSubmit = async () => {
    if (!youtubeUrl.trim() || !title.trim()) {
      toast({ title: "Missing information", description: "Please enter a YouTube link and a title", variant: "destructive" })
      return
    }
    const videoId = extractYouTubeId(youtubeUrl)
    if (!videoId) {
      toast({
        title: "Invalid YouTube link",
        description: "Paste a link like youtube.com/watch?v=…, youtu.be/…, or a YouTube Shorts link",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    try {
      const response = await fetch("/api/music/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memorialId,
          title: title.trim(),
          artist: artist.trim(),
          uploaderName: uploaderName.trim(),
          youtubeUrl,
          videoId,
          kind: youtubeKind,
          creatorToken: creatorToken ?? undefined,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || "Failed to add YouTube link")

      toast(uploadResultMessage({ url: youtubeUrl, status: data.status ?? "approved", playable: true }, youtubeKind))
      setYoutubeUrl("")
      setTitle("")
      setArtist("")
      onUploadComplete()
    } catch (error) {
      toast({
        title: "Could not add link",
        description: error instanceof Error ? error.message : "Failed to add YouTube link",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      toast({ title: "Missing information", description: "Please select a file and enter a title", variant: "destructive" })
      return
    }

    setUploading(true)
    setProgress(0)
    try {
      const result = await uploadMemorialMedia({
        file,
        memorialId,
        mediaType: "audio",
        kind,
        title: title.trim(),
        artist: artist.trim(),
        uploadedBy: uploaderName.trim(),
        creatorToken,
        onProgress: (percent, nextStage) => {
          setProgress(percent)
          setStage(nextStage)
        },
      })
      toast(uploadResultMessage(result, kind === "voicemail" ? "voicemail" : "song"))
      setFile(null)
      setTitle("")
      setArtist("")
      onUploadComplete()
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload audio",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const nameField = (
    <div>
      <Label htmlFor="music-uploader">Your Name</Label>
      <Input
        id="music-uploader"
        value={uploaderName}
        onChange={(e) => setUploaderName(e.target.value)}
        placeholder="Enter your name..."
        disabled={uploading}
      />
    </div>
  )

  return (
    <Tabs defaultValue={defaultTab ?? (defaultKind === "voicemail" ? "file" : "youtube")} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="youtube">YouTube Link</TabsTrigger>
        <TabsTrigger value="file">Upload File</TabsTrigger>
      </TabsList>

      <TabsContent value="youtube" className="space-y-4">
        <div>
          <Label htmlFor="youtube-url">YouTube URL *</Label>
          <Input
            id="youtube-url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            disabled={uploading}
          />
          <p className="text-xs text-slate-500 mt-1">Works with youtube.com, youtu.be, Shorts and YouTube Music links</p>
        </div>

        <div>
          <Label>Show it under</Label>
          <RadioGroup
            value={youtubeKind}
            onValueChange={(value) => setYoutubeKind(value as "song" | "video")}
            className="mt-2 flex gap-6"
          >
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="song" id="yt-song" /> Music
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="video" id="yt-video" /> Videos
            </label>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="youtube-title">Title *</Label>
          <Input
            id="youtube-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={youtubeKind === "song" ? "Song title..." : "Video title..."}
            disabled={uploading}
          />
        </div>

        <div>
          <Label htmlFor="youtube-artist">Artist (Optional)</Label>
          <Input
            id="youtube-artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Enter artist name..."
            disabled={uploading}
          />
        </div>

        {nameField}

        <Button onClick={handleYouTubeSubmit} disabled={uploading || !youtubeUrl.trim() || !title.trim()} className="w-full">
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <LinkIcon className="mr-2 h-4 w-4" />
              Add YouTube Link
            </>
          )}
        </Button>
      </TabsContent>

      <TabsContent value="file" className="space-y-4">
        <div>
          <Label>What is it?</Label>
          <RadioGroup value={kind} onValueChange={(value) => setKind(value as AudioKind)} className="mt-2 flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="voicemail" id="kind-voicemail" /> Voicemail / voice recording
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="song" id="kind-song" /> Song
            </label>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="music-file">Audio File (max {formatLimit("audio")})</Label>
          <Input
            id="music-file"
            type="file"
            accept={ACCEPT_ATTR.audio}
            onChange={handleFileChange}
            disabled={uploading}
            className="cursor-pointer"
          />
          <p className="text-xs text-slate-500 mt-1">{ACCEPT_LABEL.audio}</p>
          {file && (
            <p className="text-sm text-slate-600 mt-1">
              Selected: {file.name}
              {audioNeedsConversion(file.name, file.type) && " (will be converted so every browser can play it)"}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="music-title">Title *</Label>
          <Input
            id="music-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={kind === "voicemail" ? "e.g. Mom's birthday voicemail" : "Song title..."}
            disabled={uploading}
          />
        </div>

        {kind === "song" && (
          <div>
            <Label htmlFor="music-artist">Artist (Optional)</Label>
            <Input
              id="music-artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Enter artist name..."
              disabled={uploading}
            />
          </div>
        )}

        {nameField}

        {uploading && (
          <div className="space-y-1">
            <Progress value={progress} />
            <p className="text-center text-xs text-slate-500">
              {stage === "converting" ? "Converting so it plays everywhere…" : stage === "saving" ? "Saving…" : `Uploading… ${progress}%`}
            </p>
          </div>
        )}

        <Button onClick={handleUpload} disabled={uploading || !file || !title.trim()} className="w-full">
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload {kind === "voicemail" ? "Voicemail" : "Song"}
            </>
          )}
        </Button>
      </TabsContent>
    </Tabs>
  )
}
