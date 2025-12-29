"use client"

import { useState } from "react"
import { Download, FileText, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

interface ExportMemorialDialogProps {
  memorialId: string
  memorialName: string
}

export function ExportMemorialDialog({ memorialId, memorialName }: ExportMemorialDialogProps) {
  const [open, setOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [includePhotos, setIncludePhotos] = useState(true)
  const [includeVideos, setIncludeVideos] = useState(false)
  const [includeStories, setIncludeStories] = useState(true)
  const [includeMessages, setIncludeMessages] = useState(true)
  const [includeTimeline, setIncludeTimeline] = useState(true)
  const { toast } = useToast()

  const handleExportPDF = async () => {
    setExporting(true)
    try {
      const response = await fetch(`/api/memorials/${memorialId}/export/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          includePhotos,
          includeVideos,
          includeStories,
          includeMessages,
          includeTimeline,
        }),
      })

      if (!response.ok) {
        throw new Error("Export failed")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${memorialName.replace(/\s+/g, "-")}-memorial.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Export Complete",
        description: "Memorial PDF has been downloaded",
      })
      setOpen(false)
    } catch (error) {
      console.error("[v0] Export error:", error)
      toast({
        title: "Export Failed",
        description: "Failed to export memorial. Please try again.",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  const handleExportPhotos = async () => {
    setExporting(true)
    try {
      const response = await fetch(`/api/memorials/${memorialId}/export/photos`)

      if (!response.ok) {
        throw new Error("Export failed")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${memorialName.replace(/\s+/g, "-")}-photos.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Export Complete",
        description: "Photo album has been downloaded",
      })
      setOpen(false)
    } catch (error) {
      console.error("[v0] Export error:", error)
      toast({
        title: "Export Failed",
        description: "Failed to export photos. Please try again.",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Memorial
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Memorial</DialogTitle>
          <DialogDescription>Download a copy of this memorial in various formats</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">PDF Memorial Book</h4>
            <p className="text-sm text-slate-600">Create a printable memorial book with selected content</p>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includePhotos"
                  checked={includePhotos}
                  onCheckedChange={(checked) => setIncludePhotos(checked as boolean)}
                />
                <Label htmlFor="includePhotos" className="text-sm font-normal cursor-pointer">
                  Include photos
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeVideos"
                  checked={includeVideos}
                  onCheckedChange={(checked) => setIncludeVideos(checked as boolean)}
                />
                <Label htmlFor="includeVideos" className="text-sm font-normal cursor-pointer">
                  Include video thumbnails
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeStories"
                  checked={includeStories}
                  onCheckedChange={(checked) => setIncludeStories(checked as boolean)}
                />
                <Label htmlFor="includeStories" className="text-sm font-normal cursor-pointer">
                  Include stories & memories
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeMessages"
                  checked={includeMessages}
                  onCheckedChange={(checked) => setIncludeMessages(checked as boolean)}
                />
                <Label htmlFor="includeMessages" className="text-sm font-normal cursor-pointer">
                  Include messages
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeTimeline"
                  checked={includeTimeline}
                  onCheckedChange={(checked) => setIncludeTimeline(checked as boolean)}
                />
                <Label htmlFor="includeTimeline" className="text-sm font-normal cursor-pointer">
                  Include timeline
                </Label>
              </div>
            </div>

            <Button onClick={handleExportPDF} disabled={exporting} className="w-full">
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </div>

          <div className="border-t pt-4 space-y-4">
            <h4 className="font-semibold text-sm">Photo Album</h4>
            <p className="text-sm text-slate-600">Download all photos as a ZIP archive</p>

            <Button
              onClick={handleExportPhotos}
              disabled={exporting}
              variant="outline"
              className="w-full bg-transparent"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Preparing Download...
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Download Photos
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
