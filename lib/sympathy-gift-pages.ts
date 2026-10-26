import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import { digitalMemorialJsonLd, digitalMemorialPolicyFaqs, DIGITAL_MEMORIAL_CHECKOUT_PATH } from "@/lib/digital-memorial"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { formatUsd } from "@/lib/site"

export type SympathyGiftFaq = {
  question: string
  answer: string
}

export type SympathyGiftId = "mother" | "father" | "pet" | "distance" | "coworker"

export type SympathyGiftPage = {
  id: SympathyGiftId
  path: string
  title: string
  description: string
  h1: string
  ogTitle: string
  ogSubtitle: string
  paragraphs: string[]
  steps: string[]
  faqs: SympathyGiftFaq[]
  links: { href: string; label: string }[]
}

const price = formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)
const years = HOSTING_INCLUDED_YEARS

/** Checkout for the same $24.99 digital memorial, with the gift fields open. */
export const DIGITAL_GIFT_CHECKOUT_PATH = `${DIGITAL_MEMORIAL_CHECKOUT_PATH}&gift=1`

function giftSteps(subject: string): string[] {
  return [
    `Pay ${price} once. On the first line of the order notes, write ${subject}. That line becomes the title of the page.`,
    "Mark the order as a gift. Enter the name and email of the person you are giving it to, and a short note if you want one. Their name is not the title of the page.",
    "We email you the memorial page link and a PNG of the QR code. Nothing is shipped, and we do not email the recipient. Forward the link when you are ready.",
    `They can add photos and stories later. A page with no photo yet shows a soft floral background and initials. Hosting for ${years} years is included, with no monthly fee.`,
  ]
}

