"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, MusicIcon } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
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

type Music = {
  id: string
  title: string
  artist: string
  duration: string | null
  audio_url: string
  created_at: string
}

export function MusicTab({ music, memorialId }: { music: Music[]; memorialId: string }) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    const supabase = createClient()

    const { error } = await supabase.from("music").delete().eq("id", deleteId)

    if (error) {
      console.error("Error deleting music:", error)
    } else {
      router.refresh()
    }

    setIsDeleting(false)
    setDeleteId(null)
  }

  if (music.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Audio Clips</CardTitle>
          <CardDescription>No audio clips have been added to this memorial yet.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {music.map((song) => (
          <Card key={song.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex gap-3 flex-1">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <MusicIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{song.title}</CardTitle>
                    <CardDescription>{song.artist}</CardDescription>
                    {song.duration && <p className="text-xs text-muted-foreground mt-1">{song.duration}</p>}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(song.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <audio controls className="w-full" src={song.audio_url}>
                Your browser does not support the audio element.
              </audio>
              <p className="text-xs text-muted-foreground mt-2">
                Added on {new Date(song.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Audio Clip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this audio clip? This action cannot be undone.
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
