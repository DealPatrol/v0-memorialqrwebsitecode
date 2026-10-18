import { Flower2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { MEMORIAL_DEFAULT_BACKGROUND, memorialInitials } from "@/lib/memorial-photos"

type Props = {
  name?: string | null
  /** "avatar" = round profile photo spot, "cover" = card/hero image area */
  variant?: "avatar" | "cover"
  className?: string
}

/**
 * Tasteful placeholder for memorials that don't have a real photo yet:
 * a soft floral sky with an initials monogram. Never shows a person.
 */
export function MemorialPhotoFallback({ name, variant = "avatar", className }: Props) {
  const initials = memorialInitials(name)
  const label = name ? `Photo coming soon for ${name}` : "Photo coming soon"

  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-[#ece6f4] bg-cover bg-center",
        variant === "avatar" ? "rounded-full" : "",
        className,
      )}
      style={{ backgroundImage: `url(${MEMORIAL_DEFAULT_BACKGROUND})` }}
      data-memorial-fallback="true"
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-full border border-white/80 bg-white/55 text-slate-600 shadow-sm backdrop-blur-[2px]",
          variant === "avatar" ? "size-[62%]" : "aspect-square h-[62%] max-h-28",
        )}
      >
        <Flower2 className={cn("text-purple-300", variant === "avatar" ? "mb-1 size-6" : "mb-1 size-5")} aria-hidden />
        {initials ? (
          <span className="font-serif text-3xl font-semibold tracking-wide text-slate-600">{initials}</span>
        ) : null}
      </div>
    </div>
  )
}
