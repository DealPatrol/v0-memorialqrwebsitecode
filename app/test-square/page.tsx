import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Not available",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function TestSquarePage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">This page is not available.</h1>
    </main>
  )
}
