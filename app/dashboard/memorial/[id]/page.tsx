import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessagesTab } from "@/components/dashboard/messages-tab"
import { PhotosTab } from "@/components/dashboard/photos-tab"
import { StoriesTab } from "@/components/dashboard/stories-tab"
import { MusicTab } from "@/components/dashboard/music-tab"
import { VideosTab } from "@/components/dashboard/videos-tab"
import { PendingMediaTab, type PendingItem } from "@/components/dashboard/pending-media-tab"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { isAdminEmail } from "@/lib/admin-emails"
import { isApproved } from "@/lib/media/shared"
import { selectPendingMedia } from "@/lib/media/server"

export default async function ManageMemorialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Owners manage their own memorials; site admins can also moderate memorials without an owner (e.g. Glenda's).
  const isAdmin = Boolean(user.email_confirmed_at && isAdminEmail(user.email))
  const db = isAdmin ? createServiceRoleClient() : supabase
  const memorialQuery = db.from("memorials").select("*").eq("id", id)
  const { data: memorial } = await (isAdmin ? memorialQuery : memorialQuery.eq("user_id", user.id)).single()

  if (!memorial) {
    redirect("/dashboard")
  }

  const [{ data: messages }, { data: allPhotos }, { data: stories }, { data: allMusic }, { data: allVideos }, pending] =
    await Promise.all([
      db.from("messages").select("*").eq("memorial_id", id).order("created_at", { ascending: false }),
      db.from("photos").select("*").eq("memorial_id", id).order("created_at", { ascending: false }),
      db.from("stories").select("*").eq("memorial_id", id).order("created_at", { ascending: false }),
      db.from("music").select("*").eq("memorial_id", id).order("created_at", { ascending: false }),
      db.from("videos").select("*").eq("memorial_id", id).order("created_at", { ascending: false }),
      selectPendingMedia(id).catch(() => []),
    ])
  // Pending and hidden visitor uploads stay out of the regular tabs.
  const photos = (allPhotos ?? []).filter(isApproved)
  const music = (allMusic ?? []).filter(isApproved)
  const videos = (allVideos ?? []).filter(isApproved)
  const pendingItems = pending as PendingItem[]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{memorial.full_name}</CardTitle>
            <CardDescription>
              {memorial.birth_date && memorial.death_date
                ? `${new Date(memorial.birth_date).toLocaleDateString()} - ${new Date(memorial.death_date).toLocaleDateString()}`
                : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href={`/memorial/${memorial.id}`}>View Public Memorial</Link>
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue={pendingItems.length > 0 ? "pending" : "messages"} className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="pending">Needs approval ({pendingItems.length})</TabsTrigger>
            <TabsTrigger value="messages">Messages ({messages?.length || 0})</TabsTrigger>
            <TabsTrigger value="photos">Photos ({photos?.length || 0})</TabsTrigger>
            <TabsTrigger value="videos">Videos ({videos?.length || 0})</TabsTrigger>
            <TabsTrigger value="stories">Stories ({stories?.length || 0})</TabsTrigger>
            <TabsTrigger value="music">Voicemails/Audio ({music?.length || 0})</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <PendingMediaTab items={pendingItems} />
          </TabsContent>
          <TabsContent value="messages">
            <MessagesTab messages={messages || []} memorialId={id} />
          </TabsContent>
          <TabsContent value="photos">
            <PhotosTab photos={photos || []} memorialId={id} />
          </TabsContent>
          <TabsContent value="videos">
            <VideosTab videos={videos || []} memorialId={id} />
          </TabsContent>
          <TabsContent value="stories">
            <StoriesTab stories={stories || []} memorialId={id} />
          </TabsContent>
          <TabsContent value="music">
            <MusicTab music={music || []} memorialId={id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
