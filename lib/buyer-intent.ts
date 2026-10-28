import { PET_MEMORIAL_PLAQUE_ID, QR_MEMORIAL_PLAQUE_ID } from "@/lib/catalog"
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
  /** Extra internal links that clarify a nearby page. */
  links?: { href: string; label: string }[]
  /** Product shown in the buy box. Defaults to the QR Memorial Plaque. */
  keepsakeId?: string
}

export const PRIMARY_KEEPSAKE_ID = QR_MEMORIAL_PLAQUE_ID
export const PET_KEEPSAKE_ID = PET_MEMORIAL_PLAQUE_ID

export const buyerIntentPages: Record<BuyerIntentId, BuyerIntent> = {
  headstone: {
    id: "headstone",
    path: "/qr-code-for-headstone",
    h1: "A QR code for a headstone",
    ogTitle: "A QR code for a headstone",
    ogSubtitle: "Visitors can open the photos and stories the stone cannot hold.",
    paragraphs: [
      "A name and two dates can hold only so much. When someone stands at the grave, a QR code can open the photos, the voice, and the stories the stone was never meant to carry.",
      "The metal QR Memorial Plaque is coming soon. We are not taking plaque orders, and this page does not ship one. What you can order today is a digital memorial: the page and a QR code we email as a PNG. You can print it and, later, place it on a sticker or marker you already have. We do not engrave the headstone.",
      "You do not have to finish the page before you order. We create the page when you pay, and the QR already opens it. Add photos and stories when you are ready. A printed sheet is not a weatherproof marker. Ask the cemetery before you attach anything to a stone.",
    ],
    faqs: [
      {
        question: "Can the plaque go on a headstone?",
        answer:
          "Not yet. The QR Memorial Plaque is coming soon. Today you can order a QR code file, print it, and place it on a sticker or marker you already have. Ask the cemetery before you attach anything to a stone.",
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
      "A memorial QR code plaque is a small metal piece with a name, dates, and one QR code. Gold, silver, and black are the finishes we expect to offer. We are not making plaques yet, so you cannot choose a finish today.",
      "What you can order today is the memorial page that code would open, and a PNG of the QR code. We email both. Nothing is shipped. A visitor uses a phone camera and does not need an account.",
      "The plaque is coming soon. Join the waitlist on this page. Joining does not charge a card and does not include the digital memorial. When you buy the digital memorial, hosting for the page is included. There is no monthly fee.",
    ],
    faqs: [
      {
        question: "What finishes can I choose?",
        answer:
          "Not yet. Gold, silver, and black are the finishes we expect when a plaque can be ordered. They are not for sale today.",
      },
      {
        question: "What is engraved on the plaque?",
        answer:
          "When a plaque can be ordered, the name, the dates, and a QR code. We are not engraving plaques now. The digital memorial emails you a QR code file instead.",
      },
      {
        question: "When does the memorial page exist?",
        answer:
          "When you order the digital memorial, we create the page and email the QR code. The metal plaque is not part of that order.",
      },
    ],
    showConcierge: false,
  },
  urn: {
    id: "urn",
    // The live page is CremationQrView (lib/cremation-qr-pages.ts). This record stays so the guide index keeps the path and heading.
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
    h1: "A pet QR plaque",
    ogTitle: "A pet QR plaque",
    ogSubtitle: "Coming soon. Not a collar tag.",
    paragraphs: [
      "A pet is family. The empty place by the door does not fit on a tag, and a collar in a drawer cannot show the ordinary days you still want to see.",
      "The memorial page can be for a dog, a cat, or any companion. It can hold their name, their photos, and the stories only your household knows. The Pet Memorial QR Plaque is coming soon and is not for sale yet. Joining the waitlist does not charge a card.",
      "We are not selling a collar tag online. The plaque is metal, the same kind we make for a person, and it can sit with a photo when it can be ordered. What you can order today is the page and a QR code you can print. Nothing is shipped.",
    ],
    faqs: [
      {
        question: "Can the memorial page be for a pet?",
        answer:
          "Yes. The page can be for a dog, a cat, or any companion. The Pet Memorial QR Plaque is coming soon and is not for sale yet. A page and a QR code you can print can be ordered today.",
      },
      {
        question: "Do you sell a pet collar tag?",
        answer:
          "Not online. The Pet Memorial QR Plaque is coming soon. It is not a collar tag, and it is not for sale yet.",
      },
      {
        question: "Who can add photos later?",
        answer:
          "You can add photos and stories after the memorial page is ordered. The QR code already opens that page.",
      },
    ],
    showConcierge: false,
    keepsakeId: PET_KEEPSAKE_ID,
    links: [
      {
        href: "/pet-digital-memorial-qr",
        label: "Pet QR memorial",
      },
      {
        href: "/memorial-gift-loss-of-pet",
        label: "A gift for someone grieving a pet",
      },
      {
        href: "/dog-memorial-qr-code",
        label: "A dog memorial you can order today",
      },
      {
        href: "/cat-memorial-qr-code",
        label: "A cat memorial you can order today",
      },
      {
        href: "/pet-memorial-qr-tag",
        label: "A pet memorial QR tag you can print today",
      },
      {
        href: "/pet-loss-sympathy-gift",
        label: "A pet loss sympathy gift you can send today",
      },
      {
        href: "/store/pet-memorial-plaque#waitlist",
        label: "Pet Memorial QR Plaque waitlist",
      },
    ],
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
    links: [
      {
        href: "/store/qr-memorial-plaque",
        label: "QR Memorial Plaque",
      },
      {
        href: "/store/pet-memorial-plaque",
        label: "Pet Memorial QR Plaque",
      },
    ],
  },
}

export const buyerIntentList = Object.values(buyerIntentPages)

export function buyerIntentJsonLd(page: BuyerIntent, product: SellableKeepsake) {
  const productLd = keepsakeProductJsonLd(product)
  return {
    "@context": "https://schema.org",
    "@graph": [
      // A coming-soon keepsake has no Offer. Only the FAQ is published.
      ...(product.available
        ? [
            {
              "@type": productLd["@type"],
              name: productLd.name,
              description: productLd.description,
              sku: productLd.sku,
              image: productLd.image,
              brand: productLd.brand,
              offers: productLd.offers,
            },
          ]
        : []),
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
