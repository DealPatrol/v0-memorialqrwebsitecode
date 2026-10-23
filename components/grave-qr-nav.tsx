import Link from "next/link"
import { graveQrList } from "@/lib/grave-qr-pages"

export function GraveQrNav({
  heading = "QR codes for a headstone, grave, or plaque",
  intro,
  className = "",
  listClassName = "space-y-2",
}: {
  heading?: string
  intro?: string
  className?: string
  listClassName?: string
}) {
  return (
    <section aria-label={heading} className={className}>
      <h2 className="mb-3 text-2xl font-semibold text-foreground">{heading}</h2>
      {intro ? <p className="mb-4 text-muted-foreground">{intro}</p> : null}
      <ul className={listClassName}>
        {graveQrList.map((item) => (
          <li key={item.path}>
            <Link href={item.path} className="underline">
              {item.h1}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
