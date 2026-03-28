import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, ImageIcon, Music, MessageSquare, QrCode } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  // Fetch user's memorials
  const { data: memorials } = await supabase
    .from("memorials")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Get content counts for each memorial
  const memorialsWithCounts = await Promise.all(
    (memorials || []).map(async (memorial) => {
      const [{ count: messagesCount }, { count: photosCount }, { count: storiesCount }, { count: musicCount }] =
        await Promise.all([
          supabase.from("messages").select("*", { count: "exact", head: true }).eq("memorial_id", memorial.id),
          supabase.from("photos").select("*", { count: "exact", head: true }).eq("memorial_id", memorial.id),
          supabase.from("stories").select("*", { count: "exact", head: true }).eq("memorial_id", memorial.id),
          supabase.from("music").select("*", { count: "exact", head: true }).eq("memorial_id", memorial.id),
        ])

      return {
        ...memorial,
        counts: {
          messages: messagesCount || 0,
          photos: photosCount || 0,
          stories: storiesCount || 0,
          music: musicCount || 0,
        },
      }
    }),
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Memorials</h1>
            <p className="text-muted-foreground mt-1">Manage your memorial pages and content</p>
          </div>
          <form
            action={async () => {
              "use server"
              const supabase = await createClient()
              await supabase.auth.signOut()
              redirect("/auth/signin")
            }}
          >
            <Button type="submit" variant="outline">
              Sign Out
            </Button>
          </form>
        </div>

        {!memorialsWithCounts || memorialsWithCounts.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Memorials Yet</CardTitle>
              <CardDescription>You haven&apos;t created any memorials yet.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Memorials are created when someone orders a QR code plaque. Once created, you&apos;ll be able to manage
                them here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {memorialsWithCounts.map((memorial) => (
              <Card key={memorial.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{memorial.full_name}</CardTitle>
                      <CardDescription>
                        {memorial.birth_date && memorial.death_date
                          ? `${new Date(memorial.birth_date).getFullYear()} - ${new Date(memorial.death_date).getFullYear()}`
                          : ""}
                      </CardDescription>
                    </div>
                    {memorial.qr_code_url && (
                      <div className="ml-2">
                        <QrCode className="h-5 w-5 text-green-600" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{memorial.counts.messages} messages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{memorial.counts.photos} photos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span>{memorial.counts.stories} stories</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4 text-muted-foreground" />
                      <span>{memorial.counts.music} audio files</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link href={`/memorial/${memorial.id}`}>View Memorial</Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1 bg-transparent">
                      <Link href={`/dashboard/memorial/${memorial.id}`}>Manage</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
