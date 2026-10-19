"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { uploadMemorialMedia, uploadResultMessage, type UploadStage } from "@/lib/media/client-upload"
import { ACCEPT_ATTR, ACCEPT_LABEL, checkMediaFile, formatLimit, isBrowserSafeVideoName } from "@/lib/media/shared"

interface VideoUploadProps {
  memorialId: string
  onUploadComplete?: () => void
  creatorToken?: string | null
}

const STAGE_LABEL: Record<UploadStage, string> = {
  uploading: "Uploading",
  saving: "Saving",
  converting: "Converting so it plays on every phone and browser (can take a minute)",
  done: "Done",
}

export function VideoUpload({ memorialId, onUploadComplete, creatorToken }: VideoUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploaderName, setUploaderName] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [stage, setStage] = useState<UploadStage>("uploading")
  const { toast } = useToast()

  // Object URLs instead of reading a 100MB video into memory as base64.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    const check = checkMediaFile(selectedFile, "video")
    if (!check.ok) {
      toast({ title: "Can't use this video", description: check.error, variant: "destructive" })
      e.target.value = ""
      return
    }
    setFile(selectedFile)
    if (!title) setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""))
    setPreview(URL.createObjectURL(selectedFile))
  }

  const handleUpload = async () => {
    if (!file) {
      toast({ title: "No file selected", description: "Please select a video to upload", variant: "destructive" })
      return
    }
    if (!title.trim()) {
      toast({ title: "Title required", description: "Please enter a title for the video", variant: "destructive" })
      return
    }
    if (!uploaderName.trim() && !creatorToken) {
      toast({ title: "Name required", description: "Please enter your name", variant: "destructive" })
      return
    }

    setUploading(true)
    setUploadProgress(0)
    try {
      const result = await uploadMemorialMedia({
        file,
        memorialId,
        mediaType: "video",
        title: title.trim(),
        uploadedBy: uploaderName.trim(),
        creatorToken,
        onProgress: (percent, nextStage) => {
          setUploadProgress(percent)
          setStage(nextStage)
        },
      })
      toast(uploadResultMessage(result, "video"))
      setFile(null)
      setTitle("")
      setUploaderName("")
      setPreview(null)
      onUploadComplete?.()
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "There was an error uploading your video",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="video">Select Video</Label>
        <Input id="video" type="file" accept={ACCEPT_ATTR.video} onChange={handleFileChange} disabled={uploading} />
        <p className="text-xs text-muted-foreground mt-1">
          {ACCEPT_LABEL.video}. Up to {formatLimit("video")}. iPhone and Android videos are converted automatically so they
          play everywhere.
        </p>
      </div>

      {preview && file && (
        <div className="relative w-full rounded-lg overflow-hidden bg-slate-100">
          <video src={preview} controls playsInline className="w-full max-h-64" />
          {!isBrowserSafeVideoName(file.name) && (
            <p className="p-2 text-xs text-slate-500">
              If the preview does not play here, that is fine: it will be converted after upload.
            </p>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="title">Video Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter video title..."
          disabled={uploading}
        />
      </div>

      <div>
        <Label htmlFor="uploaderName">Your Name</Label>
        <Input
          id="uploaderName"
          value={uploaderName}
          onChange={(e) => setUploaderName(e.target.value)}
          placeholder="Enter your name..."
          disabled={uploading}
        />
      </div>

      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">
            {STAGE_LABEL[stage]}
            {stage === "uploading" ? `… ${uploadProgress}%` : "…"}
          </p>
        </div>
      )}

      <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Video
          </>
        )}
      </Button>
    </div>
  )
}
