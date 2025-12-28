"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Check, AlertCircle } from "lucide-react"
import { VideoPlayer } from "@/components/video-player"

interface VideoUploaderProps {
  onVideoSelected?: (file: File) => void
}

export function VideoUploader({ onVideoSelected }: VideoUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setIsSuccess(false)

    const file = e.target.files?.[0]
    if (!file) return

    // Check if it's a video file
    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file")
      return
    }

    // Check file size (limit to 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError("Video file is too large (max 100MB)")
      return
    }

    setSelectedFile(file)

    // Create a preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    // Call the callback if provided
    if (onVideoSelected) {
      onVideoSelected(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setError(null)

    try {
      // Simulate upload - in a real app, you'd upload to your server or storage service
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setIsSuccess(true)
      console.log("Video ready for use:", selectedFile.name)

      // In a real implementation, you would:
      // 1. Upload the file to your server or cloud storage
      // 2. Get back a permanent URL
      // 3. Save that URL to your database
    } catch (err) {
      console.error("Upload error:", err)
      setError("Failed to upload video. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setError(null)
    setIsSuccess(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        {!previewUrl ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
              id="video-upload"
            />
            <label htmlFor="video-upload" className="flex flex-col items-center justify-center cursor-pointer">
              <Upload className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-lg font-medium mb-1">Click to upload your video</p>
              <p className="text-sm text-gray-500">MP4, WebM or OGG (max 100MB)</p>
            </label>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Video Preview</h3>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            </div>
            <VideoPlayer
              src={previewUrl}
              title={selectedFile?.name || "Uploaded Video"}
              fallbackImage="/images/hero-image.png"
            />

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                {selectedFile?.name} ({(selectedFile?.size || 0) / (1024 * 1024).toFixed(2)} MB)
              </div>
              <Button
                onClick={handleUpload}
                disabled={isUploading || isSuccess}
                className={isSuccess ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {isUploading ? (
                  <>Uploading...</>
                ) : isSuccess ? (
                  <>
                    <Check className="h-4 w-4 mr-1" /> Ready to Use
                  </>
                ) : (
                  <>Use This Video</>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start">
          <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>Video ready to use! You can now add it to your memorial page.</span>
        </div>
      )}
    </div>
  )
}
