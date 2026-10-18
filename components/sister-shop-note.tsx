import {
  SISTER_SHOP_MEMORIAL_GIFTS_URL,
  SISTER_SHOP_PET_MEMORIAL_GUIDE_URL,
} from "@/lib/sister-shop"

type SisterShopNoteLayout = "band" | "inline"

function SisterShopCopy() {
  return (
    <>
      Looking for a keepsake to go with a pet memorial? Our sister shop, Custom Gifts Online, prints personalized
      pieces with a pet&apos;s photo and name. See their{" "}
      <a href={SISTER_SHOP_PET_MEMORIAL_GUIDE_URL} className="underline">
        pet memorial gifts
      </a>{" "}
      and{" "}
      <a href={SISTER_SHOP_MEMORIAL_GIFTS_URL} className="underline">
        personalized memorial keepsakes
      </a>
      .
    </>
  )
}

export function SisterShopNote({ layout }: { layout: SisterShopNoteLayout }) {
  switch (layout) {
    case "band":
      return (
        <section className="bg-white px-4 py-12" aria-labelledby="sister-shop-keepsakes">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="sister-shop-keepsakes" className="mb-3 text-2xl font-semibold text-foreground">
              A keepsake to go with a pet memorial
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              <SisterShopCopy />
            </p>
          </div>
        </section>
      )
    case "inline":
      return (
        <aside className="rounded-lg border bg-white p-6">
          <h2 className="mb-2 text-xl font-semibold text-foreground">A keepsake to go with the page</h2>
          <p className="leading-relaxed text-muted-foreground">
            <SisterShopCopy />
          </p>
        </aside>
      )
    default: {
      const exhaustive: never = layout
      return exhaustive
    }
  }
}
