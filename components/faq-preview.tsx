"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const faqs = [
  {
    question: "How long does a memorial QR code last?",
    answer:
      "Our QR codes are designed to last a lifetime. The physical plaques are weather-resistant and UV-protected, while digital memorial pages are hosted indefinitely with our monthly hosting plan.",
  },
  {
    question: "Can multiple family members contribute to a memorial?",
    answer:
      "Yes! You can invite unlimited family members to add photos, videos, and stories. Everyone with access can contribute their cherished memories.",
  },
  {
    question: "What happens if I cancel my hosting subscription?",
    answer:
      "Your memorial page remains accessible for 90 days after cancellation, giving you time to download all content. You can reactivate anytime to restore full access.",
  },
]

export function FAQPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-16 bg-zinc-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-4">Common Questions</h2>
          <p className="text-zinc-400">Quick answers to help you get started</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-medium text-white">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-zinc-400 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                />
              </button>
              {openIndex === index && <div className="px-4 pb-4 text-zinc-400">{faq.answer}</div>}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button asChild variant="outline" className="gap-2 border-zinc-700 bg-transparent">
            <Link href="/faq">
              View All FAQs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
