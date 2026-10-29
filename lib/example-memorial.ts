import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import { digitalMemorialFaqs } from "@/lib/digital-memorial"
import { SITE_URL } from "@/lib/site"

export const EXAMPLE_MEMORIAL_PATH = "/example-memorial"

/** Made-up name. This is not a customer, a relative, or anyone the site has a memorial for. */
export const EXAMPLE_MEMORIAL_NAME = "Alex Example"

export const EXAMPLE_MEMORIAL_TITLE = "Example Memorial Page | MemorialsQR"

export const EXAMPLE_MEMORIAL_DESCRIPTION = `See an example of the digital memorial page before you pay $${DIGITAL_MEMORIAL_PRODUCT.price.toFixed(2)}. Alex Example is not a real person. Nothing is shipped.`

export const EXAMPLE_MEMORIAL_NOTICE =
  "This is an example page. Alex Example is not a real person, and this is not a real family's memorial."

export const EXAMPLE_MEMORIAL_SETUP =
  "A new order starts with the name from the first line of your order notes. You add the photos and stories after that. The sections below are filled in so you can see where those pieces go."

export const EXAMPLE_BIOGRAPHY =
  "On a page you order, this is a short account of a life, in your words. This paragraph is example text. It does not describe a real person."

export const EXAMPLE_STORY = {
  title: "An example story",
  body: "A story is a memory someone writes on the page. This story is example text so you can see where it sits.",
}

export const EXAMPLE_MESSAGE = {
  author: "Example visitor",
  body: "Messages from family and friends appear in this space. This message is example text.",
}

export const EXAMPLE_PHOTO_LABEL = "A photo you upload appears here."

export function exampleMemorialFaqs(): { question: string; answer: string }[] {
  return [
    {
      question: "Is this a real memorial?",
      answer: EXAMPLE_MEMORIAL_NOTICE,
    },
    ...digitalMemorialFaqs(),
  ]
}

export function exampleMemorialFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage" as const,
    url: `${SITE_URL}${EXAMPLE_MEMORIAL_PATH}`,
    mainEntity: exampleMemorialFaqs().map((faq) => ({
      "@type": "Question" as const,
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: faq.answer,
      },
    })),
  }
}
