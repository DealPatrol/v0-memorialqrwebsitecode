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

export default async function ManageMemorialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  // Fetch memorial and verify ownership
  const { data: memorial } = await supabase.from("memorials").select("*").eq("id", id).eq("user_id", user.id).single()

  if (!memorial) {
    redirect("/dashboard")
  }

  const [{ data: messages }, { data: photos }, { data: stories }, { data: music }, { data: videos }] =
    await Promise.all([
      supabase.from("messages").select("*").eq("memorial_id", id).order("created_at", { ascending: false }),
      supabase.from("photos").select("*").eq("memorial_id", id).order("created_at", { ascending: false }),
      supabase.from("stories").select("*").eq("memorial_id", id).order("created_at", { ascending: false }),
      supabase.from("music").select("*").eq("memorial_id", id).order("created_at", { ascending: false }),
      supabase.from("videos").select("*").eq("memorial_id", id).order("created_at", { ascending: false }),
    ])

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

        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="messages">Messages ({messages?.length || 0})</TabsTrigger>
            <TabsTrigger value="photos">Photos ({photos?.length || 0})</TabsTrigger>
            <TabsTrigger value="videos">Videos ({videos?.length || 0})</TabsTrigger>
            <TabsTrigger value="stories">Stories ({stories?.length || 0})</TabsTrigger>
            <TabsTrigger value="music">Voicemails/Audio ({music?.length || 0})</TabsTrigger>
          </TabsList>
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
