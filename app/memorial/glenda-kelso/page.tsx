import type { Metadata } from "next"
import { MemorialClientPage } from "../[id]/MemorialClientPage"

export const metadata: Metadata = {
  title: "Glenda Jane Kelso Memorial | Memorial QR",
  description: "In loving memory of Glenda Jane Kelso, July 27, 1952 – August 27, 2025.",
  alternates: {
    canonical: "/memorial/glenda-kelso",
  },
}

export default function GlendaKelsoMemorialPage() {
  return <MemorialClientPage />
}
