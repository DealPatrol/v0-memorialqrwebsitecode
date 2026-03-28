"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Upload } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
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
import { PhotoUpload } from "@/components/photo-upload"

type Photo = {
  id: string
  photo_url: string
  caption: string | null
  uploaded_by: string
  created_at: string
}

export function PhotosTab({ photos, memorialId }: { photos: Photo[]; memorialId: string }) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteUrl, setDeleteUrl] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!deleteId || !deleteUrl) return

    setIsDeleting(true)

    try {
      const response = await fetch("/api/photos/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId: deleteId, url: deleteUrl }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete photo")
      }

      router.refresh()
    } catch (error) {
      console.error("Error deleting photo:", error)
    }

    setIsDeleting(false)
    setDeleteId(null)
    setDeleteUrl(null)
  }

  const handleUploadComplete = () => {
    setUploadDialogOpen(false)
    router.refresh()
  }

  if (photos.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          <p className="text-center text-muted-foreground">No photos have been uploaded to this memorial yet.</p>
          <div className="flex justify-center">
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload First Photo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Photo</DialogTitle>
                  <DialogDescription>Add a photo to this memorial</DialogDescription>
                </DialogHeader>
                <PhotoUpload memorialId={memorialId} onUploadComplete={handleUploadComplete} />
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
              Upload Photo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Photo</DialogTitle>
              <DialogDescription>Add a photo to this memorial</DialogDescription>
            </DialogHeader>
            <PhotoUpload memorialId={memorialId} onUploadComplete={handleUploadComplete} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={photo.photo_url || "/placeholder.svg"}
                alt={photo.caption || "Memorial photo"}
                fill
                className="object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => {
                  setDeleteId(photo.id)
                  setDeleteUrl(photo.photo_url)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="pt-4">
              {photo.caption && <p className="text-sm text-muted-foreground mt-1">{photo.caption}</p>}
              <p className="text-xs text-muted-foreground mt-2">{new Date(photo.created_at).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this photo? This action cannot be undone.
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
