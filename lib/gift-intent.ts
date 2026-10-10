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
      "If you want a physical gift from us, it is the QR Memorial Plaque. We do not sell flower arrangements, baskets, or jewelry. The plaque is a one-time purchase, shipping in the United States is included, and the memorial page comes with it.",
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
          "No. The gift you can order here is the QR Memorial Plaque and the memorial page it opens.",
      },
      {
        question: "Does the family have to finish the page before I give it?",
        answer:
          "No. The page is created when the order is paid. They can add photos and stories after the plaque arrives.",
      },
      {
        question: "Can I send the plaque to the family?",
        answer:
          "Yes. At checkout, mark the order as a gift, enter the recipient's name, and use their shipping address if it is different from yours. A short message is saved with the order for the person who packs the plaque. It is not engraved. The name, dates, and finish still go in the memorial notes.",
      },
    ],
    showConcierge: false,
    showGuide: true,
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
      "The keepsake you can buy is the QR Memorial Plaque. Her name goes on the first line of the order notes, then the dates, then gold, silver, or black. The QR code opens the page. We make the plaque in Alabama and ship it in the United States. We do not sell flowers, jewelry, or a headstone.",
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
          "Put her name on the first line, then the dates, then the finish: gold, silver, or black.",
      },
      {
        question: "Is this a headstone?",
        answer:
          "No. It is a metal plaque with her name, the dates, and a QR code. Many families keep it at home. Some set it with a headstone they already have.",
      },
      {
        question: "Can I ship this to her child?",
        answer:
          "Yes. Mark the order as a gift and enter the name of the person who should receive it. If they live somewhere else, use their address. The message you add is stored with the order so we see it when we pack the plaque. It is not engraved. Her name and dates for the metal still go on the first lines of the memorial notes.",
      },
    ],
    showConcierge: false,
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
      "The QR Memorial Plaque is the gift we ship. It carries his name, the dates, and a QR code that opens the page. Hosting is included. Put the name on the first line of the order notes, then the dates and the finish.",
    ],
    faqs: [
      {
        question: "Do I need his whole biography before I order?",
        answer:
          "No. One name and the dates are enough to make the plaque. The page can hold a single story at first.",
      },
      {
        question: "Can the page stay in the family?",
        answer:
          "Yes. You choose what to publish. Visitors need the QR code or the link. They do not need an account to open the page.",
      },
      {
        question: "What arrives in the mail?",
        answer:
          "A metal plaque in the finish you wrote in the notes, with his name, the dates, and a QR code. The memorial page is already online.",
      },
      {
        question: "Can I mail this to his family?",
        answer:
          "Yes. Mark the order as a gift, put the recipient's name in, and give their address when it is not yours. We keep the short message on the order for packing. It is not engraved. His name, the dates, and the finish stay in the memorial notes.",
      },
    ],
    showConcierge: false,
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
      "We are not selling a collar tag online. The gift you can order is the Pet Memorial QR Plaque, and its code opens the pet's page. It can sit with a photograph at home.",
    ],
    faqs: [
      {
        question: "Is this gift for the pet's person, or a tag for the pet?",
        answer:
          "It is for the person who is grieving. We do not sell a collar tag online. The Pet Memorial QR Plaque can sit with a photo, and the QR code opens the pet's memorial page.",
      },
      {
        question: "Can the page be for a dog or a cat?",
        answer:
          "Yes. The page can be for a dog, a cat, or any companion. The Pet Memorial QR Plaque is the keepsake you can order today.",
      },
      {
        question: "Do I need their photos before I order?",
        answer:
          "No. Order the plaque with the pet's name. The page is created then, and photos can be added later.",
      },
      {
        question: "Can I send this to the person who lost their pet?",
        answer:
          "Yes. Mark the checkout as a gift, enter their name, and ship it to their address if they are not at yours. The message is saved for the person who packs the Pet Memorial QR Plaque. It is not engraved. The pet's name and dates for the plaque still go in the memorial notes.",
      },
    ],
    showConcierge: false,
    keepsakeId: PET_KEEPSAKE_ID,
    links: [
      {
        href: "/pet-memorial-qr-code",
        label: "The pet's own memorial QR page",
      },
      {
        href: "/store/pet-memorial-plaque",
        label: "Buy the Pet Memorial QR Plaque",
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
      "A personalized memorial gift has their name on it, not a phrase that could belong to anyone. The plaque uses the name and dates you write in the order notes, and the QR code opens a page that is only theirs.",
      "Personal does not mean you have to fill the page before you give it. You can order the plaque with the name and dates, and the family can add photos and stories after it arrives. The page exists from the day the order is paid.",
      "Choose gold, silver, or black in the notes. We make that plaque in Alabama and ship it in the United States. Hosting for the page is included in the one-time price. There is no monthly fee.",
    ],
    faqs: [
      {
        question: "How is the plaque personalized?",
        answer:
          "Put the name on the first line of the order notes, then the dates, then gold, silver, or black. That is what we put on the plaque.",
      },
      {
        question: "Can I give it before the page is full of photos?",
        answer:
          "Yes. The QR code already opens the page. Photos and stories can be added after you give the plaque.",
      },
      {
        question: "Is there a monthly fee after I buy it?",
        answer:
          "No. The plaque is one payment, and hosting for the memorial page is included. Shipping in the United States is included too.",
      },
      {
        question: "Can the plaque go to someone other than me?",
        answer:
          "Yes. Mark the order as a gift and enter the recipient's name. Use their address when it differs from yours. The message stays with the order for packing and is not the engraving. The engraved name, dates, and finish come from the memorial notes.",
      },
    ],
    showConcierge: false,
  },
  friend: {
    id: "friend",
    path: "/remembrance-gift-for-a-friend",
    h1: "A remembrance gift for a grieving friend",
    ogTitle: "A remembrance gift for a friend",
    ogSubtitle: "Something they can open on a day they want the person near.",
    paragraphs: [
      "When a friend is grieving, the pressure to say the right thing can keep you from saying anything. You do not need a perfect sentence. A gift can be quiet: something they can open later, on a day when they want the person near.",
      "The memorial page does not have to be public, and it does not have to be finished. You can give the plaque with their loved one's name on it, and your friend can add one photo when they are ready. If writing the page is too much, the concierge service is a separate purchase, and nothing is shipped for that service.",
      "Flowers are kind, and they fade. This is a metal plaque and a page. We ship the plaque in the United States. If you are not sure of the dates, ask before you order, and put the name on the first line of the notes.",
    ],
    faqs: [
      {
        question: "What if I do not know the dates?",
        answer:
          "Ask the family before you order. The plaque uses the name and dates from your notes, so those details should be right.",
      },
      {
        question: "Will my friend have to share the page publicly?",
        answer:
          "No. They decide what to add and who can see it. A visitor with the QR code can open the page. They do not need an account.",
      },
      {
        question: "Can you write the page for them?",
        answer:
          "Yes. The concierge service is a separate purchase. We build the memorial page and send the link. Nothing is shipped for that service. The plaque is the gift we make and mail.",
      },
      {
        question: "Can I ship the plaque to my friend?",
        answer:
          "Yes. Mark the order as a gift, enter your friend's name, and use their address if you are not handing it to them yourself. The message is saved with the order for the person who packs it. It is not engraved. If you do not know the dates, ask before you order, and put the name on the first line of the memorial notes.",
      },
    ],
    showConcierge: true,
  },
}

export const giftIntentList = Object.values(giftIntentPages)
