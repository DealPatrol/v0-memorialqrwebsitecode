import { MemorialGuideForm } from "@/components/memorial-guide-form"
import { MEMORIAL_GUIDE_SECTIONS } from "@/lib/memorial-guide"

export function MemorialGuideSection() {
  return (
    <section id="memorial-guide" className="scroll-mt-24 space-y-4 rounded-xl border bg-white p-6">
      <h2 className="text-2xl font-semibold text-foreground">Free guide: how to create a meaningful memorial page</h2>
      <p className="text-muted-foreground">
        You can read it here. If you want a copy in your inbox, leave your email and we will send the same guide. We save
        the address so we can send it again if you ask.
      </p>
      {MEMORIAL_GUIDE_SECTIONS.map((section) => (
        <div key={section.heading}>
          <h3 className="font-semibold text-foreground">{section.heading}</h3>
          <p className="text-muted-foreground">{section.body}</p>
        </div>
      ))}
      <MemorialGuideForm />
    </section>
  )
}
