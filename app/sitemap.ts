import type { MetadataRoute } from "next"
import { blogPosts } from "@/lib/blog-posts"
import { fileLastModified } from "@/lib/content-dates"
import { isIndexableMemorial, memorialPublicPath } from "@/lib/memorial-indexing"
import { publicPages } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = Object.values(publicPages)
    .filter((page) => page.inSitemap)
    .map((page) => ({
      url: page.path === "/" ? SITE_URL : `${SITE_URL}${page.path}`,
      lastModified: fileLastModified(page.file),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))

  const posts: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(`${post.date}T00:00:00.000Z`),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  const memorials = await indexableMemorialEntries()
  const seen = new Set<string>()

  return [...staticEntries, ...posts, ...memorials].filter((entry) => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}

async function indexableMemorialEntries(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return []

  try {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase.from("memorials").select("*")
    if (error || !data) return []

    return data.flatMap((row) => {
      const record = row as Record<string, unknown>
      const path = memorialPublicPath(record)
      if (!path || !isIndexableMemorial(record)) return []
      const updated = record.updated_at || record.created_at
      const lastModified = typeof updated === "string" || updated instanceof Date ? new Date(updated) : undefined
      return [
        {
          url: `${SITE_URL}${path}`,
          lastModified: lastModified && !Number.isNaN(lastModified.getTime()) ? lastModified : undefined,
          changeFrequency: "monthly" as const,
          priority: 0.4,
        },
      ]
    })
  } catch {
    return []
  }
}
