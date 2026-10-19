import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import { digitalMemorialJsonLd, digitalMemorialPolicyFaqs } from "@/lib/digital-memorial"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { formatUsd } from "@/lib/site"

export type DigitalLandingFaq = {
  question: string
  answer: string
}

export type DigitalLandingId =
  | "onlineQr"
  | "pageGift"
  | "sympathy"
  | "createOnline"
  | "pet"
  | "printable"

export type DigitalLandingPage = {
  id: DigitalLandingId
  path: string
  title: string
  description: string
  h1: string
  ogTitle: string
  ogSubtitle: string
  paragraphs: string[]
  steps: string[]
  faqs: DigitalLandingFaq[]
}

const price = formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)
const years = HOSTING_INCLUDED_YEARS

function steps(): string[] {
  return [
    `Pay ${price} once. Put their name on the first line of the order notes. That line becomes the title of the page.`,
    "We email the memorial page link and a PNG of the QR code. Nothing is shipped.",
    `Print the code or share the link. Add photos and stories when you are ready. Hosting for ${years} years is included, with no monthly fee.`,
  ]
}

export const digitalLandingPages: Record<DigitalLandingId, DigitalLandingPage> = {
  onlineQr: {
    id: "onlineQr",
    path: "/online-memorial-with-qr-code",
    title: "Online Memorial with QR Code | MemorialsQR",
    description: `An online memorial with a QR code you can print or share. ${price} once. Nothing is shipped, and ${years} years of hosting are included.`,
    h1: "An online memorial with a QR code",
    ogTitle: "An online memorial with a QR code",
    ogSubtitle: "One page. One code you can print or share.",
    paragraphs: [
      "An online memorial is a single page for a name, photos, and the stories people still tell. A QR code is how someone opens that page from a phone. They do not need an app, and they do not need an account.",
      "You can print the code for a program, a card, or a frame at home. You can also send the link. The page and the code are the same memorial. Nothing is mailed.",
      `The price is ${price}, paid once. Hosting for ${years} years starts on the order date. There is no monthly fee. You add the photos and stories yourself. This order is not a metal plaque, and we do not sell flowers, urns, or jewelry.`,
    ],
    steps: steps(),
    faqs: [
      {
        question: "What do I get with an online memorial and a QR code?",
        answer: `An online memorial page and a QR code you can print or share. The confirmation email includes the page link and a PNG of the code. Nothing is mailed. Hosting for ${years} years starts on the order date.`,
      },
      {
        question: "Does a visitor need an app?",
        answer: "No. A phone camera opens the memorial page from the QR code. The visitor does not need an account.",
      },
      {
        question: "Is a metal plaque included?",
        answer:
          "No. This purchase is the page and the QR code only. Nothing is shipped. A metal plaque is a different item, and it is not part of this order.",
      },
    ],
  },
  pageGift: {
    id: "pageGift",
    path: "/digital-memorial-page-gift",
    title: "Digital Memorial Page Gift | MemorialsQR",
    description: `Give a digital memorial page and a QR code the family can print or share. ${price} once. Nothing is shipped.`,
    h1: "A digital memorial page as a gift",
    ogTitle: "A digital memorial page gift",
    ogSubtitle: "You buy the page. They open it when they are ready.",
    paragraphs: [
      "A digital memorial page can be a gift when you do not know what else to offer. It is not flowers, and it does not have to arrive on a certain day. It is a page for photos and stories, and a QR code the family can print or send on.",
      "You pay once. We email you the page link and the QR code. You can forward that email, or print the code and give it in person. The family adds what they want, when they are able. You do not have to write a whole life for them.",
      `The price is ${price}. Nothing is shipped, so there is no address to confirm and no package to wait on. Hosting for ${years} years is included. If you would rather have us write the page, the concierge service is a separate purchase.`,
    ],
    steps: steps(),
    faqs: [
      {
        question: "Can you mail this gift to the family?",
        answer:
          "No. Nothing is shipped. You receive the page link and a QR code by email, and you share those with the family.",
      },
      {
        question: "Do I have to finish the page before I give it?",
        answer:
          "No. A name on the first line of the order notes is enough to title the page. Photos and stories can be added later.",
      },
      {
        question: "Do you include flowers or jewelry?",
        answer: "No. We do not sell flowers, urns, or jewelry. This gift is the memorial page and the QR code.",
      },
    ],
  },
  sympathy: {
    id: "sympathy",
    path: "/sympathy-memorial-qr-code",
    title: "Sympathy Memorial QR Code | MemorialsQR",
    description: `A sympathy memorial QR code opens one page of photos and stories. ${price} once. Nothing is shipped. Hosting is included.`,
    h1: "A sympathy memorial QR code",
    ogTitle: "A sympathy memorial QR code",
    ogSubtitle: "A quiet place for the stories, when words are hard.",
    paragraphs: [
      "The help that matters first is often practical: a meal, a ride, or one task taken off a list. A memorial page is for later, when people want the photos and stories without asking the closest relative to tell them again.",
      "The QR code in this order is a file, not a piece of metal. We email it to you. A funeral home can place that code on a program they already print, or the family can share the link. We do not print programs.",
      `You pay ${price} once. Nothing is shipped. Hosting for ${years} years is included, with no monthly fee. Put the person's name on the first line of the order notes.`,
    ],
    steps: steps(),
    faqs: [
      {
        question: "Is a QR code a fitting sympathy gift?",
        answer:
          "It can be, when the family wants one page for photos and stories. Food and practical help still matter that week. The page can stay nearly empty until someone is ready to add to it.",
      },
      {
        question: "Do you print funeral programs?",
        answer: "No. We email the QR code. A funeral home can put that code on a program they print.",
      },
      {
        question: "What arrives for the family?",
        answer:
          "You receive the page link and the QR code by email, and you share them. Nothing is mailed. They do not need an account to open the page.",
      },
    ],
  },
  createOnline: {
    id: "createOnline",
    path: "/create-memorial-qr-code-online",
    title: "Create Memorial QR Code Online | MemorialsQR",
    description: `Create a memorial QR code online, and the page it opens. ${price} once. Nothing is shipped. ${years} years of hosting included.`,
    h1: "Create a memorial QR code online",
    ogTitle: "Create a memorial QR code online",
    ogSubtitle: "Pay once. The code and the page arrive by email.",
    paragraphs: [
      "You can create a memorial QR code online without designing the code yourself. Checkout creates the memorial page, and the QR code already opens that page.",
      "After you pay, the confirmation email includes the page link and a PNG of the QR code. Print it at home, add it to a card, or send the file. Visitors use a phone camera. There is no app to install.",
      `The price is ${price}, paid once. Nothing is shipped. Hosting for ${years} years starts on the order date. You add photos, video, and stories when you are ready. If the notes are blank, the page title is In Loving Memory until you add a name.`,
    ],
    steps: steps(),
    faqs: [
      {
        question: "How do I create the QR code?",
        answer:
          "Order the digital memorial and put their name on the first line of the notes. We create the page and email the QR code. You do not install software.",
      },
      {
        question: "Can I update the page after the code is made?",
        answer: "Yes. The code keeps opening the same page. Add photos and stories later, and the code does not change.",
      },
      {
        question: "Is there a monthly fee?",
        answer: `No. ${price} is paid once and includes ${years} years of hosting. Nothing is billed each month.`,
      },
    ],
  },
  pet: {
    id: "pet",
    path: "/pet-digital-memorial-qr",
    title: "Pet Digital Memorial QR Code | MemorialsQR",
    description: `A pet digital memorial QR code for a dog, cat, or other companion. ${price} once. Nothing is shipped. Hosting is included.`,
    h1: "A pet digital memorial QR code",
    ogTitle: "A pet digital memorial QR code",
    ogSubtitle: "Their name, their photos, and a code you can print.",
    paragraphs: [
      "A pet is part of the house. A collar in a drawer cannot show the ordinary days, and a tag was never meant to hold a life. A memorial page can, for a dog, a cat, or any companion.",
      "This order is the page and a QR code you can print or share. It is not a collar tag, and it is not a metal plaque. Nothing is shipped. You can set a printed copy with their photo at home.",
      `The price is ${price}, paid once. Hosting for ${years} years is included. Put their name on the first line of the order notes. One photo is enough to start. There is no monthly fee.`,
    ],
    steps: steps(),
    faqs: [
      {
        question: "Can the memorial page be for a pet?",
        answer: "Yes. The page can be for a dog, a cat, or any companion. The QR code opens that page.",
      },
      {
        question: "Do you sell a collar tag with this order?",
        answer: "No. You receive a QR code to print or share, and the memorial page it opens. Nothing is shipped.",
      },
      {
        question: "Who can see the page?",
        answer:
          "Anyone with the QR code or the link can open it. They do not need an account. You choose what to put on the page.",
      },
    ],
  },
  printable: {
    id: "printable",
    path: "/printable-memorial-qr-code",
    title: "Printable Memorial QR Code | MemorialsQR",
    description: `A printable memorial QR code is emailed as a PNG with the page it opens. ${price} once. Nothing is shipped.`,
    h1: "A printable memorial QR code",
    ogTitle: "A printable memorial QR code",
    ogSubtitle: "The file comes by email. You print it when you want.",
    paragraphs: [
      "A printable memorial QR code is a file, not a package. After you order, we email a PNG of the code and a link to the memorial page. You print it on a card, a program, or paper you already have.",
      "The code opens one page of photos, stories, and messages. Visitors use a phone camera. They do not need an app or an account. You can share the same link with people who are not in the room.",
      `You pay ${price} once. Nothing is shipped. Hosting for ${years} years is included from the order date. This is not a metal plaque. We do not sell flowers, urns, or jewelry.`,
    ],
    steps: steps(),
    faqs: [
      {
        question: "What file do I receive?",
        answer: "A PNG of the QR code, in the confirmation email, together with the link to the memorial page.",
      },
      {
        question: "Can I print more than one copy?",
        answer: "Yes. The PNG is yours to print or share. Each copy opens the same memorial page.",
      },
      {
        question: "Does anything arrive in the mail?",
        answer: "No. Nothing is shipped. You print the code yourself, or you send the file.",
      },
    ],
  },
}

export const digitalLandingList = Object.values(digitalLandingPages)

/** Policy answers that are not already one of this landing page's own questions. */
function policyFaqsForLanding(page: DigitalLandingPage): DigitalLandingFaq[] {
  const asked = new Set(page.faqs.map((faq) => faq.question))
  return digitalMemorialPolicyFaqs().filter((faq) => !asked.has(faq.question))
}

export function digitalLandingJsonLd(page: DigitalLandingPage) {
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
        mainEntity: [...page.faqs, ...policyFaqsForLanding(page)].map((faq) => ({
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
