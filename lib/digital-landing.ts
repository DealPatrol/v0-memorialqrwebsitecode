import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import { digitalMemorialJsonLd, digitalMemorialPolicyFaqs } from "@/lib/digital-memorial"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { omitSchemaContext } from "@/lib/schema-node"
import { formatUsd, SITE_URL } from "@/lib/site"

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
  | "dog"
  | "cat"
  | "tag"
  | "printable"

export type DigitalLandingLink = {
  href: string
  label: string
}

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
  /** Pages that are not other digital landings, such as a gift page or a waitlist. */
  links?: DigitalLandingLink[]
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
    links: [
      { href: "/pet-loss-sympathy-gift", label: "A pet loss sympathy gift, if you are buying for someone else" },
      { href: "/store/pet-memorial-plaque#waitlist", label: "Pet Memorial QR Plaque waitlist" },
    ],
  },
  dog: {
    id: "dog",
    path: "/dog-memorial-qr-code",
    title: "Dog Memorial QR Code | MemorialsQR",
    description: `A dog memorial QR code for photos from the walks and the couch. ${price} once. Nothing is shipped.`,
    h1: "A dog memorial QR code",
    ogTitle: "A dog memorial QR code",
    ogSubtitle: "The walk, the door, and the photos a tag cannot hold.",
    paragraphs: [
      "A dog leaves a route through the house. You still look at the door at the hour of the walk. A memorial page is one place for that dog's name, the photos, and the ordinary days a collar in a drawer cannot show.",
      "This order is the page and a QR code you can print or share. It is not a collar tag, and it is not a metal plaque. After you pay, we email the page link and a PNG of the code. Print it and set it with a photograph, or send the link to the people who knew the dog. A phone camera opens the page. Nobody needs an app.",
      `The price is ${price}, paid once. Nothing is shipped. Hosting for ${years} years is included, with no monthly fee. Put the dog's name on the first line of the order notes. One photo is enough to start. Until a photo is added, the page shows a soft floral background and initials, not a picture of a real dog.`,
    ],
    steps: steps(),
    faqs: [
      {
        question: "Can the page be for one dog?",
        answer:
          "Yes. Put that dog's name on the first line of the order notes. That line titles the page, and the QR code opens it.",
      },
      {
        question: "Do you mail a dog tag with this order?",
        answer:
          "No. Nothing is shipped. You receive a QR code to print or share, and the memorial page it opens. A metal plaque is a separate item.",
      },
      {
        question: "What if another pet shared the house?",
        answer:
          "The page is for the name on the first line. You can mention the other pet in a story. A second companion can have a separate page.",
      },
    ],
    links: [
      { href: "/pet-loss-sympathy-gift", label: "A gift for someone who lost a dog" },
      { href: "/store/pet-memorial-plaque#waitlist", label: "Pet Memorial QR Plaque waitlist" },
    ],
  },
  cat: {
    id: "cat",
    path: "/cat-memorial-qr-code",
    title: "Cat Memorial QR Code | MemorialsQR",
    description: `A cat memorial QR code for the windowsill, the lap, and the name. ${price} once. Nothing is shipped.`,
    h1: "A cat memorial QR code",
    ogTitle: "A cat memorial QR code",
    ogSubtitle: "A page for the habits only that household knew.",
    paragraphs: [
      "A cat keeps a map of the house that nobody else uses: a windowsill, a lap, the hour they expected food. A memorial page can hold the name, the photos, and those particular habits. It does not have to look like a tribute written for a person.",
      "This order is the page and a QR code. It is not a collar tag, and nothing is shipped. We email you the link and a PNG. People who only knew the cat from photographs can open the same page. A visitor uses a phone camera and does not need an account.",
      `You pay ${price} once. Hosting for ${years} years is included. Put the cat's name on the first line of the order notes. Dates can go on the next line, or you can add them later. A metal plaque is a different item and is not included.`,
    ],
    steps: steps(),
    faqs: [
      {
        question: "Does this work for an indoor cat?",
        answer:
          "Yes. The page is on the internet. Family who never visited the house can open the link, and a printed QR code opens the same page.",
      },
      {
        question: "Do you sell a cat collar tag?",
        answer: "No. This order is the memorial page and a QR code you print or share. Nothing is shipped.",
      },
      {
        question: "Can I start with the cat's name only?",
        answer:
          "Yes. The name on the first line titles the page. Until you add a photo, the page shows a soft floral background and initials, not a stock photo of a cat.",
      },
    ],
    links: [
      { href: "/pet-loss-sympathy-gift", label: "A gift for someone who lost a cat" },
      { href: "/store/pet-memorial-plaque#waitlist", label: "Pet Memorial QR Plaque waitlist" },
    ],
  },
  tag: {
    id: "tag",
    path: "/pet-memorial-qr-tag",
    title: "Pet Memorial QR Tag | MemorialsQR",
    description: `A pet memorial QR tag you can print, plus the page it opens. ${price} once. It is not a collar tag.`,
    h1: "A pet memorial QR tag",
    ogTitle: "A pet memorial QR tag",
    ogSubtitle: "A code you can print. Not a collar tag in the mail.",
    paragraphs: [
      "A pet memorial QR tag is what people look for when they want one small thing that opens the pet's page. What you can order today is that page and a QR code file. It is not a metal collar tag. Nothing is shipped, so there is no tag to put on a collar.",
      "You can print the code on a card, slide it into a frame beside a photograph, or send the file. Each copy opens the same page. A phone camera is enough. You do not install an app, and a visitor does not need an account.",
      `The price is ${price}, paid once. Hosting for ${years} years is included, with no monthly fee. Put the pet's name on the first line of the order notes. This works for a dog, a cat, or another companion. If you want a metal plaque to sit with a photo, that item is on a waitlist and is a separate purchase.`,
    ],
    steps: steps(),
    faqs: [
      {
        question: "Is a collar tag included?",
        answer:
          "No. We do not sell a collar tag with this order. You get a QR code to print or share, and the memorial page it opens. Nothing is mailed.",
      },
      {
        question: "Can I print the code more than once?",
        answer:
          "Yes. The PNG in the confirmation email is yours to print. Every copy opens the same page, and the code does not change when you add photos later.",
      },
      {
        question: "Will the page show a photo of a pet I do not know?",
        answer:
          "No. We do not put a stock photo of a real animal on the page. Until you upload a photo, the page shows a soft floral background and initials.",
      },
    ],
    links: [
      { href: "/pet-loss-sympathy-gift", label: "A pet loss sympathy gift for the person who is grieving" },
      { href: "/store/pet-memorial-plaque#waitlist", label: "Pet Memorial QR Plaque waitlist" },
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
  return {
    "@context": "https://schema.org",
    "@graph": [
      omitSchemaContext(digitalMemorialJsonLd()),
      {
        "@type": "FAQPage" as const,
        url: `${SITE_URL}${page.path}`,
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
