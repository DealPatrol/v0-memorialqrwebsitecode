import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import { digitalMemorialJsonLd, digitalMemorialPolicyFaqs } from "@/lib/digital-memorial"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { formatUsd } from "@/lib/site"

export type CremationQrFaq = {
  question: string
  answer: string
}

export type CremationQrId = "cremation" | "urn" | "columbarium" | "ashes"

export type CremationQrPage = {
  id: CremationQrId
  path: string
  title: string
  description: string
  h1: string
  ogTitle: string
  ogSubtitle: string
  paragraphs: string[]
  steps: string[]
  faqs: CremationQrFaq[]
  links: { href: string; label: string }[]
}

const price = formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)
const years = HOSTING_INCLUDED_YEARS

function steps(): string[] {
  return [
    `Pay ${price} once. Put their name on the first line of the order notes. That line becomes the title of the page.`,
    "We email the memorial page link and a PNG of the QR code. Nothing is shipped. We do not sell urns, niches, or flowers.",
    `Print the code or share the link. Add photos and stories when you are ready. Hosting for ${years} years is included, with no monthly fee.`,
  ]
}

export const cremationQrPages: Record<CremationQrId, CremationQrPage> = {
  cremation: {
    id: "cremation",
    path: "/cremation-memorial-qr-code",
    title: "Cremation Memorial QR Code | MemorialsQR",
    description: `A cremation memorial QR code opens one page of photos and stories. ${price} once. Nothing is shipped. ${years} years of hosting are included.`,
    h1: "A cremation memorial QR code",
    ogTitle: "A cremation memorial QR code",
    ogSubtitle: "One page for the photos. A code you can print.",
    paragraphs: [
      "Cremation can leave a family with an urn, a niche, scattered ashes, or some mix of those. None of them have room for the photos and the stories. A QR code opens one memorial page, whether someone is standing with the urn or opening a link at home.",
      "We do not sell urns, niches, or flowers. This order is the memorial page and a QR code we email as a PNG. You can print it for a card, a program, or a frame beside the urn. You can also send the link. A phone camera opens the page. There is no app, and the visitor does not need an account.",
      `The metal QR Memorial Plaque is coming soon. It is not part of this order, and nothing is shipped. You pay ${price} once. Hosting for ${years} years starts on the order date. Put their name on the first line of the order notes. One photograph is enough to begin.`,
    ],
    steps: steps(),
    faqs: [
      {
        question: "Do you sell cremation urns?",
        answer:
          "No. We do not sell urns, niches, or flowers. You receive a memorial page and a QR code by email. Nothing is shipped.",
      },
      {
        question: "Can the code sit with an urn at home?",
        answer:
          "Yes. Print the PNG and set it with the urn, or share the link. The page is on the internet, so people who are not in the room can open it too.",
      },
      {
        question: "Is a metal plaque included with a cremation memorial?",
        answer:
          "No. The metal QR Memorial Plaque is coming soon and is not part of this order. Today you get the page and a QR code file.",
      },
    ],
    links: [
      { href: "/memorial-display-at-home", label: "A memorial display at home" },
    ],
  },
  urn: {
    id: "urn",
    path: "/qr-code-for-urn",
    title: "QR Code for an Urn | MemorialsQR",
    description: `A QR code for an urn opens the memorial page from a phone. ${price} once, with a code you can print. We do not sell urns. Nothing is shipped.`,
    h1: "A QR code for an urn",
    ogTitle: "A QR code for an urn",
    ogSubtitle: "Set a printed code beside the urn you already have.",
    paragraphs: [
      "An urn can sit in a quiet room and still feel too small for a life. A QR code beside it lets someone open photos and stories without asking you to tell them again.",
      "We do not sell urns. We are also not selling a metal plaque to attach to one. What you can order today is a memorial page and a QR code we email as a PNG. Print it and set it next to the urn, or share the link with people who are not in the house.",
      `You do not need every photo on the day you order. Put their name on the first line of the notes. The page is created when you pay, and the code already opens it. Hosting for ${years} years is included in the ${price}. Nothing is billed each month, and nothing is shipped.`,
    ],
    steps: steps(),
    faqs: [
      {
        question: "Do you sell the urn?",
        answer:
          "No. This order is the memorial page and a QR code file. The urn stays one you already have, or one you buy somewhere else.",
      },
      {
        question: "Will the QR code work if the urn stays at home?",
        answer:
          "Yes. A phone camera opens the page from the printed code. Family who are somewhere else can open the same page from the link.",
      },
      {
        question: "Can I attach this order to the urn?",
        answer:
          "You can print the PNG and place it beside the urn. We do not engrave urns, and this order does not include a metal plaque. The metal plaque is coming soon.",
      },
    ],
    links: [
      { href: "/memorial-display-at-home", label: "A memorial display at home" },
    ],
  },
  columbarium: {
    id: "columbarium",
    path: "/qr-code-for-a-columbarium",
    title: "QR Code for a Columbarium | MemorialsQR",
    description: `A QR code for a columbarium opens one memorial page. Order a printable code for ${price}. We do not sell niches. Nothing is shipped.`,
    h1: "A QR code for a columbarium",
    ogTitle: "A QR code for a columbarium",
    ogSubtitle: "The niche is small. The page does not have to be.",
    paragraphs: [
      "A columbarium niche has room for an urn and a name. It does not have room for the trips, the kitchen, or the voice. A QR code can open those without asking the cemetery to rebuild the niche.",
      "We do not sell niches, urns, or columbarium plaques. The metal QR Memorial Plaque is coming soon, and we cannot promise a cemetery will allow anything on the stone. What you can order today is the memorial page and a QR code we email as a PNG. Ask the cemetery before you attach a printed code to a niche they care for. The page works even if the code stays at home.",
      `The same page opens for someone standing at the niche and for someone who could not travel. Put the name on the first line of the notes. You pay ${price} once. Hosting for ${years} years is included. Nothing is shipped.`,
    ],
    steps: steps(),
    faqs: [
      {
        question: "Do you sell columbarium niches?",
        answer: "No. We do not sell niches or urns. You receive a memorial page and a QR code file by email.",
      },
      {
        question: "Will a cemetery let me put a code on the niche?",
        answer:
          "We do not know the rules of a particular cemetery. Ask them before you attach anything. The memorial page works either way.",
      },
      {
        question: "Can family who are not at the niche open the page?",
        answer: "Yes. The QR code and the link open the same page. A visitor does not need an account.",
      },
    ],
    links: [
      { href: "/cemetery-qr-code", label: "A QR code for a cemetery visit" },
    ],
  },
  ashes: {
    id: "ashes",
    path: "/ashes-memorial-qr-code",
    title: "Memorial QR Code for Ashes | MemorialsQR",
    description: `A memorial QR code for ashes opens photos and stories when there is no headstone. ${price} once. Nothing is shipped. Hosting is included.`,
    h1: "A memorial QR code for ashes",
    ogTitle: "A memorial QR code for ashes",
    ogSubtitle: "For ashes kept at home, scattered, or shared.",
    paragraphs: [
      "Some families keep ashes at home. Some scatter them. Some divide them. There may be no headstone and no niche, and still a need for one page the people who loved them can open.",
      "This order is not an urn and not a scattering service. We do not handle ashes. We email a memorial page and a QR code PNG. Print it for a card or a frame, or send the link. A phone camera opens the page. There is no app, and there is no account to create.",
      `The metal plaque is coming soon and is not part of this order. Nothing is shipped. The price is ${price}, paid once, with ${years} years of hosting from the order date. Put their name on the first line of the notes. You can add photos later.`,
    ],
    steps: steps(),
    faqs: [
      {
        question: "Do you scatter ashes or sell urns?",
        answer: "No. We do not handle ashes, and we do not sell urns. You receive a memorial page and a QR code by email.",
      },
      {
        question: "What if there is no grave for the code?",
        answer:
          "The code is a file. Print it, or share the link. People do not need a stone, a niche, or an account to open the page.",
      },
      {
        question: "Does an ashes memorial get mailed?",
        answer: "No. Nothing is shipped. The confirmation email includes the page link and a PNG of the QR code.",
      },
    ],
    links: [
      { href: "/memorial-display-at-home", label: "A memorial corner at home" },
    ],
  },
}

export const cremationQrList = Object.values(cremationQrPages)

export function cremationQrSellingPaths(): string[] {
  return cremationQrList.map((page) => page.path)
}

function policyFaqsForPage(page: CremationQrPage): CremationQrFaq[] {
  const asked = new Set(page.faqs.map((faq) => faq.question))
  return digitalMemorialPolicyFaqs().filter((faq) => !asked.has(faq.question))
}

export function cremationQrJsonLd(page: CremationQrPage) {
  const product = digitalMemorialJsonLd()
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": product["@type"],
        name: product.name,
        description: product.description,
        sku: product.sku,
        image: product.image,
        brand: product.brand,
        offers: product.offers,
      },
      {
        "@type": "FAQPage" as const,
        mainEntity: [...page.faqs, ...policyFaqsForPage(page)].map((faq) => ({
          "@type": "Question" as const,
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer" as const,
            text: faq.answer,
          },
        })),
      },
    ],
  }
}
