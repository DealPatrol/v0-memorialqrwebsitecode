import { Skeleton } from "@/components/ui/skeleton"

export default function BlogLoading() {
  return (
    <main className="min-h-screen bg-background">
      <section className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <Skeleton className="mx-auto h-12 w-80" />
          <Skeleton className="mx-auto mt-4 h-6 w-60" />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-8 h-80 w-full rounded-2xl" />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <Skeleton className="h-8 w-36" />
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
