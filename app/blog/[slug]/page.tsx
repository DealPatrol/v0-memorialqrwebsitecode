import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Mail } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { blogPosts } from "@/lib/blog-posts"
import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { assertMetadataLength, CONCIERGE_PRICE_LABEL, pageMetadata } from "@/lib/seo"
import { SITE_NAME, SITE_URL } from "@/lib/site"

for (const post of blogPosts) {
  assertMetadataLength(post.seoTitle, post.seoDescription, `/blog/${post.slug}`)
}

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

A QR code memorial is a code that opens an online memorial page. The page holds photos, videos, stories, and messages. MemorialsQR sells QR keepsakes that open that page, and every keepsake includes 10 years of hosting.

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

### 3. **Always Updatable**
Unlike traditional memorials that are permanent and unchanging, digital memorials can be updated with new memories, photos, and tributes as time goes on.

### 4. **Eco-Friendly**
Digital memorials reduce the need for paper memorial cards and programs, making them an environmentally conscious choice.

## How Memorial QR Codes Work

The process is beautifully simple:

1. **Create the Memorial**: Upload photos, videos, and stories to create a digital memorial page
2. **Generate the QR Code**: A unique QR code is created that links to your memorial
3. **Share the page**: Download a QR code or send the link. MemorialsQR does not engrave or ship a physical product.
4. **Easy Access**: Anyone with the link can open the memorial page

## What MemorialsQR Sells Today

Every MemorialsQR keepsake includes 10 years of hosting for its memorial page, with no recurring fees. The concierge memorial service is ${CONCIERGE_PRICE_LABEL} if you want the page built for you.

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

1. Gather photos, videos, and stories
2. Create the online memorial page
3. Share the link, or download a QR code
4. Hosting is included for 10 years with your keepsake

A digital memorial can be shared with family wherever they are.

---

*Ready to create a lasting memorial? Choose a QR keepsake with 10 years of hosting included.*
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

These are things a family might make on their own. MemorialsQR does not sell these particular items.

### 1. **Memorial Garden Stone**
Create a peaceful garden memorial with a custom engraved stone. Add a QR code that links to photos and videos of your pet playing in that very garden.

### 2. **A marker the family already has**
A stone or marker already in the yard can sit beside a favorite spot. MemorialsQR does not sell it.

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

*Ready to create a pet memorial page? See our QR keepsakes. Each one includes 10 years of hosting for the page.*
    `,
  },
  "memorial-headstone-plaques-buying-guide": {
    content: `
MemorialsQR sells printed QR keepsakes that open an online memorial page. Headstone tags and garden stones are not for sale.

Every keepsake includes 10 years of hosting for its memorial website. The concierge memorial service is ${CONCIERGE_PRICE_LABEL} when you want the page built for you.

You can download a QR code that opens the page and share that link with family.
    `,
  },
  "kudoboard-vs-tribute-memorial": {
    content: `
*Prices below are from each company's own pricing page, checked November 25, 2026. Prices change, so confirm before you buy.*

## The short answer

Kudoboard is a shared online board where family and friends post messages, photos, and videos. Its Full Memorial Board is a $99 one-time charge, and a free Mini Memorial Board holds up to 10 posts.

Tribute collects recorded video messages and turns them into one memorial video you can play at the funeral or celebration of life. The do-it-yourself plan is $35 for a video up to 30 minutes ($49 for 31 to 60 minutes, $99 for 61 minutes or more). Tribute's Concierge plan, where an editor makes the video, is listed at $99.

A MemorialsQR digital memorial page is $${DIGITAL_MEMORIAL_PRODUCT.price.toFixed(2)} once. You get an online memorial page and a QR code you can print or share, with ${HOSTING_INCLUDED_YEARS} years of hosting and no monthly fee.

## When Kudoboard is the better fit

Pick Kudoboard when many people want to leave written condolences, photos, and short videos in one place, especially coworkers or friends spread across the country. The board is the keepsake. Kudoboard lists exportable content and a slideshow you can embed or play.

## When Tribute is the better fit

Pick Tribute when you want one finished video to play at the service. Family and friends record short video messages, and you (or Tribute's editors) arrange them with music. Tribute says a memorial video can be up to 4 hours long and that Concierge editing takes 2 to 3 business days per round, so set the message deadline a few days before the service.

## Where a memorial QR code page fits

A board and a video are made for the weeks around the funeral. A memorial QR page is made for years after it. The QR code can go on a funeral program, a framed photo at home, a sympathy card, or a keepsake, and anyone who scans it opens the same page of photos, videos, stories, and audio. You add and update the content yourself, and the code keeps opening the same page.

## Side by side

### Kudoboard memorial board
Format: shared online board. Cost: free up to 10 posts, $99 one time for unlimited posts with video. Best for: many people leaving written messages.

### Tribute memorial video
Format: one edited group video. Cost: $35 and up for DIY by length, Concierge listed at $99. Best for: playing at the service.

### MemorialsQR digital memorial page
Format: online memorial page plus a QR code. Cost: $${DIGITAL_MEMORIAL_PRODUCT.price.toFixed(2)} once with ${HOSTING_INCLUDED_YEARS} years of hosting. Best for: a page people can scan and return to for years.

## Can you use more than one?

Yes. Many families make a video for the service and keep a memorial page for later. You can download the finished Tribute video and add it to a memorial page, or link the Kudoboard board from it.

## Questions people ask

### Is Kudoboard free for a memorial?
Only for a small board. The Mini Memorial Board is free up to 10 posts. The Full Memorial Board, with unlimited posts and video posts, is $99 one time.

### How much does a Tribute memorial video cost?
DIY is $35 for up to 30 minutes, $49 for 31 to 60 minutes, and $99 for 61 minutes or more. Tribute lets you start a free draft and pay before you publish and collect videos.

### Does MemorialsQR make a group video or a message board?
No. MemorialsQR sells an online memorial page with a QR code. You add the photos, videos, stories, and audio yourself, or pay for the concierge service (${CONCIERGE_PRICE_LABEL}) to have the page built for you.

*MemorialsQR is not affiliated with Kudoboard or Tribute.*
    `,
  },
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find((item) => item.slug === params.slug)

  if (!post) {
    return pageMetadata({
      title: "Article Not Found | MemorialsQR",
      description: "This memorial guide is not available.",
      path: `/blog/${params.slug}`,
      index: false,
    })
  }

  const metadata = pageMetadata({
    title: post.seoTitle,
    description: post.seoDescription,
    path: `/blog/${params.slug}`,
    ogType: "article",
  })

  return {
    ...metadata,
    authors: [{ name: post.author }],
    openGraph: {
      ...metadata.openGraph,
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
    },
    twitter: {
      ...metadata.twitter,
      images: [post.image],
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((item) => item.slug === params.slug)
  const postContent = blogPostsContent[params.slug]

  if (!post) {
    notFound()
  }

  const articleBody = postContent?.content ?? post.excerpt

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    // Posts are written by the MemorialsQR team, not a named person, so the author is the business.
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/brand-logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${params.slug}`,
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
              {articleBody.split("\n").map((paragraph, index) => {
                if (paragraph.startsWith("# ")) {
                  return (
                    <h2 key={index} className="text-3xl font-bold mt-8 mb-4">
                      {paragraph.replace("# ", "")}
                    </h2>
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
                  Honor your loved ones with a beautiful QR memorial that shares their story with family and friends.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/store">See Keepsakes</Link>
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
