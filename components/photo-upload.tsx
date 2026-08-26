"use client"

import type React from "react"
import Image from "next/image"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { compressImage } from "@/lib/image-compression"
import { Progress } from "@/components/ui/progress"

interface PhotoUploadProps {
  memorialId: string
  onUploadComplete?: () => void
}

export function PhotoUpload({ memorialId, onUploadComplete }: PhotoUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState("")
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploaderName, setUploaderName] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [compressionStatus, setCompressionStatus] = useState("")
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB. It will be automatically compressed.",
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
        description: "Please select a photo to upload",
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
      setCompressionStatus("Optimizing image...")
      setUploadProgress(10)

      const compressedFile = await compressImage(file, 2)
      const originalSize = (file.size / 1024 / 1024).toFixed(2)
      const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2)

      console.log(`[v0] Image compressed: ${originalSize}MB → ${compressedSize}MB`)
      setCompressionStatus("")
      setUploadProgress(30)

      const formData = new FormData()
      formData.append("file", compressedFile)
      formData.append("memorialId", memorialId)
      formData.append("caption", caption)
      formData.append("uploadedBy", uploaderName)

      setUploadProgress(40)

      const response = await fetch("/api/photos/upload", {
        method: "POST",
        body: formData,
      })

      setUploadProgress(80)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      const data = await response.json()
      setUploadProgress(100)

      toast({
        title: "Photo uploaded",
        description: `Your photo has been added (compressed from ${originalSize}MB to ${compressedSize}MB)`,
      })

      // Reset form
      setFile(null)
      setCaption("")
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
        description: error instanceof Error ? error.message : "There was an error uploading your photo",
        variant: "destructive",
      })
      setUploadProgress(0)
    } finally {
      setUploading(false)
      setCompressionStatus("")
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="photo">Select Photo</Label>
        <Input id="photo" type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
        <p className="text-xs text-muted-foreground mt-1">Images will be automatically optimized for faster upload</p>
      </div>

      {preview && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden">
          <Image
            src={preview || "/placeholder.svg"}
            alt="Preview"
            width={400}
            height={192}
            className="w-full h-full object-cover"
          />
        </div>
      )}

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

      <div>
        <Label htmlFor="caption">Caption (optional)</Label>
        <Textarea
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption for this photo..."
          disabled={uploading}
        />
      </div>

      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">
            {compressionStatus || `Uploading... ${uploadProgress}%`}
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
            Upload Photo
          </>
        )}
      </Button>
    </div>
  )
}
