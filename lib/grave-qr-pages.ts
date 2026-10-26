import { DIGITAL_MEMORIAL_PRODUCT, QR_MEMORIAL_PLAQUE_ID } from "@/lib/catalog"
import { digitalMemorialJsonLd, digitalMemorialPolicyFaqs, DIGITAL_MEMORIAL_CHECKOUT_PATH } from "@/lib/digital-memorial"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { formatUsd } from "@/lib/site"

export type GraveQrFaq = {
  question: string
  answer: string
}

export type GraveQrId = "headstone" | "graveMarker" | "cemetery" | "plaque"

export type GraveQrPage = {
  id: GraveQrId
  path: string
  /** Existing guide URL that already ranks for this search. */
  guidePath: string
  guideNote: string
  guideLinkLabel: string
  title: string
  description: string
  h1: string
  ogTitle: string
  ogSubtitle: string
  paragraphs: string[]
  steps: string[]
  faqs: GraveQrFaq[]
  links: { href: string; label: string }[]
}

const price = formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)
const years = HOSTING_INCLUDED_YEARS

/** Checkout for the $24.99 digital memorial. Nothing is shipped. */
export const GRAVE_QR_CHECKOUT_PATH = DIGITAL_MEMORIAL_CHECKOUT_PATH

export const GRAVE_QR_PLAQUE_ID = QR_MEMORIAL_PLAQUE_ID

function orderSteps(placement: string): string[] {
  return [
    `Pay ${price} once. Put their name on the first line of the order notes. That line becomes the title of the page.`,
    "We email the memorial page link and a PNG of the QR code. Nothing is shipped.",
    placement,
    `Add photos and stories when you are ready. Hosting for ${years} years is included, with no monthly fee.`,
  ]
}

