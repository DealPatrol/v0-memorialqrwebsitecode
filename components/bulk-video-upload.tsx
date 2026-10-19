"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { X, Check, AlertCircle, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { uploadMemorialMedia, type UploadStage } from "@/lib/media/client-upload"
import { ACCEPT_ATTR, ACCEPT_LABEL, checkMediaFile } from "@/lib/media/shared"

interface UploadItem {
  file: File
  title: string
  status: "pending" | "uploading" | "success" | "error"
  error?: string
  progress: number
  stage?: UploadStage
}

interface BulkVideoUploadProps {
  memorialId: string
  onUploadComplete: () => void
  creatorToken?: string | null
}

export function BulkVideoUpload({ memorialId, onUploadComplete, creatorToken }: BulkVideoUploadProps) {
  const [awaitingApproval, setAwaitingApproval] = useState(0)
  const [items, setItems] = useState<UploadItem[]>([])
  const [uploaderName, setUploaderName] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

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

    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("video/") || /\.(mov|mp4|m4v|3gp|3gpp|webm|avi|mkv)$/i.test(file.name))

    addFiles(files)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      addFiles(files)
    }
  }

  const addFiles = (files: File[]) => {
    const newItems: UploadItem[] = files.map((file) => {
      const check = checkMediaFile(file, "video")
      return {
        file,
        title: file.name.replace(/\.[^/.]+$/, ""),
        status: check.ok ? "pending" : "error",
        error: check.ok ? undefined : check.error,
        progress: 0,
      }
    })

    setItems((prev) => [...prev, ...newItems])
  }

  const removeItem = (index: number) => {
    setItems((prev) => {
      const newItems = [...prev]
      newItems.splice(index, 1)
      return newItems
    })
  }

  const updateTitle = (index: number, title: string) => {
    setItems((prev) => {
      const newItems = [...prev]
      newItems[index].title = title
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

      const result = await uploadMemorialMedia({
        file: item.file,
        memorialId,
        mediaType: "video",
        title: item.title,
        uploadedBy: uploaderName,
        creatorToken,
        onProgress: (percent, stage) =>
          setItems((prev) => {
            const newItems = [...prev]
            newItems[index].progress = Math.max(10, percent)
            newItems[index].stage = stage
            return newItems
          }),
      })
      if (result.status === "pending") setAwaitingApproval((count) => count + 1)

      setItems((prev) => {
        const newItems = [...prev]
        newItems[index].status = "success"
        newItems[index].progress = 100
        return newItems
      })
    } catch (error) {
      console.error("[v0] Bulk upload item error:", error)
      setItems((prev) => {
        const newItems = [...prev]
        newItems[index].status = "error"
        newItems[index].error = error instanceof Error ? error.message : "Upload failed"
        return newItems
      })
    }
  }

  const handleUploadAll = async () => {
    if (!uploaderName.trim()) {
      alert("Please enter your name")
      return
    }

    setIsUploading(true)

    const batchSize = 3
    const pendingItems = items.map((item, index) => ({ item, index })).filter(({ item }) => item.status === "pending")

    for (let i = 0; i < pendingItems.length; i += batchSize) {
      const batch = pendingItems.slice(i, i + batchSize)
      await Promise.all(batch.map(({ item, index }) => uploadItem(item, index)))
    }

    setIsUploading(false)

    const allSuccess = items.every((item) => item.status === "success" || item.status === "error")
    if (allSuccess) {
      setTimeout(() => {
        onUploadComplete()
      }, 1000)
    }
  }

  const pendingCount = items.filter((item) => item.status === "pending").length
  const successCount = items.filter((item) => item.status === "success").length
  const errorCount = items.filter((item) => item.status === "error").length

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="uploaderName">Your Name</Label>
        <Input
          id="uploaderName"
          value={uploaderName}
          onChange={(e) => setUploaderName(e.target.value)}
          placeholder="Enter your name..."
          disabled={isUploading}
        />
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 mb-2">Drag and drop videos here, or click to select</p>
        <p className="text-xs text-gray-500 mb-4">Up to 100MB per video. {ACCEPT_LABEL.video}.</p>
        <Input
          type="file"
          accept={ACCEPT_ATTR.video}
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="bulk-video-input"
          disabled={isUploading}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("bulk-video-input")?.click()}
          disabled={isUploading}
        >
          Select Videos
        </Button>
      </div>

      {items.length > 0 && (
        <>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {items.length} video{items.length !== 1 ? "s" : ""} selected
            </span>
            <div className="flex gap-4">
              {successCount > 0 && <span className="text-green-600">{successCount} uploaded</span>}
              {errorCount > 0 && <span className="text-red-600">{errorCount} failed</span>}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg bg-white">
                <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                  <Video className="w-8 h-8 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <Input
                    placeholder="Video title"
                    value={item.title}
                    onChange={(e) => updateTitle(index, e.target.value)}
                    disabled={isUploading || item.status === "success"}
                    className="mb-2"
                  />
                  <p className="text-xs text-gray-500 mb-2">{(item.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  {item.status === "uploading" && (
                    <>
                      <Progress value={item.progress} className="h-2" />
                      {item.stage === "converting" && (
                        <p className="mt-1 text-xs text-gray-500">Converting so it plays on every phone and browser…</p>
                      )}
                    </>
                  )}
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

          {awaitingApproval > 0 && (
            <p className="rounded-md bg-purple-50 p-3 text-sm text-purple-800">
              Thank you! {awaitingApproval} video{awaitingApproval !== 1 ? "s" : ""} will appear once the family approves
              {awaitingApproval !== 1 ? " them" : " it"}.
            </p>
          )}

          <Button onClick={handleUploadAll} disabled={isUploading || pendingCount === 0} className="w-full">
            {isUploading ? "Uploading..." : `Upload ${pendingCount} Video${pendingCount !== 1 ? "s" : ""}`}
          </Button>
        </>
      )}
    </div>
  )
}
