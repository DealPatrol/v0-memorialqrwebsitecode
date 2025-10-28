"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Upload, VideoIcon } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { VideoUpload } from "@/components/video-upload"

type VideoType = {
  id: string
  video_url: string
  title: string
  uploaded_by: string
  created_at: string
}

export function VideosTab({ videos, memorialId }: { videos: VideoType[]; memorialId: string }) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteUrl, setDeleteUrl] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!deleteId || !deleteUrl) return

    setIsDeleting(true)

    try {
      const response = await fetch("/api/videos/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: deleteId, url: deleteUrl }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete video")
      }

      router.refresh()
    } catch (error) {
      console.error("Error deleting video:", error)
    }

    setIsDeleting(false)
    setDeleteId(null)
    setDeleteUrl(null)
  }

  const handleUploadComplete = () => {
    setUploadDialogOpen(false)
    router.refresh()
  }

  if (videos.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          <p className="text-center text-muted-foreground">No videos have been uploaded to this memorial yet.</p>
          <div className="flex justify-center">
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload First Video
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Video</DialogTitle>
                  <DialogDescription>Add a video to this memorial</DialogDescription>
                </DialogHeader>
                <VideoUpload memorialId={memorialId} onUploadComplete={handleUploadComplete} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="mb-4">
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Video
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Video</DialogTitle>
              <DialogDescription>Add a video to this memorial</DialogDescription>
            </DialogHeader>
            <VideoUpload memorialId={memorialId} onUploadComplete={handleUploadComplete} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="relative bg-slate-100">
              <video src={video.video_url} controls className="w-full aspect-video">
                Your browser does not support the video element.
              </video>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => {
                  setDeleteId(video.id)
                  setDeleteUrl(video.video_url)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="pt-4">
              <div className="flex items-start gap-2">
                <VideoIcon className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{video.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">Uploaded by {video.uploaded_by}</p>
                  <p className="text-xs text-muted-foreground">{new Date(video.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this video? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
