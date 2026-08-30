import type { Metadata } from "next"
import Link from "next/link"
import { Calendar, Heart } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Glenda Jane Kelso Memorial | Memorial QR",
  description: "In loving memory of Glenda Jane Kelso, July 27, 1952 – August 27, 2025.",
  alternates: {
    canonical: "/memorial/glenda-kelso",
  },
}

export default function GlendaKelsoMemorialPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-16">
        <Card className="overflow-hidden border-purple-100 shadow-xl">
          <div className="bg-gradient-to-r from-purple-800 to-slate-900 px-6 py-16 text-center text-white">
            <Heart className="mx-auto mb-5 size-14 text-purple-200" fill="currentColor" />
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-purple-100">In loving memory</p>
            <h1 className="text-4xl font-bold md:text-5xl">Glenda Jane Kelso</h1>
            <p className="mt-5 flex items-center justify-center gap-2 text-purple-100">
              <Calendar className="size-5" />
              July 27, 1952 – August 27, 2025
            </p>
          </div>
          <CardContent className="space-y-6 p-8 text-lg leading-relaxed text-slate-700 md:p-12">
            <p>
              Glenda was the inspiration for Memorial QR. Her grandson, Cole Collins, remembers her as the best
              storyteller he ever knew—someone who made people laugh, offered gentle wisdom, and showed her love
              through stories.
            </p>
            <p>
              Cole created this memorial so family and friends have a lasting place to remember Glenda and the stories
              she shared.
            </p>
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button asChild>
                <Link href="/our-story">Read Cole&apos;s Story</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/store">Create Your Own</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
