import type { SellableKeepsake } from "@/lib/fulfillment-availability"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { keepsakeProductJsonLd } from "@/lib/keepsake-jsonld"

export type BuyerIntentFaq = {
  question: string
  answer: string
}

export type BuyerIntentId = "headstone" | "plaque" | "urn" | "pet" | "program" | "digital"

export type BuyerIntent = {
  id: string
  path: string
  h1: string
  ogTitle: string
  ogSubtitle: string
  paragraphs: string[]
  faqs: BuyerIntentFaq[]
  /** Show the concierge purchase beside the plaque. */
  showConcierge: boolean
  /** Show the memorial-page guide form on this page. */
  showGuide?: boolean
}

export const PRIMARY_KEEPSAKE_ID = "qr-memorial-plaque"

export const buyerIntentPages: Record<BuyerIntentId, BuyerIntent> = {
  headstone: {
    id: "headstone",
    path: "/qr-code-for-headstone",
    h1: "A QR code for a headstone",
    ogTitle: "A QR code for a headstone",
    ogSubtitle: "Visitors can open the photos and stories the stone cannot hold.",
    paragraphs: [
      "A name and two dates can hold only so much. When someone stands at the grave, a QR code can open the photos, the voice, and the stories the stone was never meant to carry.",
      "The keepsake you can order today is the QR Memorial Plaque. It is a metal plaque with one QR code, and that code opens one memorial page. Many families set it with a headstone. Others keep it at home. If the plaque will live outdoors, say so in the order notes and we will confirm the finish before we make it.",
      "You do not have to finish the page before the plaque ships. We create the page when you order, and the QR already opens it. Add photos and stories when you are ready.",
    ],
    faqs: [
      {
        question: "Can the plaque go on a headstone?",
        answer:
          "Many families set the QR Memorial Plaque with a headstone or keep it at home. If it will be outdoors, say so in the order notes so we can confirm the finish before we make it. The QR opens the same memorial page either way.",
      },
      {
        question: "Does a visitor need an app?",
        answer:
          "No. A phone camera can open the memorial page from the QR code. The visitor does not need an account.",
      },
      {
        question: "Do I have to write the whole page before I order?",
        answer:
          "No. The page is created with the order, and the QR already opens it. You can add photos and stories later.",
      },
    ],
    showConcierge: false,
  },
  plaque: {
    id: "plaque",
    path: "/memorial-qr-code-plaque",
    h1: "A memorial QR code plaque",
    ogTitle: "A memorial QR code plaque",
    ogSubtitle: "Gold, silver, or black. One QR code. One memorial page.",
    paragraphs: [
      "The plaque is a small metal piece you can hold. Choose gold, silver, or black. The QR code on it opens one memorial page, so a visitor does not need an app or an account to see the photos and stories you choose to share.",
      "Put the name on the first line of the order notes, then the dates, then the finish. We make the plaque in Alabama and ship it to a United States address. The memorial page is theirs from the day you order, even if the photos come later.",
      "This is a one-time purchase. There is no monthly plan behind the plaque. Hosting for the page is included.",
    ],
    faqs: [
      {
        question: "What finishes can I choose?",
        answer:
          "Gold, silver, or black. Write the finish in the order notes, with the name on the first line and the dates after it.",
      },
      {
        question: "What is engraved on the plaque?",
        answer:
          "The name, the dates, and a QR code that opens the memorial page. We take those details from your order notes.",
      },
      {
        question: "When does the memorial page exist?",
        answer:
          "We create the page when the order is paid. The QR code on the plaque already opens it, and you can add photos and stories when you are ready.",
      },
    ],
    showConcierge: false,
  },
  urn: {
    id: "urn",
    path: "/qr-code-for-urn",
    h1: "A QR code for an urn",
    ogTitle: "A QR code for an urn",
    ogSubtitle: "A small plaque beside the urn opens their memorial page.",
    paragraphs: [
      "An urn can sit in a quiet room and still feel too small for a life. A QR code beside it gives people in that room a way to open photos and stories without asking you to tell them again.",
      "We do not sell urns. We sell the QR Memorial Plaque and the memorial page it opens. The plaque can rest next to an urn you already have, or anywhere you keep their memory close. The same page is what the QR opens, whether someone is with you or far away.",
      "When you order, put their name on the first line of the notes. We make the plaque and ship it. You can fill the page slowly. There is no need to have every photo ready on the day you order.",
    ],
    faqs: [
      {
        question: "Do you sell urns?",
        answer:
          "No. We sell the QR Memorial Plaque and the memorial page it opens. The plaque can sit beside an urn you already have.",
      },
      {
        question: "Will the QR code work if the urn stays at home?",
        answer:
          "Yes. The QR code opens the memorial page from a phone camera. The page is on the internet, so family who are not in the room can open it too.",
      },
      {
        question: "What should I put in the order notes?",
        answer:
          "Put the name on the first line, then the dates, then gold, silver, or black. You can add anything else you want us to know.",
      },
    ],
    showConcierge: false,
  },
  pet: {
    id: "pet",
    path: "/pet-memorial-qr-code",
    h1: "A pet memorial QR code",
    ogTitle: "A pet memorial QR code",
    ogSubtitle: "A page for the companion you still look for.",
    paragraphs: [
      "A pet is family. The empty place by the door does not fit on a tag, and a collar in a drawer cannot show the ordinary days you still want to see.",
      "The memorial page can be for a dog, a cat, or any companion. It can hold their name, their photos, and the stories only your household knows. The QR Memorial Plaque is the keepsake you can buy today. Its QR code opens that page.",
      "We are not selling a collar tag online right now. The plaque can sit with their photo, on a shelf, or wherever you keep them near. Hosting for the page is included with the plaque.",
    ],
    faqs: [
      {
        question: "Can the memorial page be for a pet?",
        answer:
          "Yes. The page can be for a dog, a cat, or any companion. The QR Memorial Plaque is the keepsake you can order today, and its QR code opens that page.",
      },
      {
        question: "Do you sell a pet collar tag?",
        answer:
          "Not online right now. The QR Memorial Plaque can sit with their photo or on a shelf, and the QR code opens the pet's memorial page.",
      },
      {
        question: "Who can add photos later?",
        answer:
          "You can add photos and stories after the order. The page is created when you pay, and the QR code already opens it.",
      },
    ],
    showConcierge: false,
  },
  program: {
    id: "program",
    path: "/funeral-program-qr-code",
    h1: "A QR code for a funeral program",
    ogTitle: "A QR code for a funeral program",
    ogSubtitle: "Guests can open the memorial page during the service and after.",
    paragraphs: [
      "A funeral is one afternoon. People want to be there, and they also want a way back to the person after they have gone home.",
      "A QR code on the program can open the memorial page during the service and in the weeks after. Guests do not need an account. They point a phone camera at the code.",
      "We do not print funeral programs. Ordering the QR Memorial Plaque creates the memorial page and the QR code. Your funeral home can place that same code on the program they print. The plaque is what we make and ship to you, so the page has a home after the service too.",
    ],
    faqs: [
      {
        question: "Do you print funeral programs?",
        answer:
          "No. Ordering the QR Memorial Plaque creates the memorial page and the QR code. Your funeral home can place that code on the program they print.",
      },
      {
        question: "Can guests open the page during the service?",
        answer:
          "Yes. A phone camera opens the memorial page from the QR code. Guests do not need an account.",
      },
      {
        question: "What do we receive besides the QR code?",
        answer: `You receive the metal plaque, the memorial page, and ${HOSTING_INCLUDED_YEARS} years of hosting. The QR code on the plaque is the same code that can go on the program.`,
      },
    ],
    showConcierge: false,
  },
  digital: {
    id: "digital",
    path: "/digital-memorial-page",
    h1: "A digital memorial page",
    ogTitle: "A digital memorial page",
    ogSubtitle: "Photos, stories, and messages on one page. Hosting included.",
    paragraphs: [
      "A digital memorial page is one place for the photos, videos, and stories people will ask you for, sometimes years from now. It is not a social feed. It is a page with their name on it.",
      `The page comes with the QR Memorial Plaque. One payment includes ${HOSTING_INCLUDED_YEARS} years of hosting, starting on the order date. Nothing is billed each month. If you would rather have us build the page, the concierge service is a separate purchase through the same Square checkout.`,
      "You can see a finished page before you order. Glenda Jane Kelso's memorial is public. It is the page that started MemorialsQR.",
    ],
    faqs: [
      {
        question: "Is there a monthly fee for the memorial page?",
        answer: `No. The QR Memorial Plaque is a one-time purchase, and it includes ${HOSTING_INCLUDED_YEARS} years of hosting for the memorial page. Nothing is billed each month.`,
      },
      {
        question: "Can you build the page for us?",
        answer:
          "Yes. The concierge service is a separate purchase. We build the memorial page and send you the link. Nothing is shipped for that service.",
      },
      {
        question: "Can I see a memorial page before I buy?",
        answer:
          "Yes. The public memorial page for Glenda Jane Kelso shows what a finished page can hold.",
      },
    ],
    showConcierge: true,
  },
}

export const buyerIntentList = Object.values(buyerIntentPages)

export function buyerIntentJsonLd(page: BuyerIntent, product: SellableKeepsake) {
  const productLd = keepsakeProductJsonLd(product)
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": productLd["@type"],
        name: productLd.name,
        description: productLd.description,
        sku: productLd.sku,
        image: productLd.image,
        brand: productLd.brand,
        offers: productLd.offers,
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  }
}
