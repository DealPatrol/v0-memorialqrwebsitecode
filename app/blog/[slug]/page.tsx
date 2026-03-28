import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Mail } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { blogPosts } from "@/lib/blog-posts"

// Full blog post content
const blogPostsContent: Record<
  string,
  {
    content: string
  }
> = {
  "complete-guide-to-memorial-qr-codes": {
    content: `
# The Complete Guide to Memorial QR Codes

In today's digital age, the way we honor and remember our loved ones is evolving. Memorial QR codes represent a beautiful fusion of traditional remembrance and modern technology, creating lasting tributes that connect the physical and digital worlds.

## What Are Memorial QR Codes?

Memorial QR codes are specialized QR codes engraved on plaques, headstones, or keepsakes that link to digital memorial pages. When scanned with a smartphone, these codes instantly connect visitors to a rich multimedia tribute featuring photos, videos, stories, and memories of the departed.

## Why Choose a QR Memorial?

### 1. **Unlimited Digital Content**
Traditional memorials are limited by physical space. QR memorials allow you to share:
- Unlimited photos and videos
- Audio recordings and favorite songs
- Life stories and achievements
- Guest messages and tributes
- Family trees and genealogy

### 2. **Always Accessible**
Family and friends can access the memorial anytime, anywhere in the world. No need to visit a physical location—memories are just a scan away.

### 3. **Forever Updating**
Unlike traditional memorials that are permanent and unchanging, digital memorials can be updated with new memories, photos, and tributes as time goes on.

### 4. **Eco-Friendly**
Digital memorials reduce the need for paper memorial cards and programs, making them an environmentally conscious choice.

## How Memorial QR Codes Work

The process is beautifully simple:

1. **Create the Memorial**: Upload photos, videos, and stories to create a digital memorial page
2. **Generate the QR Code**: A unique QR code is created that links to your memorial
3. **Physical Display**: The QR code is engraved on your chosen memorial product (plaque, headstone tag, pendant, etc.)
4. **Easy Access**: Anyone can scan the code with their smartphone to view the full memorial

## Choosing the Right Memorial QR Product

### Memorial Plaques
Perfect for headstones, garden displays, or home memorials. Available in Gold, Silver, and Black finishes with weather-resistant materials.

### Personal Keepsakes
- **Necklaces and Pendants**: Keep memories close to your heart
- **Keychains**: Carry remembrance with you daily
- **Slate Coasters**: Beautiful memorial keepsakes for the home

## Best Practices for Creating a Memorial QR Page

### Tell Their Story
- Include birth and passing dates
- Share life milestones and achievements
- Describe their personality and values
- Include favorite quotes or sayings

### Curate Meaningful Photos
- Choose photos from different life stages
- Include candid moments, not just formal portraits
- Show them doing what they loved
- Include family gatherings and celebrations

### Add Video and Audio
- Record family members sharing memories
- Include favorite songs or music they played
- Add video messages for future generations
- Capture their voice if recordings exist

## Getting Started

Creating a memorial QR tribute is easier than you might think:

1. Choose your memorial product
2. Gather photos, videos, and stories
3. Create your digital memorial page
4. Receive your custom QR memorial product
5. Share with family and friends

Memorial QR codes represent the perfect balance between honoring tradition and embracing innovation. They allow us to create rich, lasting tributes that can be shared across generations, ensuring that the memories of those we love never fade.

---

*Ready to create a lasting memorial? Explore our collection of memorial QR products and start building a beautiful digital tribute today.*
    `,
  },
  "pet-memorial-ideas-honoring-furry-friends": {
    content: `
# 25 Beautiful Pet Memorial Ideas to Honor Your Furry Friend

Losing a pet is one of the most painful experiences we face. Our furry companions give us unconditional love, endless joy, and unwavering loyalty. When they pass, we're left with a profound sense of loss. Creating a memorial helps us process grief while celebrating the beautiful life we shared with them.

## Why Pet Memorials Matter

Pets aren't "just animals"—they're family members who hold irreplaceable places in our hearts. Creating a memorial:
- Validates your grief and loss
- Provides a focal point for remembrance
- Helps children understand and process pet loss
- Celebrates the joy your pet brought to your life
- Creates a lasting tribute for years to come

## Physical Memorial Ideas

### 1. **Memorial Garden Stone**
Create a peaceful garden memorial with a custom engraved stone. Add a QR code that links to photos and videos of your pet playing in that very garden.

### 2. **Pet Memorial Plaque**
Weather-resistant memorial plaques can be placed anywhere—in your yard, on your patio, or beside their favorite napping spot.

### 3. **Slate Memorial Coaster**
Beautiful slate coasters with personalized engravings and QR codes make touching keepsakes you can display in your home.

## Wearable Memorials

### 4. **Memorial Pendant Necklace**
Wear a pendant engraved with their name or paw print. Add a QR code to access their memorial page wherever you go.

### 5. **Keychain Memorial**
Keep their memory close with a custom keychain featuring their photo and a QR memorial link.

## Digital Memorial Ideas

### 6. **QR Code Memorial Page**
Create a comprehensive digital memorial with photos, videos, and stories. Share the QR code with family and friends.

### 7. **Social Media Tribute Page**
Create a dedicated memorial page or group where family and friends can share photos and memories.

## Coping with Pet Loss

Creating a memorial is part of the healing process, but grief takes time:

- **Allow yourself to grieve**: Your pain is real and valid
- **Talk about your feelings**: Share with understanding friends or pet loss support groups
- **Consider a memorial timeline**: You don't have to decide everything immediately

## Conclusion

Your pet gave you years of unconditional love, loyalty, and companionship. They deserved nothing less than to be remembered and honored. Whether you choose a physical memorial, digital tribute, or charitable act, what matters most is that it feels right to you.

---

*Ready to create a lasting memorial for your beloved pet? Explore our pet memorial products and create a beautiful tribute that celebrates their life and legacy.*
    `,
  },
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug)

  if (!post) {
    return {
      title: "Article Not Found",
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://memorialqr.com"

  return {
    title: `${post.title} | Memorial QR Blog`,
    description: post.excerpt,
    keywords: `${post.category.toLowerCase()}, memorial QR, digital memorials, ${post.slug.replace(/-/g, " ")}`,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      url: `${siteUrl}/blog/${params.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
    alternates: {
      canonical: `/blog/${params.slug}`,
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug)
  const postContent = blogPostsContent[params.slug]

  if (!post || !postContent) {
    notFound()
  }

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Memorial QR",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://memorialqr.com"}/images/41730040-9590-452b-80df.jpeg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://memorialqr.com"}/blog/${params.slug}`,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />

        {/* Back Button */}
        <div className="container mx-auto px-4 py-6">
          <Button asChild variant="ghost">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <article className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            <div className="aspect-video relative bg-slate-200 rounded-lg overflow-hidden mb-8">
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="object-cover w-full h-full" />
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <Badge variant="secondary" className="text-base">
                {post.category}
              </Badge>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">{post.title}</h1>

            {/* Share Buttons */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b">
              <span className="text-sm font-medium text-muted-foreground">Share:</span>
              <Button variant="outline" size="sm">
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
              <Button variant="outline" size="sm">
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-blue-600 prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground">
              {postContent.content.split("\n").map((paragraph, index) => {
                if (paragraph.startsWith("# ")) {
                  return (
                    <h1 key={index} className="text-4xl font-bold mt-8 mb-4">
                      {paragraph.replace("# ", "")}
                    </h1>
                  )
                }
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={index} className="text-3xl font-bold mt-8 mb-4">
                      {paragraph.replace("## ", "")}
                    </h2>
                  )
                }
                if (paragraph.startsWith("### ")) {
                  return (
                    <h3 key={index} className="text-2xl font-bold mt-6 mb-3">
                      {paragraph.replace("### ", "")}
                    </h3>
                  )
                }
                if (paragraph.startsWith("---")) {
                  return <hr key={index} className="my-8" />
                }
                if (paragraph.trim() === "") {
                  return <br key={index} />
                }
                if (paragraph.startsWith("*") && paragraph.endsWith("*")) {
                  return (
                    <p key={index} className="italic text-muted-foreground my-6">
                      {paragraph.replace(/\*/g, "")}
                    </p>
                  )
                }
                return (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                )
              })}
            </div>

            {/* CTA Section */}
            <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Create a Lasting Memorial?</h3>
                <p className="text-muted-foreground mb-6">
                  Honor your loved ones with a beautiful QR memorial that preserves their legacy forever.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/store">Browse Memorial Products</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/pricing">View Pricing</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </article>
      </div>
    </>
  )
}
