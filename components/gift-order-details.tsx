import { giftNoticeLines, readGift, type GiftOrderRecord } from "@/lib/gift-order"

export function GiftOrderDetails({ order }: { order: GiftOrderRecord }) {
  const gift = readGift(order)
  if (!gift.isGift) return null
  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
      <h4 className="mb-1 font-semibold">Gift</h4>
      {giftNoticeLines(order).map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  )
}
