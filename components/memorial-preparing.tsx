import Link from "next/link"
import { Header } from "@/components/header"

type PreparingMemorial = {
  full_name: string
  birth_date: string | null
  death_date: string | null
  profile_image_url: string | null
}

function formatDate(value: string): string {
  const [year, month, day] = value.split("-")
  if (!year || !month || !day) return value
  return `${month}/${day}/${year}`
}

export function MemorialPreparing({ memorial }: { memorial: PreparingMemorial }) {
  const dates = [memorial.birth_date, memorial.death_date].filter((value): value is string => Boolean(value))
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        {memorial.profile_image_url ? (
          <img
            src={memorial.profile_image_url}
            alt=""
            className="mx-auto mb-6 h-40 w-40 rounded-full object-cover"
          />
        ) : null}
        <h1 className="text-4xl font-semibold text-stone-900">{memorial.full_name}</h1>
        {dates.length > 0 ? (
          <p className="mt-3 text-stone-600">{dates.map(formatDate).join(" – ")}</p>
        ) : null}
        <p className="mt-8 text-lg text-stone-700">This memorial is being prepared.</p>
        <p className="mt-3 text-sm text-stone-500">
          The person who ordered it can add photos, videos, and stories after they claim the page.
        </p>
        <p className="mt-10 text-sm">
          <Link href="/" className="underline">
            MemorialsQR
          </Link>
        </p>
      </main>
    </div>
  )
}
