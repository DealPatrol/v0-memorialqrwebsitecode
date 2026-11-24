import { PET_KEEPSAKE_ID, type BuyerIntent } from "@/lib/buyer-intent"

export type GiftIntentId = "sympathy" | "mother" | "father" | "pet" | "personalized" | "friend"

export const giftIntentPages: Record<GiftIntentId, BuyerIntent> = {
  sympathy: {
    id: "sympathy",
    path: "/sympathy-gift-ideas",
    h1: "Sympathy gift ideas",
    ogTitle: "Sympathy gift ideas",
    ogSubtitle: "A meal, a visit, or a page the family can return to.",
    paragraphs: [
      "The most useful sympathy is often practical. A meal, a ride, or taking one task off a list can matter more than an object. If you bring a gift, choose something the family can use or return to, and do not ask them to perform gratitude.",
      "A memorial page is one way to do that. It gives people a place to leave a story without calling the closest relative and asking them to tell it again. The page can start with a name and grow later, when someone is ready to add a photo.",
      "The gift you can order from us today is a digital memorial page: the page and a QR code we email as a PNG. Nothing is shipped, and hosting is included in the one-time price. The metal QR Memorial Plaque is coming soon and is not for sale yet. We do not sell flower arrangements, baskets, or jewelry.",
    ],
    faqs: [
      {
        question: "What should I give besides a keepsake?",
        answer:
          "Food, a ride, or help with one specific task is often what a family can use that week. A keepsake is for later, when they want a place to put photos and stories.",
      },
      {
        question: "Do you sell flowers or gift baskets?",
        answer:
          "No. The gift you can order here is a digital memorial page and its QR code. The metal QR Memorial Plaque is coming soon and is not for sale yet.",
      },
      {
        question: "Does the family have to finish the page before I give it?",
        answer:
          "No. The page is created when the order is paid. The family can add photos and stories later, whenever they are ready.",
      },
      {
        question: "Can I send it to the family?",
        answer:
          "Yes. The digital memorial page can be given as a gift. Nothing is shipped, so there is no package to address. You can print the QR code and put it in a card, or send the link. The metal plaque is on the waitlist and is not part of that order.",
      },
    ],
    showConcierge: false,
    showGuide: true,
    links: [
      { href: "/sympathy-gift-loss-of-mother", label: "A sympathy gift after a mother dies, sent as a digital page" },
      { href: "/sympathy-gift-loss-of-father", label: "A sympathy gift after a father dies, sent as a digital page" },
      { href: "/pet-loss-sympathy-gift", label: "A pet loss sympathy gift you can send today" },
      { href: "/long-distance-sympathy-gift", label: "A long-distance sympathy gift" },
      { href: "/coworker-sympathy-gift", label: "A coworker sympathy gift" },
    ],
  },
  mother: {
    id: "mother",
    path: "/memorial-gift-loss-of-mother",
    h1: "A memorial gift after losing a mother",
    ogTitle: "A gift after losing a mother",
    ogSubtitle: "A place for the stories only her children know.",
    paragraphs: [
      "After a mother dies, people often do not know what to bring. Food helps for a day. What lasts is a place for the particular things she did: the way she answered the phone, the recipe no one wrote down, the story only one child remembers.",
      "A memorial page can hold those pieces without asking anyone to give a speech. Siblings and grandchildren can add a photo or a few sentences when they are able. Nothing has to be finished on the day you give it.",
      "What you can order today is a digital memorial page for her and a QR code we email as a PNG. Nothing is shipped. Her name goes on the first line of the order notes. The metal QR Memorial Plaque is coming soon and is not for sale yet. We do not sell flowers, jewelry, or a headstone.",
    ],
    faqs: [
      {
        question: "Can more than one child add to the page?",
        answer:
          "Yes. The page is created with the order. Family can add photos and stories later, each in their own time.",
      },
      {
        question: "What do I write in the order notes?",
        answer:
          "Put her name on the first line, then the dates. That is enough to start the page.",
      },
      {
        question: "Is this a headstone?",
        answer:
          "No. It is an online memorial page and a QR code you can print. We do not sell headstones. The metal QR Memorial Plaque is coming soon and is not for sale yet.",
      },
      {
        question: "Can I give this to her child?",
        answer:
          "Yes. The digital memorial page can be given as a gift. Nothing is shipped, so it works wherever they live. Print the QR code for a card, or send the link.",
      },
    ],
    showConcierge: false,
    links: [
      { href: "/sympathy-gift-loss-of-mother", label: "Give a digital memorial page today, with nothing to ship" },
    ],
  },
  father: {
    id: "father",
    path: "/memorial-gift-loss-of-father",
    h1: "A memorial gift after losing a father",
    ogTitle: "A gift after losing a father",
    ogSubtitle: "Room for the ordinary details a family still says.",
    paragraphs: [
      "A father can be the person everyone expected to stay steady. When he is gone, the stories are often in a garage, a joke, a work schedule, or a quiet habit the family has not said out loud.",
      "A useful gift is a page where those details can live, including the ones that are ordinary. You do not have to write his whole life. One true story is enough to start, and other people can add what they knew of him.",
      "What you can order today is a digital memorial page for him and a QR code we email as a PNG. Nothing is shipped, and hosting is included. Put his name on the first line of the order notes, then the dates. The metal QR Memorial Plaque is coming soon and is not for sale yet.",
    ],
    faqs: [
      {
        question: "Do I need his whole biography before I order?",
        answer:
          "No. One name and the dates are enough to start the page. It can hold a single story at first.",
      },
      {
        question: "Can the page stay in the family?",
        answer:
          "Yes. You choose what to publish. Visitors need the QR code or the link. They do not need an account to open the page.",
      },
      {
        question: "Does anything arrive in the mail?",
        answer:
          "No. The digital memorial page is online as soon as the order is paid, and the QR code is emailed as a PNG you can print. Nothing is shipped. The metal plaque is on the waitlist.",
      },
      {
        question: "Can I give this to his family?",
        answer:
          "Yes. The digital memorial page can be given as a gift. Nothing is shipped, so you can send the link or print the QR code for a card, wherever they live.",
      },
    ],
    showConcierge: false,
    links: [
      { href: "/sympathy-gift-loss-of-father", label: "Give a digital memorial page today, with nothing to ship" },
    ],
  },
  pet: {
    id: "pet",
    path: "/memorial-gift-loss-of-pet",
    h1: "A memorial gift after losing a pet",
    ogTitle: "A gift after losing a pet",
    ogSubtitle: "For the person who still comes home to them.",
    paragraphs: [
      "People sometimes treat the death of a pet as a small thing. It is not small to the person who came home to them. A gift that takes the loss seriously is worth more than a card that says you are sorry and then stops.",
      "The memorial page can be for a dog, a cat, or any companion. It can hold a few photos and the ordinary days: the walk, the chair they claimed, the name you still say. The person who is grieving can add those when they want. You do not have to collect the photos yourself.",
      "We are not selling a collar tag online. The Pet Memorial QR Plaque is coming soon and is not for sale yet. The gift you can order today is a digital memorial page. Nothing is shipped.",
    ],
    faqs: [
      {
        question: "Is this gift for the pet's person, or a tag for the pet?",
        answer:
          "It is for the person who is grieving. We do not sell a collar tag online. The Pet Memorial QR Plaque is coming soon and is not for sale yet. A digital memorial page can be ordered today, and nothing is shipped.",
      },
      {
        question: "Can the page be for a dog or a cat?",
        answer:
          "Yes. The page can be for a dog, a cat, or any companion. The Pet Memorial QR Plaque is coming soon and is not for sale yet. A digital memorial page can be ordered today.",
      },
      {
        question: "Do I need their photos before I order?",
        answer:
          "No. The page can start with the pet's name. Photos can be added later. The Pet Memorial QR Plaque is not for sale yet.",
      },
      {
        question: "Can I send this to the person who lost their pet?",
        answer:
          "Yes. The digital memorial can be given as a gift. Nothing is shipped, so there is no street address for a package. The message is not engraved. The Pet Memorial QR Plaque is coming soon and is not part of that order.",
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
        href: "/pet-memorial-qr-code",
        label: "Pet QR plaque",
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
  personalized: {
    id: "personalized",
    path: "/personalized-memorial-gift",
    h1: "A personalized memorial gift",
    ogTitle: "A personalized memorial gift",
    ogSubtitle: "Their name, their dates, and a page that is only theirs.",
    paragraphs: [
      "A personalized memorial gift has their name on it, not a phrase that could belong to anyone. The memorial page uses the name and dates you write in the order notes, and the QR code opens a page that is only theirs.",
      "Personal does not mean you have to fill the page before you give it. You can order with the name and dates, and the family can add photos and stories later. The page exists from the day the order is paid.",
      "What you can order today is the digital memorial page and a QR code we email as a PNG. Nothing is shipped. Hosting for the page is included in the one-time price, and there is no monthly fee. The metal QR Memorial Plaque is coming soon and is not for sale yet.",
    ],
    faqs: [
      {
        question: "How is it personalized?",
        answer:
          "Put the name on the first line of the order notes, then the dates. The page carries their name, and the photos and stories you or the family add.",
      },
      {
        question: "Can I give it before the page is full of photos?",
        answer:
          "Yes. The QR code already opens the page. Photos and stories can be added after you give it.",
      },
      {
        question: "Is there a monthly fee after I buy it?",
        answer:
          "No. The digital memorial page is one payment, and hosting is included. Nothing is shipped.",
      },
      {
        question: "Can I give it to someone else?",
        answer:
          "Yes. The digital memorial page can be given as a gift. Nothing is shipped, so you send the link or a printed QR code yourself. The metal plaque is on the waitlist and is not part of that order.",
      },
    ],
    showConcierge: false,
    links: [
      { href: "/digital-memorial-page-gift", label: "A digital memorial page you can give today" },
    ],
  },
  friend: {
    id: "friend",
    path: "/remembrance-gift-for-a-friend",
    h1: "A remembrance gift for a grieving friend",
    ogTitle: "A remembrance gift for a friend",
    ogSubtitle: "Something they can open on a day they want the person near.",
    paragraphs: [
      "When a friend is grieving, the pressure to say the right thing can keep you from saying anything. You do not need a perfect sentence. A gift can be quiet: something they can open later, on a day when they want the person near.",
      "The memorial page does not have to be public, and it does not have to be finished. You can give the page with their loved one's name on it, and your friend can add one photo when they are ready. If writing the page is too much, the concierge service is a separate purchase, and nothing is shipped for that service.",
      "Flowers are kind, and they fade. What you can order today is the digital memorial page and a QR code we email as a PNG, so nothing is shipped. The metal QR Memorial Plaque is coming soon and is not for sale yet. If you are not sure of the dates, ask before you order, and put the name on the first line of the notes.",
    ],
    faqs: [
      {
        question: "What if I do not know the dates?",
        answer:
          "Ask the family before you order. The page uses the name and dates from your notes, so those details should be right.",
      },
      {
        question: "Will my friend have to share the page publicly?",
        answer:
          "No. They decide what to add and who can see it. A visitor with the QR code can open the page. They do not need an account.",
      },
      {
        question: "Can you write the page for them?",
        answer:
          "Yes. The concierge service is a separate purchase. We build the memorial page and send the link. Nothing is shipped for that service.",
      },
      {
        question: "Can I send it to my friend?",
        answer:
          "Yes. The digital memorial page can be given as a gift. Nothing is shipped, so you can send the link or hand them a printed QR code. If you do not know the dates, ask before you order, and put the name on the first line of the memorial notes.",
      },
    ],
    showConcierge: true,
    links: [
      { href: "/long-distance-sympathy-gift", label: "A sympathy gift you can send from far away" },
      { href: "/coworker-sympathy-gift", label: "A sympathy gift from coworkers" },
    ],
  },
}

export const giftIntentList = Object.values(giftIntentPages)
