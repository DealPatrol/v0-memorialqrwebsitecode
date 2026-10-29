import type React from "react"
import { PlaqueCostAnswer } from "@/components/plaque-cost-answer"

export default function PetMemorialsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <PlaqueCostAnswer />
    </>
  )
}