export const sympathyGiftPages: Record<SympathyGiftId, SympathyGiftPage> = {
  mother: {
    id: "mother",
    path: "/sympathy-gift-loss-of-mother",
    title: "Sympathy Gift for Loss of Mother | MemorialsQR",
    description: `A sympathy gift after a mother dies: a ${price} digital memorial page and QR code. Nothing is shipped. You forward the link to her family.`,
    h1: "A sympathy gift for the loss of a mother",
    ogTitle: "A gift after losing a mother",
    ogSubtitle: "A page for the stories her children already know.",
    paragraphs: [
      "When someone's mother has died, the help that lands first is usually practical: a meal they do not have to plan, a ride, or one phone call taken off the list. A gift does not replace that. It is something they can open later, when the house is quiet and people have stopped asking what they need.",
      "A digital memorial page gives her children one place for her name, a few photos, and the particular things only they know: how she answered the phone, a recipe nobody wrote down, a sentence one sibling still says. You do not have to collect the photos or write her life. One name is enough to start, and they add the rest when they can.",
      `The page you can buy today is ${price}, paid once. Nothing is mailed, so you do not need a street address. At checkout, put her name on the first line of the order notes. In the gift fields, put the name and email of the person you are giving this to, a son, a daughter, or another relative, and a short note if you want one. We email the link and the QR code to you. You forward them. Hosting for ${years} years is included. A metal plaque is a separate item on the waitlist.`,
    ],
    steps: giftSteps("the mother's name"),
    faqs: [
      {
        question: "Whose name goes in the order notes?",
        answer:
          "The mother's name goes on the first line of the order notes. That line is the title of the page. The gift fields are for the living person you are giving it to: their name, their email, and a short note.",
      },
      {
        question: "Will you email the person who is grieving?",
        answer:
          "No. The confirmation email, with the page link and QR code, goes to the buyer. Forward it when you are ready. The recipient email is saved on the order so you and we know who the gift is for.",
      },
      {
        question: "Do I need her photos before I pay?",
        answer:
          "No. The page can start with her name. Until someone adds a photo, the page shows a soft floral background and her initials. Photos and stories can be added later, and the QR code does not change.",
      },
    ],
    links: [
      { href: "/memorial-gift-loss-of-mother", label: "A metal plaque gift, on the waitlist" },
      { href: "/store/qr-memorial-plaque#waitlist", label: "QR Memorial Plaque waitlist" },
    ],
  },
  father: {
    id: "father",
    path: "/sympathy-gift-loss-of-father",
    title: "Sympathy Gift for Loss of Father | MemorialsQR",
    description: `A sympathy gift after a father dies: a ${price} digital memorial page and QR code. Nothing is shipped. You forward the link to his family.`,
    h1: "A sympathy gift for the loss of a father",
    ogTitle: "A gift after losing a father",
    ogSubtitle: "Room for the ordinary details a family still says.",
    paragraphs: [
      "A father is often the person everyone expected to stay steady. After he dies, people struggle with what to bring his family. Food helps for a few days. What lasts is a place for the ordinary details: a work habit, a joke, a garage, the way he left a note on the counter.",
      "You can give that place without asking anyone to give a speech. Buy the memorial page, put his name on it, and let his children add one story when they are able. Siblings who live in different cities can use the same link. You do not have to know his whole biography, and you do not have to be the person who writes it.",
      `You pay ${price} once. Nothing is shipped. Mark the checkout as a gift and enter the name and email of the person who should receive it, his child, his spouse, or another relative. Add a short note if you have one. We email the page and the QR code to you, and you forward them. We do not email the recipient. Hosting for ${years} years is included. If the family later wants a metal plaque, that item is on a waitlist and is not part of this order.`,
    ],
    steps: giftSteps("the father's name"),
    faqs: [
      {
        question: "What if I am buying this for his child, not for him?",
        answer:
          "That is what the gift fields are for. His name goes on the first line of the order notes, because that titles the page. His child's name and email go in the gift fields, with a short note if you want one.",
      },
      {
        question: "Can more than one child add to the page?",
        answer:
          "Yes. Anyone with the link can be invited to add a photo or a story. They do not need an account to open the page and read it.",
      },
      {
        question: "Do I have to know his dates?",
        answer:
          "No. His name on the first line is enough to title the page. Dates can go on the next line of the notes, or the family can add them later.",
      },
    ],
    links: [
      { href: "/memorial-gift-loss-of-father", label: "A metal plaque gift, on the waitlist" },
      { href: "/store/qr-memorial-plaque#waitlist", label: "QR Memorial Plaque waitlist" },
    ],
  },
  pet: {
    id: "pet",
    path: "/pet-loss-sympathy-gift",
    title: "Pet Loss Sympathy Gift | MemorialsQR",
    description: `A pet loss sympathy gift for the person grieving a dog, cat, or other companion. ${price} once. Nothing is shipped. You forward the link.`,
    h1: "A pet loss sympathy gift",
    ogTitle: "A gift after losing a pet",
    ogSubtitle: "For the person who still comes home to them.",
    paragraphs: [
      "People sometimes treat the death of a pet as a small thing. It is not small to the person who came home to them. A useful sympathy gift takes that seriously: it is for the person who is grieving, and it gives them a page for the dog, the cat, or the other companion they lost.",
      "You do not have to ask them for photos on the day it happens. Order the page with the pet's name. Until a photo is added, the page shows a soft floral background and initials, not a picture of a real animal. They can add the walk, the chair, and one photograph when they want to.",
      `The price is ${price}, paid once. This is not a collar tag, and nothing is shipped, so it works even when you do not know their mailing address. Mark the order as a gift, enter their name and email, and add a short note. We email you the link and the QR code. You forward them. We do not email the recipient. Hosting for ${years} years is included. If they would rather order the pet's page themselves, that is a separate page.`,
    ],
    steps: giftSteps("the pet's name"),
    faqs: [
      {
        question: "Is this a tag for the pet, or a gift for their person?",
        answer:
          "It is a gift for the person who is grieving. The page is about their dog, cat, or other companion. We do not sell a collar tag with this order. Nothing is shipped.",
      },
      {
        question: "What if I only know the pet's name?",
        answer:
          "That is enough. Put the pet's name on the first line of the order notes. Put your friend's name and email in the gift fields. They can add photos later.",
      },
      {
        question: "Will a photo of someone else's pet appear on the page?",
        answer:
          "No. We do not put a stock photo of a real animal on the page. Until the family uploads a photo, the page shows a soft floral background and initials.",
      },
    ],
    links: [
      { href: "/pet-digital-memorial-qr", label: "The pet's own digital memorial, if they order it themselves" },
      { href: "/dog-memorial-qr-code", label: "A dog memorial QR code, if they order it themselves" },
      { href: "/cat-memorial-qr-code", label: "A cat memorial QR code, if they order it themselves" },
      { href: "/pet-memorial-qr-tag", label: "A pet memorial QR tag they can print" },
      { href: "/memorial-gift-loss-of-pet", label: "A pet plaque gift, on the waitlist" },
      { href: "/store/pet-memorial-plaque#waitlist", label: "Pet Memorial QR Plaque waitlist" },
    ],
  },
  distance: {
    id: "distance",
    path: "/long-distance-sympathy-gift",
    title: "Long-Distance Sympathy Gift | MemorialsQR",
    description: `A long-distance sympathy gift when you cannot be there in person. A ${price} digital memorial page. Nothing is shipped. You forward the link.`,
    h1: "A long-distance sympathy gift",
    ogTitle: "A gift from far away",
    ogSubtitle: "No address required. A link they can open.",
    paragraphs: [
      "When you live in another city, you cannot drop off a meal or sit in the kitchen. A phone call still matters. A gift that has to be shipped needs an address you may not have, and it arrives on a day you do not choose. A memorial page does not have that problem. The link travels the same day you forward it.",
      "Buy the page for the person who died, then give the link to the friend or relative who is grieving. They can open it on a phone wherever they are. Other people who could not travel can use the same link to leave a written memory, without calling the closest relative and asking them to tell the story again.",
      `You pay ${price} once. Nothing is shipped, and there is no United States address to enter. Mark the order as a gift. The recipient name and email are the person you are supporting, not the person who died. Put the person who died on the first line of the order notes. We email the page and the QR code to you. Forward them when a call or a note feels right. We do not email the recipient ourselves. Hosting for ${years} years is included.`,
    ],
    steps: giftSteps("the name of the person who died"),
    faqs: [
      {
        question: "Can I send this if I do not have their mailing address?",
        answer:
          "Yes. Nothing is shipped. You need their email only so the order records who the gift is for. We email the page link to you, and you forward it.",
      },
      {
        question: "Does the QR code work in another country?",
        answer:
          "The page is on the internet. A phone camera opens it from the QR code wherever the phone has a connection. You can also send the link with no code at all.",
      },
      {
        question: "Should I send the link the same day?",
        answer:
          "You decide. The page exists as soon as the order is paid. Some people forward it that day. Others wait until the person has had a quieter moment. We do not send it for you.",
      },
    ],
    links: [
      { href: "/memorial-page-for-family-far-away", label: "A memorial page for family who live far apart" },
    ],
  },
  coworker: {
    id: "coworker",
    path: "/coworker-sympathy-gift",
    title: "Coworker Sympathy Gift | MemorialsQR",
    description: `A coworker sympathy gift when a colleague loses someone. A ${price} digital memorial page the office can give. Nothing is shipped.`,
    h1: "A coworker sympathy gift",
    ogTitle: "A gift from coworkers",
    ogSubtitle: "A quiet page, not a collection envelope.",
    paragraphs: [
      "When a coworker loses someone, the office often wants to do more than a card and does not know the family well enough to choose flowers. A group lunch or covering a shift is concrete help for that week. A memorial page is for afterward: one place the colleague can share, or keep private, without telling the story again at their desk.",
      "This gift is usually for the coworker, about the person they lost. Put the person who died on the first line of the order notes. Put the coworker's name and email in the gift fields. If the coworker is the person who died, the gift is for their family, and the family's name goes in the gift fields instead. Either way, you do not need a mailing address, and you do not have to ask them to open it in front of the team.",
      `The price is ${price}, paid once, whether one person buys it or an office pools the cost. One order, one page. Nothing is shipped. Add a short note from the team if you want one. That note is saved on the order. It is not printed on a plaque, and it is not posted on the memorial. We email the link and the QR code to the buyer. The buyer forwards them. We do not email the coworker. Hosting for ${years} years is included.`,
    ],
    steps: giftSteps("the name of the person who died"),
    faqs: [
      {
        question: "Can an office give one page together?",
        answer: `Yes. One person checks out and pays ${price}. The gift fields can name the coworker, and the short note can say it is from the team. Everyone does not need a separate order.`,
      },
      {
        question: "Will the note from the office appear on the memorial?",
        answer:
          "No. The note is stored with the order for the buyer and for support. The memorial page starts from the name in the order notes. The family adds what they want on the page.",
      },
      {
        question: "What if we do not know the person who died very well?",
        answer:
          "Order the page with the name you were given, and leave the stories to the family. You do not have to write a biography to give the page.",
      },
    ],
    links: [
      { href: "/remembrance-gift-for-a-friend", label: "A remembrance gift for a friend, including the plaque waitlist" },
    ],
  },
}

export const sympathyGiftList = Object.values(sympathyGiftPages)

function policyFaqs(page: SympathyGiftPage): SympathyGiftFaq[] {
  const asked = new Set(page.faqs.map((faq) => faq.question))
  return digitalMemorialPolicyFaqs().filter((faq) => !asked.has(faq.question))
}

export function sympathyGiftJsonLd(page: SympathyGiftPage) {
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
