"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Loader2, LinkIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MusicUploadProps {
  memorialId: string
  onUploadComplete: () => void
}

export function MusicUpload({ memorialId, onUploadComplete }: MusicUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const MAX_SIZE = 20 * 1024 * 1024
      if (selectedFile.size > MAX_SIZE) {
        toast({
          title: "File too large",
          description: "Audio files must be under 20MB. Please compress your file.",
          variant: "destructive",
        })
        return
      }

      const validTypes = [
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/ogg",
        "audio/m4a",
        "audio/x-m4a",
        "audio/mp4",
        "audio/aac",
        "audio/x-aac",
        "audio/amr",
        "audio/3gpp",
        "audio/3gpp2",
        "video/3gpp",
        "video/3gpp2",
        "audio/webm",
      ]
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload an audio file (MP3, WAV, M4A, AMR, 3GP, AAC, or voicemail).",
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)
      if (!title) {
        const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "")
        setTitle(nameWithoutExt)
      }
    }
  }

  const handleYouTubeSubmit = async () => {
    if (!youtubeUrl.trim() || !title.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a YouTube URL and song title",
        variant: "destructive",
      })
      return
    }

    const videoId = extractYouTubeId(youtubeUrl)
    if (!videoId) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube URL",
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
          title,
          artist,
          youtubeUrl,
          videoId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to add YouTube audio")
      }

      toast({
        title: "Audio added",
        description: "YouTube audio has been added to the memorial",
      })

      setYoutubeUrl("")
      setTitle("")
      setArtist("")
      onUploadComplete()
    } catch (error) {
      console.error("[v0] YouTube upload error:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to add YouTube audio",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a file and enter a title",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("memorialId", memorialId)
      formData.append("title", title)
      formData.append("artist", artist)

      console.log("[v0] Uploading music:", { title, artist, fileSize: file.size })

      const response = await fetch("/api/music/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        let errorMessage = "Upload failed"
        try {
          const error = await response.json()
          errorMessage = error.error || errorMessage
        } catch {
          errorMessage = await response.text()
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("[v0] Music uploaded successfully:", data.music)

      toast({
        title: "Audio uploaded",
        description: "Your audio has been added to the memorial",
      })

      setFile(null)
      setTitle("")
      setArtist("")
      onUploadComplete()
    } catch (error) {
      console.error("[v0] Upload error:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload audio",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Tabs defaultValue="youtube" className="w-full">
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
          <p className="text-xs text-slate-500 mt-1">Paste any YouTube video or music link</p>
        </div>

        <div>
          <Label htmlFor="youtube-title">Song Title *</Label>
          <Input
            id="youtube-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter song title..."
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

        <Button
          onClick={handleYouTubeSubmit}
          disabled={uploading || !youtubeUrl.trim() || !title.trim()}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <LinkIcon className="mr-2 h-4 w-4" />
              Add YouTube Audio
            </>
          )}
        </Button>
      </TabsContent>

      <TabsContent value="file" className="space-y-4">
        <div>
          <Label htmlFor="music-file">Audio File (MP3, WAV, M4A, AMR, 3GP, Voicemail - Max 20MB)</Label>
          <Input
            id="music-file"
            type="file"
            accept="audio/*,.m4a,.amr,.3gp,.aac"
            onChange={handleFileChange}
            disabled={uploading}
            className="cursor-pointer"
          />
          {file && <p className="text-sm text-slate-600 mt-1">Selected: {file.name}</p>}
        </div>

        <div>
          <Label htmlFor="music-title">Song Title *</Label>
          <Input
            id="music-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter song title..."
            disabled={uploading}
          />
        </div>

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

        <Button onClick={handleUpload} disabled={uploading || !file || !title.trim()} className="w-full">
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Audio
            </>
          )}
        </Button>
      </TabsContent>
    </Tabs>
  )
}
