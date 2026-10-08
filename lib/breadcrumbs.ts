import { SITE_URL } from "@/lib/site"

export type Crumb = { href: string; label: string }

export function breadcrumbJsonLd(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href === "/" ? SITE_URL : `${SITE_URL}${item.href}`,
    })),
  }
}
