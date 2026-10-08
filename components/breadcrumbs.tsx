import Link from "next/link"
import { JsonLd } from "@/components/json-ld"
import { breadcrumbJsonLd, type Crumb } from "@/lib/breadcrumbs"

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(items)} />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => {
            const last = index === items.length - 1
            return (
              <li key={`${item.href}-${item.label}`} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {last ? (
                  <span aria-current="page">{item.label}</span>
                ) : (
                  <Link href={item.href} className="underline">
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
