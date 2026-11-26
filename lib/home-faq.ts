import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"

export type HomeFaq = { question: string; answer: string }

const digitalPrice = `$${DIGITAL_MEMORIAL_PRODUCT.price.toFixed(2)}`

/**
 * Home page FAQ. Shown in the "Common Questions" block and merged into the page's single FAQPage JSON-LD
 * (see PlaqueCostAnswer extraFaqs),
 * so the answers must stay true to the catalog and hosting constants.
 */
export const HOME_FAQS: HomeFaq[] = [
  {
    question: "What is a memorial QR code?",
    answer: `A memorial QR code is a small square code that opens an online memorial page when someone scans it with a phone camera. The page holds photos, videos, and stories about a person or a pet. On MemorialsQR the ${DIGITAL_MEMORIAL_PRODUCT.name} is ${digitalPrice}, paid once, with ${HOSTING_INCLUDED_YEARS} years of hosting included and no subscription.`,
  },
  {
    question: "Can I make a memorial QR code for a pet?",
    answer: `Yes. A pet memorial page works the same way as one for a person: add photos, videos, and stories, then share or print the QR code. The same ${digitalPrice} one-time price and ${HOSTING_INCLUDED_YEARS} years of hosting apply.`,
  },
  {
    question: "How long does a memorial QR code last?",
    answer: `Every keepsake includes ${HOSTING_INCLUDED_YEARS} years of hosting for its memorial page, starting on the order date. There is no subscription.`,
  },
  {
    question: "Can multiple family members contribute to a memorial?",
    answer:
      "Yes! You can invite unlimited family members to add photos, videos, and stories. Everyone with access can contribute their cherished memories.",
  },
  {
    question: `What happens after the ${HOSTING_INCLUDED_YEARS} included years?`,
    answer:
      "We will contact you before the included hosting ends to talk about renewal options. You can download the memorial photos at any time.",
  },
]
