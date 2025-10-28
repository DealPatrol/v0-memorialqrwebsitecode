"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MusicUploadProps {
  memorialId: string
  onUploadComplete: () => void
}

export function MusicUpload({ memorialId, onUploadComplete }: MusicUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [uploaderName, setUploaderName] = useState("")
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

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

      const validTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/x-m4a"]
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload an audio file (MP3, WAV, OGG, or M4A).",
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
      formData.append("uploaderName", uploaderName)

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
        title: "Music uploaded",
        description: "Your music has been added to the memorial",
      })

      setFile(null)
      setTitle("")
      setArtist("")
      setUploaderName("")
      onUploadComplete()
    } catch (error) {
      console.error("[v0] Upload error:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload music",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="music-file">Audio File (MP3, WAV, OGG, M4A - Max 20MB)</Label>
        <Input
          id="music-file"
          type="file"
          accept="audio/*"
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

      <div>
        <Label htmlFor="uploader-name">Your Name (Optional)</Label>
        <Input
          id="uploader-name"
          value={uploaderName}
          onChange={(e) => setUploaderName(e.target.value)}
          placeholder="Enter your name..."
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
            Upload Music
          </>
        )}
      </Button>
    </div>
  )
}
