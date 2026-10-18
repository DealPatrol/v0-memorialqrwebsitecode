import Link from "next/link"
import { digitalMemorialPolicyFaqs } from "@/lib/digital-memorial"

/** Delivery, editing, and refund facts, using the same answers as the FAQ schema. */
export function DigitalMemorialTrust() {
  const faqs = digitalMemorialPolicyFaqs()

  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <div key={faq.question}>
          <h3 className="text-sm font-semibold text-foreground">{faq.question}</h3>
          <p className="text-sm text-muted-foreground">{faq.answer}</p>
        </div>
      ))}
      <p className="text-sm text-muted-foreground">
        <Link href="/terms-of-service" className="underline">
          Terms of service
        </Link>
      </p>
    </div>
  )
}
