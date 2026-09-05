import Image from "next/image"
import Link from "next/link"
import { Check, Mic, ShoppingCart } from "lucide-react"
import { VOICE_KEYCHAIN_PRODUCT } from "@/lib/store-products"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function VoiceKeychainProduct() {
  const product = VOICE_KEYCHAIN_PRODUCT

  return (
    <Card className="mx-auto max-w-4xl overflow-hidden border-purple-300 bg-zinc-950 text-white shadow-2xl">
      <CardContent className="grid gap-8 p-6 md:grid-cols-2 md:p-10">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-white">
          <Image src={product.image} alt={product.name} fill className="object-cover" priority />
        </div>
        <div className="flex flex-col justify-center">
          <div className="mb-4 flex items-center gap-2 text-purple-300">
            <Mic className="h-5 w-5" />
            <span className="font-semibold">A voice you can visit anytime</span>
          </div>
          <h2 className="mb-3 text-3xl font-bold">{product.name}</h2>
          <p className="mb-6 text-zinc-300">{product.description}</p>
          <ul className="mb-6 space-y-3">
            {product.features.map((feature) => (
              <li key={feature} className="flex gap-2 text-sm text-zinc-200">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                {feature}
              </li>
            ))}
          </ul>
          <p className="text-3xl font-bold">${product.price.toFixed(2)} CAD</p>
          <p className="mb-6 text-sm text-zinc-400">plus $4.99/month per memorial for hosting</p>
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
            <Link href={`/checkout/simple?product=${product.id}`}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Buy Voice Keychain
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
