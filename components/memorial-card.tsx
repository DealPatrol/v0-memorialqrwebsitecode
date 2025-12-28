import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Database } from "@/types/supabase"

type Memorial = Database["public"]["Tables"]["memorials"]["Row"]

interface MemorialCardProps {
  memorial: Memorial
}

export function MemorialCard({ memorial }: MemorialCardProps) {
  const birthYear = memorial.birth_date ? new Date(memorial.birth_date).getFullYear() : null
  const deathYear = memorial.death_date ? new Date(memorial.death_date).getFullYear() : null
  const yearsText = birthYear && deathYear ? `${birthYear} - ${deathYear}` : ""

  return (
    <Card className="overflow-hidden border-rose-200 hover:border-rose-300 transition-colors">
      <div className="relative h-48">
        <div className="absolute inset-0 bg-gradient-to-t from-rose-500/20 to-transparent z-10" />
        <Image
          src={memorial.cover_image_url || "/images/memorial-1.jpg"}
          alt={memorial.name}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader className="border-b border-rose-100">
        <CardTitle className="text-rose-900">{memorial.name}</CardTitle>
        {yearsText && <CardDescription className="text-rose-600 font-medium">{yearsText}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-4">
        <p className="line-clamp-3 text-gray-700">
          {memorial.bio || "A beautiful memorial celebrating the life and legacy of a loved one."}
        </p>
      </CardContent>
      <CardFooter className="bg-rose-50">
        <Link href={`/memorial/${memorial.id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full border-rose-300 text-rose-700 hover:bg-rose-100 hover:text-rose-800"
          >
            View Memorial
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
