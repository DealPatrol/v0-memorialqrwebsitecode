"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"

export default function VideoManagementPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if it's a video file
    if (!file.type.startsWith("video/")) {
      setMessage({ text: "Please select a valid video file", type: "error" })
      return
    }

    // Check file size (limit to 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setMessage({ text: "Video file is too large (max 100MB)", type: "error" })
      return
    }

    setSelectedFile(file)
    setMessage({ text: "Video selected. Click 'Upload' to continue.", type: "info" })
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setMessage({ text: "Uploading video...", type: "info" })

    try {
      // Create form data
      const formData = new FormData()
      formData.append("file", selectedFile)

      // Upload to server
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setMessage({ text: "Video uploaded successfully!", type: "success" })
      console.log("Upload successful:", data)
    } catch (error) {
      console.error("Upload error:", error)
      setMessage({ text: "Failed to upload video. Please try again.", type: "error" })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-2">Video Management</h1>
          <p className="text-gray-600 mb-6">Upload and manage videos for your Memorial QR website.</p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
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
              <p className="text-lg font-medium mb-1">Click to select a video</p>
              <p className="text-sm text-gray-500">MP4, WebM or OGG (max 100MB)</p>
            </label>

            {selectedFile && (
              <div className="mt-4 text-left">
                <p className="font-medium">Selected file:</p>
                <p className="text-sm text-gray-600">
                  {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
                <Button onClick={handleUpload} disabled={isUploading} className="mt-4">
                  {isUploading ? "Uploading..." : "Upload Video"}
                </Button>
              </div>
            )}
          </div>

          {message && (
            <div
              className={`mt-4 p-4 rounded-md ${
                message.type === "error"
                  ? "bg-red-50 text-red-700"
                  : message.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-blue-50 text-blue-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Using Videos on Your Site</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Upload your video using the form above</li>
              <li>Once uploaded, you'll receive a link to your video</li>
              <li>Use this link in the memorial page editor to add your video</li>
              <li>Videos will automatically be optimized for web viewing</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
