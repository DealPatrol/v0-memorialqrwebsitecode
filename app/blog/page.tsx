import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { BLOG_POSTS, getAllCategories } from "@/lib/blog-posts"
import { Calendar, Clock, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Memorial QR Blog | Digital Legacies & Stories",
  description:
    "Expert guides on QR memorials, grief support, family heritage preservation, and creating meaningful digital tributes. Honoring the past through modern storytelling.",
  keywords: [
    "memorial blog",
    "QR code memorial guide",
    "grief support articles",
    "digital memorial tips",
    "family history preservation",
    "cemetery QR codes",
    "memorial planning",
    "remembrance ideas",
  ],
  openGraph: {
    title: "Memorial QR Blog | Digital Legacies & Stories",
    description:
      "Expert guides on QR memorials, grief support, and preserving family heritage. Honoring the past through modern storytelling.",
    url: "https://memorialsqr.com/blog",
    type: "website",
    images: [
      {
        url: "/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "Memorial QR Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Memorial QR Blog | Digital Legacies & Stories",
    description: "Expert guides on QR memorials, grief support, and preserving family heritage.",
  },
  alternates: {
    canonical: "https://memorialsqr.com/blog",
  },
}

export default function BlogPage() {
  const categories = getAllCategories()
  const featuredPost = BLOG_POSTS[0]
  const recentPosts = BLOG_POSTS.slice(1)

  // JSON-LD for Blog
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Memorial QR Blog",
    description: "Expert guides on QR memorials, grief support, and preserving family heritage.",
    url: "https://memorialsqr.com/blog",
    publisher: {
      "@type": "Organization",
      name: "Memorial QR",
      url: "https://memorialsqr.com",
    },
    blogPost: BLOG_POSTS.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `https://memorialsqr.com/blog/${post.slug}`,
      datePublished: post.publishedAt,
      author: {
        "@type": "Organization",
        name: post.author,
      },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-primary/5 py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Digital Legacies & Stories
              </h1>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                Honoring the past through modern storytelling
              </p>
            </div>

            {/* Category Pills */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="mb-8 text-2xl font-bold text-foreground">Featured Article</h2>
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <article className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="relative aspect-video md:aspect-auto">
                    <Image
                      src={featuredPost.image || "/placeholder.svg"}
                      alt={featuredPost.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-6 md:p-8">
                    <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                      {featuredPost.category}
                    </span>
                    <h3 className="mt-2 text-2xl font-bold text-foreground group-hover:text-primary md:text-3xl">
                      {featuredPost.title}
                    </h3>
                    <p className="mt-4 text-muted-foreground">{featuredPost.excerpt}</p>
                    <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(featuredPost.publishedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                      Read Full Article
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </section>

        {/* All Posts Grid */}
        <section className="py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="mb-8 text-2xl font-bold text-foreground">All Articles</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                  <article className="h-full overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                    <div className="relative aspect-video">
                      <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                        {post.category}
                      </span>
                      <h3 className="mt-2 line-clamp-2 text-lg font-bold text-foreground group-hover:text-primary">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 py-16">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">Ready to Create a Lasting Tribute?</h2>
            <p className="mt-4 text-muted-foreground">
              Honor your loved one with a beautiful QR memorial that preserves their memory forever.
            </p>
            <Link
              href="/store"
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Shop Memorial Plaques
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
