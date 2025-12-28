import { Heart, PawPrint, Users, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MemorialPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">Honor Their Memory Forever</h1>
          <p className="text-lg md:text-xl text-muted-foreground text-balance">
            Create lasting digital memorials for your loved ones. Share stories, photos, and cherished moments that
            celebrate their life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="text-base">
              <Heart className="mr-2 h-5 w-5" />
              Create Memorial
            </Button>
            <Button size="lg" variant="outline" className="text-base bg-transparent">
              View Examples
            </Button>
          </div>
        </div>
      </section>

      {/* Human Memorials Section - Primary Focus */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-2">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Celebrate Lives That Touched Our Hearts</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
              Every life tells a unique story. Create a beautiful, personalized memorial that honors their legacy and
              keeps their memory alive for generations.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Beautiful Timelines</CardTitle>
                <CardDescription>
                  Share life's journey through photos, videos, and stories arranged in an elegant timeline format.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Condolence Book</CardTitle>
                <CardDescription>
                  Allow friends and family to share memories, condolences, and tributes in a dedicated space.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Private or Public</CardTitle>
                <CardDescription>
                  Control who can view and contribute to the memorial with flexible privacy settings.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Human Memorial Showcase */}
          <div className="grid md:grid-cols-2 gap-8 pt-8">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Memorial Preview
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Share Their Story</h3>
                <p className="text-muted-foreground">
                  Create a comprehensive tribute with photos, videos, life milestones, and personal anecdotes that
                  capture their unique spirit.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  QR Code Memorial
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Connect Physical & Digital</h3>
                <p className="text-muted-foreground">
                  Generate QR codes for headstones, allowing visitors to access the full memorial and leave tributes
                  from anywhere.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pet Memorials Section */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center p-2 bg-accent rounded-full mb-2">
                <PawPrint className="h-6 w-6 text-accent-foreground" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Honoring Our Beloved Pets</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
                Pets are family too. Create a special memorial for the furry, feathered, or scaled companions who
                brought joy to your life.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PawPrint className="h-5 w-5 text-primary" />
                    Pet Memorial Pages
                  </CardTitle>
                  <CardDescription>
                    Celebrate the unconditional love and companionship your pet provided with a dedicated memorial page
                    featuring their photos, favorite moments, and the special bond you shared.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Create Pet Memorial
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Forever in Our Hearts
                  </CardTitle>
                  <CardDescription>
                    Share stories of the joy they brought, the funny moments, and the deep connection that made them
                    more than just a pet—they were family.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6 bg-card border rounded-lg p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold">Start Creating a Memorial Today</h2>
          <p className="text-muted-foreground text-lg text-balance">
            Honor their memory with a beautiful, lasting tribute that friends and family can visit anytime, anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg">Get Started Free</Button>
            <Button size="lg" variant="outline">
              View Pricing
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
