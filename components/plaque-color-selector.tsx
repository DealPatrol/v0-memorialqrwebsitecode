"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import Image from "next/image"

interface PlaqueColorSelectorProps {
  selectedColor: string
  onColorChange: (color: string) => void
}

export function PlaqueColorSelector({ selectedColor, onColorChange }: PlaqueColorSelectorProps) {
  const colorOptions = [
    {
      id: "black",
      name: "Classic Black",
      description: "Elegant black finish",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black-uzcKSInG8bp4K2tta5njv5Mb0s2QMN.jpg",
      popular: true,
    },
    {
      id: "gold",
      name: "Premium Gold",
      description: "Luxurious gold finish",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gold-YKcMRbRzoprn4nOPSLASZgVAG0oK7f.jpg",
      popular: false,
    },
    {
      id: "silver",
      name: "Modern Silver",
      description: "Sleek silver finish",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/silver-5qPRpDXC2vLxCx2OV9fu8LHUeo1y0y.jpg",
      popular: false,
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Your Plaque Color</h3>
        <p className="text-sm text-muted-foreground">Choose the finish that best honors your loved one's memory</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {colorOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onColorChange(option.id)}
            className={`relative group transition-all ${
              selectedColor === option.id
                ? "ring-2 ring-primary ring-offset-2"
                : "ring-1 ring-border hover:ring-muted-foreground/50"
            } rounded-lg overflow-hidden`}
          >
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <Image
                    src={option.image || "/placeholder.svg"}
                    alt={option.name}
                    fill
                    className="object-contain p-2"
                  />
                  {selectedColor === option.id && (
                    <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  {option.popular && (
                    <div className="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                      Popular
                    </div>
                  )}
                </div>
                <div className="p-2 text-center">
                  <h4 className="font-semibold text-xs mb-0.5">{option.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{option.description}</p>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}
