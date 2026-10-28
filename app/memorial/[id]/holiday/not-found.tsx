import type { Metadata } from "next"
import Link from "next/link"
import { HELP_PATH, HOLIDAY_COPY } from "@/lib/holiday-remembrance"

export const metadata: Metadata = {
  title: "Remembrance page | MemorialsQR",
  description: "This Christmas remembrance page is not available.",
  robots: { index: false, follow: false },
}

export default function HolidayRemembranceNotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center bg-[#fbf7f2] px-6 text-center text-[#3d2c29]">
      <h1 className="font-serif text-2xl">{HOLIDAY_COPY.unavailableTitle}</h1>
      <p className="mt-3 text-sm leading-relaxed text-stone-600">{HOLIDAY_COPY.unavailableBody}</p>
      <Link href={HELP_PATH} className="mt-6 text-sm underline decoration-[#c4a574] underline-offset-4">
        {HOLIDAY_COPY.help}
      </Link>
    </main>
  )
}
