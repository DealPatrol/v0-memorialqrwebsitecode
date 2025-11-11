"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, X, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { compressImage } from "@/lib/image-compression"

interface UploadItem {
  file: File
  preview: string
  caption: string
  status: "pending" | "uploading" | "success" | "error"
  error?: string
  progress: number
}

interface BulkPhotoUploadProps {
  memorialId: string
  onUploadComplete: () => void
}

export function BulkPhotoUpload({ memorialId, onUploadComplete }: BulkPhotoUploadProps) {
  const [items, setItems] = useState<UploadItem[]>([])
  const [uploaderName, setUploaderName] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadAttempted, setUploadAttempted] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))

    addFiles(files)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      addFiles(files)
    }
  }

  const addFiles = (files: File[]) => {
    const newItems: UploadItem[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      caption: "",
      status: "pending",
      progress: 0,
    }))

    setItems((prev) => [...prev, ...newItems])
  }

  const removeItem = (index: number) => {
    setItems((prev) => {
      const newItems = [...prev]
      URL.revokeObjectURL(newItems[index].preview)
      newItems.splice(index, 1)
      return newItems
    })
  }

  const updateCaption = (index: number, caption: string) => {
    setItems((prev) => {
      const newItems = [...prev]
      newItems[index].caption = caption
      return newItems
    })
  }

  const uploadItem = async (item: UploadItem, index: number) => {
    try {
      setItems((prev) => {
        const newItems = [...prev]
        newItems[index].status = "uploading"
        newItems[index].progress = 10
        return newItems
      })

      const compressed = await compressImage(item.file)

      setItems((prev) => {
        const newItems = [...prev]
        newItems[index].progress = 50
        return newItems
      })

      const formData = new FormData()
      formData.append("file", compressed)
      formData.append("memorialId", memorialId)
      formData.append("caption", item.caption)
      formData.append("uploaderName", uploaderName)

      const response = await fetch("/api/photos/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      setItems((prev) => {
        const newItems = [...prev]
        newItems[index].status = "success"
        newItems[index].progress = 100
        return newItems
      })
    } catch (error) {
      setItems((prev) => {
        const newItems = [...prev]
        newItems[index].status = "error"
        newItems[index].error = error instanceof Error ? error.message : "Upload failed"
        return newItems
      })
    }
  }

  const handleUploadAll = async () => {
    setUploadAttempted(true)

    if (!uploaderName.trim()) {
      return
    }

    setIsUploading(true)

    for (let i = 0; i < items.length; i++) {
      if (items[i].status === "pending" || items[i].status === "error") {
        await uploadItem(items[i], i)
      }
    }

    setIsUploading(false)

    const allSuccess = items.every((item) => item.status === "success")
    if (allSuccess) {
      setTimeout(() => {
        onUploadComplete()
      }, 1000)
    }
  }

  const pendingCount = items.filter((item) => item.status === "pending").length
  const successCount = items.filter((item) => item.status === "success").length
  const errorCount = items.filter((item) => item.status === "error").length

  const showNameError = uploadAttempted && !uploaderName.trim()

  const handleNameChange = (value: string) => {
    setUploaderName(value)
    // Reset upload attempted flag when name is entered
    if (value.trim()) {
      setUploadAttempted(false)
      // Clear error status from items so they can be retried
      setItems((prev) =>
        prev.map((item) => (item.status === "error" ? { ...item, status: "pending", error: undefined } : item)),
      )
    }
  }

  return (
    <div className="space-y-4 pb-20">
      <div>
        <Label htmlFor="uploaderName">Your Name</Label>
        <Input
          id="uploaderName"
          value={uploaderName}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Enter your name..."
          disabled={isUploading}
          className={showNameError ? "border-red-500" : ""}
        />
        {showNameError && <p className="text-sm text-red-600 mt-1">Please enter your name before uploading</p>}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 mb-2">Drag and drop photos here, or click to select</p>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="bulk-file-input"
          disabled={isUploading}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("bulk-file-input")?.click()}
          disabled={isUploading}
        >
          Select Photos
        </Button>
      </div>

      {items.length > 0 && (
        <>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {items.length} photo{items.length !== 1 ? "s" : ""} selected
            </span>
            <div className="flex gap-4">
              {successCount > 0 && <span className="text-green-600">{successCount} uploaded</span>}
              {errorCount > 0 && <span className="text-red-600">{errorCount} failed</span>}
            </div>
          </div>

          <div className="max-h-[50vh] overflow-y-auto space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg bg-white">
                <img
                  src={item.preview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <Input
                    placeholder="Add a caption (optional)"
                    value={item.caption}
                    onChange={(e) => updateCaption(index, e.target.value)}
                    disabled={isUploading || item.status === "success"}
                    className="mb-2"
                  />
                  {item.status === "uploading" && <Progress value={item.progress} className="h-2" />}
                  {item.status === "error" && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>{item.error}</span>
                    </div>
                  )}
                  {item.status === "success" && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Check className="w-4 h-4" />
                      <span>Uploaded successfully</span>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeItem(index)} disabled={isUploading}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button onClick={handleUploadAll} disabled={isUploading || pendingCount === 0} className="w-full">
            {isUploading ? "Uploading..." : `Upload ${pendingCount} Photo${pendingCount !== 1 ? "s" : ""}`}
          </Button>
        </>
      )}
    </div>
  )
}
