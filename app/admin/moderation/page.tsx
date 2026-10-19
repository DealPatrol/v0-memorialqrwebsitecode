import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PendingMediaTab, type PendingItem } from "@/components/dashboard/pending-media-tab"
import { selectPendingMedia } from "@/lib/media/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export const dynamic = "force-dynamic"

/** Every visitor upload waiting for approval, across all memorials (admin layout guards access). */
export default async function AdminModerationPage() {
  const pending = (await selectPendingMedia(null).catch(() => [])) as PendingItem[]
  const ids = [...new Set(pending.map((item) => item.memorial_id))]
  const names = new Map<string, string>()
  if (ids.length > 0) {
    const { data } = await createServiceRoleClient().from("memorials").select("id, full_name").in("id", ids)
    for (const row of data ?? []) names.set(row.id, row.full_name)
  }
  const items = pending.map((item) => ({ ...item, memorial_name: names.get(item.memorial_id) }))

  return (
    <main className="container mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Uploads waiting for approval</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/orders">Orders</Link>
        </Button>
      </div>
      <PendingMediaTab items={items} showMemorial />
    </main>
  )
}
