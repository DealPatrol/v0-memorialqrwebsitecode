import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { SellableProductGrid } from "@/components/sellable-product-grid"
import { STORE_COLLECTIONS, type CollectionId } from "@/lib/store-catalog"
import { assertMetadataLength, pageMetadata } from "@/lib/seo"

const COPY: Record<CollectionId, { title: string; description: string }> = {
  "pet-memorials": {
    title: "Pet Memorial Keepsakes | MemorialsQR",
    description:
      "Pet memorial keepsakes printed with a photo and a QR code that opens the pet's memorial page. Shipping is included.",
  },
  "human-memorials": {
    title: "Human Memorial Keepsakes | MemorialsQR",
    description:
      "Human memorial canvases, books, blankets, and jewelry. Each QR code opens that person's memorial page.",
  },
  ornaments: {
    title: "Remembrance Ornaments | MemorialsQR",
    description:
      "Christmas and remembrance ornaments, including a glass wind chime, each printed with a memorial QR code.",
  },
  "garden-outdoor": {
    title: "Garden Memorial Keepsakes | MemorialsQR",
    description: "Garden stones and outdoor memorial pieces. The QR code on each one opens a memorial page.",
  },
  "jewelry-keepsakes": {
    title: "Memorial Jewelry | MemorialsQR",
    description:
      "Photo pendants and an engraved cross necklace. A packed card carries a black-on-white QR code at least 1 inch wide.",
  },
}

export function generateStaticParams() {
  return STORE_COLLECTIONS.map((collection) => ({ slug: collection.id }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const collection = STORE_COLLECTIONS.find((item) => item.id === params.slug)
  const path = `/store/collections/${params.slug}`
  if (!collection || !(collection.id in COPY)) {
    return pageMetadata({ title: "Collection | MemorialsQR", description: "This collection is not available.", path, index: false })
  }
  const copy = COPY[collection.id]
  assertMetadataLength(copy.title, copy.description, path)
  return pageMetadata({ title: copy.title, description: copy.description, path })
}

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const collection = STORE_COLLECTIONS.find((item) => item.id === params.slug)
  if (!collection) notFound()

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="mb-3 text-sm">
          <Link href="/store" className="underline">
            All keepsakes
          </Link>
        </p>
        <h1 className="text-4xl font-bold text-foreground">{collection.title}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{collection.description}</p>
      </main>
      <SellableProductGrid collectionId={collection.id} />
    </div>
  )
}
