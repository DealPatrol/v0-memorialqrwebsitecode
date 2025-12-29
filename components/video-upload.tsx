"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

interface VideoUploadProps {
  memorialId: string
  onUploadComplete?: () => void
}

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

export function VideoUpload({ memorialId, onUploadComplete }: VideoUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploaderName, setUploaderName] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `Video must be smaller than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a video to upload",
        variant: "destructive",
      })
      return
    }

    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for the video",
        variant: "destructive",
      })
      return
    }

    if (!uploaderName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("memorialId", memorialId)
      formData.append("title", title)
      formData.append("uploadedBy", uploaderName)

      setUploadProgress(20)

      const response = await fetch("/api/videos/upload", {
        method: "POST",
        body: formData,
      })

      setUploadProgress(80)

      if (!response.ok) {
        let errorMessage = "Upload failed"
        try {
          const error = await response.json()
          errorMessage = error.error || errorMessage
        } catch (parseError) {
          errorMessage = response.statusText || errorMessage
          if (response.status === 413) {
            errorMessage = "File too large for upload"
          }
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setUploadProgress(100)

      toast({
        title: "Video uploaded",
        description: "Your video has been added to the memorial",
      })

      setFile(null)
      setTitle("")
      setUploaderName("")
      setPreview(null)
      setUploadProgress(0)

      if (onUploadComplete) {
        onUploadComplete()
      }
    } catch (error) {
      console.error("[v0] Upload error:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "There was an error uploading your video",
        variant: "destructive",
      })
      setUploadProgress(0)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="video">Select Video</Label>
        <Input id="video" type="file" accept="video/*" onChange={handleFileChange} disabled={uploading} />
        <p className="text-xs text-muted-foreground mt-1">
          Supported formats: MP4, MOV, AVI, WebM (Max {MAX_FILE_SIZE / 1024 / 1024}MB)
        </p>
      </div>

      {preview && (
        <div className="relative w-full rounded-lg overflow-hidden bg-slate-100">
          <video src={preview} controls className="w-full max-h-64">
            Your browser does not support the video element.
          </video>
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
          <p className="text-sm text-muted-foreground text-center">Uploading... {uploadProgress}%</p>
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
