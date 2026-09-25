"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { usePathname } from "next/navigation"

export function Breadcrumbs() {
  const pathname = usePathname()

  // Don't show on homepage
  if (pathname === "/") return null

  const segments = pathname.split("/").filter(Boolean)

  // Generate breadcrumb items
  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    return { href, label, isLast: index === segments.length - 1 }
  })

  return (
    <nav aria-label="Breadcrumb" className="py-4 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <ol
        className="flex items-center space-x-2 text-sm max-w-7xl mx-auto"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <Link
            href="/"
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            itemProp="item"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only" itemProp="name">
              Home
            </span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>

        {breadcrumbs.map((crumb, index) => (
          <li
            key={crumb.href}
            className="flex items-center"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />
            {crumb.isLast ? (
              <span className="text-foreground font-medium" itemProp="name">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
                itemProp="item"
              >
                <span itemProp="name">{crumb.label}</span>
              </Link>
            )}
            <meta itemProp="position" content={`${index + 2}`} />
          </li>
        ))}
      </ol>
    </nav>
  )
}