export const graveQrPages: Record<GraveQrId, GraveQrPage> = {
  headstone: {
    id: "headstone",
    path: "/headstone-qr-code",
    guidePath: "/qr-code-for-headstone",
    guideLinkLabel: "Print a QR code for a headstone",
    guideNote: `You can order a QR code for a headstone today for ${price}. We email a PNG and a link to the memorial page. Nothing is shipped. You can print the code and, later, place it on a sticker or marker you already have. The metal plaque on this page is still coming soon.`,
    title: "Print a QR Code for a Headstone | MemorialsQR",
    description: `A QR code for a headstone: pay ${price} once and we email a PNG you can print and place later. Nothing is shipped. Metal plaques are not for sale yet.`,
    h1: "A QR code for a headstone you can print",
    ogTitle: "A headstone QR code",
    ogSubtitle: "Print the code now. The plaque can wait.",
    paragraphs: [
      "A headstone usually has room for a name and two dates. A QR code is a way for someone standing there to open photos and stories the stone was never cut to hold. A phone camera opens the page. There is no app to install, and the visitor does not need an account.",
      "What you can buy today is a digital memorial page and a QR code we email as a PNG. Nothing is shipped. You can print the code and, later, place that print on a sticker or marker you already have. We do not engrave the headstone, and we do not attach anything to it. A home print is not a weatherproof marker. Ask the cemetery before you add anything to a stone they care for.",
      `The metal QR Memorial Plaque is a separate item. It is coming soon, and we are not taking plaque orders. You can join the waitlist on this page. Joining does not charge a card and does not include the digital memorial. The digital memorial is ${price}, paid once. Hosting for ${years} years is included. There is no monthly fee. We have not set whether a plaque ordered later uses this same page.`,
    ],
    steps: orderSteps(
      "Print the code when you are ready. You can place that print on a sticker or marker you already have. We do not engrave the headstone, and this order does not include a metal plaque.",
    ),
    faqs: [
      {
        question: "Can I put this QR code on a headstone?",
        answer:
          "You receive a PNG by email. You can print it and place it on a sticker or marker you already have. We do not engrave the stone, and we do not ship a mount. Ask the cemetery before you attach anything. A printed sheet is not a weatherproof marker.",
      },
      {
        question: "Do you sell a metal plaque for the headstone?",
        answer:
          "Not yet. The QR Memorial Plaque is coming soon. Join the waitlist and we will email you once when it can be ordered. The digital memorial is a separate purchase, and nothing is shipped with it. Joining the list does not reserve a plaque.",
      },
      {
        question: "Does a visitor at the grave need an app?",
        answer: "No. A phone camera opens the memorial page from the QR code. The visitor does not need an account.",
      },
    ],
    links: [
      { href: "/qr-code-for-headstone", label: "Guide: a QR code for a headstone" },
      { href: "/printable-memorial-qr-code", label: "A printable memorial QR code" },
    ],
  },
  graveMarker: {
    id: "graveMarker",
    path: "/qr-code-for-grave-marker",
    guidePath: "/grave-marker-qr-code",
    guideLinkLabel: "Print a QR code for a grave marker",
    guideNote: `You can order a QR code for a grave marker today for ${price}. We email a PNG and the memorial page. Nothing is shipped. We do not sell grave markers. The metal plaque on this page is still coming soon.`,
    title: "QR Code for a Grave Marker | MemorialsQR",
    description: `A QR code for a grave marker opens one memorial page. ${price} once, as a PNG. We do not sell markers. Nothing is shipped. Plaques are not for sale yet.`,
    h1: "A QR code for a grave marker you can print",
    ogTitle: "A grave marker QR code",
    ogSubtitle: "The marker stays. The page holds the rest.",
    paragraphs: [
      "A grave marker is often a flat stone set in the ground. It has less room than an upright headstone, and a QR code is one way to open the photos and stories the marker cannot carry.",
      "We do not sell grave markers, bronze plaques, or granite. The order you can place today is the memorial page and a QR code file. We email both after you pay. Nothing is shipped. You can print the code and place it with a marker you already have, if the cemetery allows that. We do not know a particular cemetery's rules, and a paper print is not made for permanent outdoor use.",
      `The price is ${price}, paid once. Hosting for ${years} years starts on the order date. There is no monthly fee. A metal QR Memorial Plaque is coming soon and is not part of this order. The waitlist on this page sends one email when a plaque can be ordered. It does not charge a card.`,
    ],
    steps: orderSteps(
      "Print the code when you are ready. We do not sell the grave marker. You can place the print with a marker you already have, after the cemetery says that is allowed.",
    ),
    faqs: [
      {
        question: "Do you sell the grave marker?",
        answer:
          "No. We sell the digital memorial: a page and a QR code we email as a PNG. The marker, if there is one, is already at the cemetery or is something you arrange with them.",
      },
      {
        question: "How is a grave marker different from a headstone here?",
        answer:
          "A headstone is usually upright. A grave marker is often flat. The digital memorial is the same either way. We do not sell the stone, and we do not engrave it.",
      },
      {
        question: "Can the printed code stay outside on the marker?",
        answer:
          "We do not promise that. This order is a file, not a weatherproof marker and not a metal plaque. Ask the cemetery before you attach anything to a marker they care for.",
      },
    ],
    links: [
      { href: "/grave-marker-qr-code", label: "Guide: a QR code for a grave marker" },
      { href: "/qr-code-for-headstone", label: "Guide: a QR code for a headstone" },
    ],
  },
  cemetery: {
    id: "cemetery",
    path: "/cemetery-memorial-qr-code",
    guidePath: "/cemetery-qr-code",
    guideLinkLabel: "Print a cemetery QR code",
    guideNote: `You can order a cemetery QR code today for ${price}. We email a PNG a phone camera can open. Nothing is shipped. We do not sell plots or stones. The metal plaque is still coming soon.`,
    title: "Cemetery QR Code You Can Print | MemorialsQR",
    description: `A cemetery QR code for visitors: ${price} once. We email a PNG a phone can open. Nothing is shipped. We do not sell plots. Plaques are not for sale yet.`,
    h1: "A cemetery QR code you can print",
    ogTitle: "A cemetery QR code",
    ogSubtitle: "For the visitor who wants more than dates.",
    paragraphs: [
      "A cemetery visit ends at a stone that says very little. A cemetery QR code is for the person who found the grave and wants more than the dates. They point a phone camera at the code. They do not create an account.",
      "You can order that code today as a file, together with the memorial page it opens. We email the link and a PNG. Nothing is mailed. You can print a copy for the person who will visit, or send the link to someone who cannot travel. We do not sell cemetery plots, headstones, or markers, and we do not place anything in the cemetery for you.",
      `The price is ${price}, paid once, with ${years} years of hosting and no monthly fee. If the family later wants a metal plaque at the grave, that plaque is coming soon. Join the waitlist. The list is not an order, and this purchase does not include a plaque.`,
    ],
    steps: orderSteps(
      "Print the code or send the link to someone who will visit. A phone camera opens the page. We do not sell cemetery plots or stones, and we do not install anything at the grave.",
    ),
    faqs: [
      {
        question: "Do I need an app to scan a cemetery QR code?",
        answer: "No. A phone camera opens the memorial page. The visitor does not need an account.",
      },
      {
        question: "Will you place the code at the cemetery?",
        answer:
          "No. We email the QR code and the page link. You print or share them. We do not sell plots or stones, and we do not visit the cemetery.",
      },
      {
        question: "What if the family is not ready to write the stories?",
        answer:
          "A name on the first line of the order notes is enough to title the page. Photos and stories can be added later. The QR code keeps opening that same page.",
      },
    ],
    links: [
      { href: "/cemetery-qr-code", label: "Guide: a cemetery QR code" },
      { href: "/grave-marker-qr-code", label: "Guide: a grave marker QR code" },
    ],
  },
  plaque: {
    id: "plaque",
    path: "/qr-code-memorial-plaque",
    guidePath: "/memorial-qr-code-plaque",
    guideLinkLabel: "Order the QR code memorial plaque page",
    guideNote: `The metal plaque is coming soon. You can order the memorial page a QR code plaque would open, for ${price}, today. We email the QR file. Nothing is shipped, and this order does not include a plaque.`,
    title: "QR Code Memorial Plaque Page | MemorialsQR",
    description: `A QR code memorial plaque is coming soon. Order the page it opens for ${price}. We email the QR file. Nothing is shipped with this order.`,
    h1: "The page a QR code memorial plaque opens",
    ogTitle: "A memorial plaque page",
    ogSubtitle: "Order the page. The metal plaque can wait.",
    paragraphs: [
      "A QR code memorial plaque is a metal piece with a code on it. The code is useful because it opens a page of photos and stories. That page is what you can order today. The metal plaque is not.",
      "After you pay, we email the page link and a PNG of the QR code. Nothing is shipped. You can print the code, share the link, or keep the file until you have a place for it. We do not engrave a plaque in this order, and we do not offer gold, silver, or black finishes here, because we are not making a plaque.",
      `The QR Memorial Plaque is coming soon. Join the waitlist on this page if you want one email when it can be ordered. The digital memorial is a separate purchase at ${price}, once, with ${years} years of hosting included. Joining the list does not reserve a plaque. We have not set whether a plaque ordered later uses the page from this order.`,
    ],
    steps: orderSteps(
      "Print the code if you want a copy now. The metal QR Memorial Plaque is a separate item on the waitlist. This order does not include a plaque, and joining the list does not reserve one.",
    ),
    faqs: [
      {
        question: "Can I order the metal QR code memorial plaque today?",
        answer:
          "No. The QR Memorial Plaque is coming soon. Join the waitlist and we will email you once when it can be ordered. Nothing is charged for joining.",
      },
      {
        question: "What do I get if I buy the digital memorial?",
        answer: `The memorial page and a PNG of the QR code, by email, for ${price}. Nothing is shipped. Hosting for ${years} years is included. The plaque is not included.`,
      },
      {
        question: "If I buy the page now, does that hold a plaque for later?",
        answer:
          "No. The waitlist and the digital memorial are separate. We have not set whether a plaque ordered later uses a page you already bought. Joining the list does not reserve a plaque.",
      },
    ],
    links: [
      { href: "/memorial-qr-code-plaque", label: "Guide: the memorial QR code plaque" },
      { href: "/store/qr-memorial-plaque#waitlist", label: "QR Memorial Plaque waitlist on the product page" },
    ],
  },
}

export const graveQrList = Object.values(graveQrPages)

/** New selling pages, plus the guide URLs that now link to checkout. */
export function graveQrSellingPaths(): string[] {
  return graveQrList.flatMap((page) => [page.path, page.guidePath])
}

function policyFaqs(page: GraveQrPage): GraveQrFaq[] {
  const asked = new Set(page.faqs.map((faq) => faq.question))
  return digitalMemorialPolicyFaqs().filter((faq) => !asked.has(faq.question))
}

export function graveQrJsonLd(page: GraveQrPage) {
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
        mainEntity: [...page.faqs, ...policyFaqs(page)].map((faq) => ({
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
