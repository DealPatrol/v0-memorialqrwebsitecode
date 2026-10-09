import type { BuyerIntent } from "@/lib/buyer-intent"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"

export type LongTailPage = BuyerIntent & {
  title: string
  description: string
}

const years = HOSTING_INCLUDED_YEARS

export const longTailPages = {
  graveMarker: {
    id: "graveMarker",
    path: "/grave-marker-qr-code",
    title: "Grave Marker QR Code | MemorialsQR",
    description:
      "A flat grave marker can carry a QR code for the photos and stories the marker cannot. The plaque is $29.99, with hosting included.",
    h1: "A QR code for a grave marker",
    ogTitle: "A QR code for a grave marker",
    ogSubtitle: "The marker holds the name. The page holds the rest.",
    paragraphs: [
      "A grave marker is often a flat stone set into the ground. It has room for a name and dates, and not much else. A QR code is a way to add the photos and stories without replacing the marker.",
      "This is different from a QR code cut for an upright headstone. Here the question is the marker itself: a bronze or granite plaque the cemetery already set, or one the family is choosing. We do not sell grave markers. We sell the QR Memorial Plaque, a small metal piece with one QR code. Families set it with a marker or keep it at home. If it will be outdoors, say so in the order notes and we will confirm the finish before we make it.",
      `The QR opens one memorial page. You do not need an app. Put the name on the first line of the notes, then the dates, then gold, silver, or black. Hosting for ${years} years is included. Nothing is billed each month.`,
    ],
    faqs: [
      {
        question: "Do you sell the grave marker?",
        answer:
          "No. We sell the QR Memorial Plaque and the memorial page it opens. The plaque can sit with a marker you already have, or at home.",
      },
      {
        question: "How is this different from a headstone QR code?",
        answer:
          "A headstone is usually upright. A grave marker is often flat in the ground. The keepsake is the same plaque either way. The page it opens is the same page.",
      },
      {
        question: "Can the plaque stay outside?",
        answer:
          "If the plaque will be outdoors, write that in the order notes. We will confirm the finish before we make it. We do not promise that every finish is for permanent outdoor use.",
      },
    ],
    showConcierge: false,
    links: [
      { href: "/qr-code-for-headstone", label: "A QR code for a headstone" },
      { href: "/cemetery-qr-code", label: "A QR code for a cemetery visit" },
    ],
  },
  photoVideo: {
    id: "photoVideo",
    path: "/memorial-plaque-with-photo-and-video",
    title: "Memorial Plaque With Photos | MemorialsQR",
    description:
      "The metal plaque carries a QR code. Photos and video live on the memorial page it opens, not printed on the metal. $29.99, hosting included.",
    h1: "A memorial plaque with photo and video",
    ogTitle: "A plaque that opens photo and video",
    ogSubtitle: "The metal holds a QR code. The page holds the pictures.",
    paragraphs: [
      "People search for a memorial plaque with a photograph on it. The plaque we make is metal, with a name, dates, and a QR code. The photograph is not printed on the metal. The QR code opens a memorial page, and that page is where the photos and video live.",
      "A short video of their voice, a kitchen, a porch, a dog in their lap: those belong on the page, where a visitor can play them. The plaque is the object you can hold and the code a visitor can scan. One page, one code.",
      `You can order before the videos are chosen. We create the page when the order is paid, and the QR already opens it. Add the photos when you are ready. Hosting for ${years} years is included in the plaque price.`,
    ],
    faqs: [
      {
        question: "Is the photo printed on the plaque?",
        answer:
          "No. The plaque is metal with a name, dates, and a QR code. Photos and video are on the memorial page the code opens.",
      },
      {
        question: "Can the page include a video?",
        answer:
          "Yes. The memorial page can hold photos and video. The plaque itself stays a metal piece with a QR code.",
      },
      {
        question: "Do I need the photos before I order?",
        answer:
          "No. The page is created with the order. You can add photos and video later, and the QR code already opens the page.",
      },
    ],
    showConcierge: false,
    links: [
      { href: "/digital-memorial-page", label: "What the digital memorial page holds" },
      { href: "/memorial-qr-code-plaque", label: "The memorial QR code plaque" },
    ],
  },
  celebration: {
    id: "celebration",
    path: "/celebration-of-life-keepsake",
    title: "Celebration of Life Keepsake | MemorialsQR",
    description:
      "After a celebration of life, a QR plaque opens the photos and stories guests want to see again. $29.99 once, with hosting included.",
    h1: "Celebration of life keepsake ideas",
    ogTitle: "A keepsake after a celebration of life",
    ogSubtitle: "Guests go home. The page stays open.",
    paragraphs: [
      "A celebration of life is one gathering. People hug, they eat, they tell one story, and then they drive home. A keepsake is what is still there the next week, when someone wants the song or the photograph again.",
      "One keepsake you can order is the QR Memorial Plaque. It is not a printed program and it is not flowers. The QR code opens a memorial page of photos and stories. Your funeral home can also place that same code on a program they print. We do not print programs.",
      `Give the plaque to the person who will keep the page, or set it out where guests can scan it. The page does not have to be finished before the gathering. Hosting for ${years} years is included. There is no monthly fee.`,
    ],
    faqs: [
      {
        question: "Do you print celebration of life programs?",
        answer:
          "No. We make the QR Memorial Plaque and the memorial page. A funeral home can put the same QR code on a program they print.",
      },
      {
        question: "Can guests open the page at the gathering?",
        answer:
          "Yes. A phone camera opens the page from the QR code. Guests do not need an account.",
      },
      {
        question: "What if the stories are not written yet?",
        answer:
          "Order the plaque with the name and dates. The page exists that day, and people can add stories after the gathering.",
      },
    ],
    showConcierge: false,
    links: [
      { href: "/funeral-program-qr-code", label: "A QR code for a funeral program" },
      { href: "/sympathy-gift-ideas", label: "Sympathy gift ideas" },
    ],
  },
  columbarium: {
    id: "columbarium",
    path: "/qr-code-for-a-columbarium",
    title: "QR Code for a Columbarium | MemorialsQR",
    description:
      "A QR code near a columbarium niche opens one memorial page. We do not sell niches. The plaque is $29.99, with hosting included.",
    h1: "A QR code for a columbarium",
    ogTitle: "A QR code for a columbarium",
    ogSubtitle: "The niche is small. The page does not have to be.",
    paragraphs: [
      "A columbarium niche has room for an urn and a name. It does not have room for the trips, the kitchen, or the voice. A QR code is one way to open those without asking the cemetery to change the niche.",
      "We do not sell niches, urns, or columbarium plaques. We sell the QR Memorial Plaque and the memorial page it opens. Some families keep that plaque at home. Others ask the cemetery whether a small plaque is allowed beside the niche. We cannot promise a cemetery will allow it. If you want it outdoors, say so in the order notes so we can confirm the finish first.",
      `The same page can be opened by someone standing at the niche and by someone who could not travel. Put the name on the first line of the notes. Hosting for ${years} years comes with the plaque.`,
    ],
    faqs: [
      {
        question: "Do you sell columbarium niches or urns?",
        answer:
          "No. We sell the QR Memorial Plaque and the memorial page. The plaque can stay at home, or you can ask the cemetery if it may sit near the niche.",
      },
      {
        question: "Will every cemetery allow a plaque on the niche?",
        answer:
          "We do not know the rules of a particular cemetery. Ask them before you plan to attach anything. The memorial page works either way.",
      },
      {
        question: "Can family who are not there open the page?",
        answer:
          "Yes. The QR code and the page link open the same memorial page. A visitor does not need an account.",
      },
    ],
    showConcierge: false,
    links: [
      { href: "/qr-code-for-urn", label: "A QR code beside an urn" },
      { href: "/memorial-page-for-family-far-away", label: "A memorial page for family who cannot travel" },
    ],
  },
  spouse: {
    id: "spouse",
    path: "/memorial-qr-for-a-spouse",
    title: "Memorial QR for a Spouse | MemorialsQR",
    description:
      "A memorial for a husband or wife can hold the days you shared. The QR plaque is $29.99 once, with hosting included.",
    h1: "A memorial QR for a spouse",
    ogTitle: "A memorial QR for a spouse",
    ogSubtitle: "The house still has their place in it.",
    paragraphs: [
      "A husband or a wife is the person who knew the ordinary version of the day: the coffee, the side of the bed, the way the door sounded. A memorial for them does not have to be a speech. It can be a page those details can live on.",
      "The QR Memorial Plaque carries their name, the dates, and a QR code. You choose gold, silver, or black in the order notes. The page is created when you order, so you can add one photograph and stop. Children and friends can add a memory later if you want them to.",
      `This is a one-time purchase. Hosting for ${years} years is included. We make the plaque in Alabama and ship it to a United States address. We do not sell headstones or jewelry.`,
    ],
    faqs: [
      {
        question: "Can the page be private to the family?",
        answer:
          "People need the QR code or the link to open the page. They do not need an account. You choose what to put on the page.",
      },
      {
        question: "What do I write in the order notes?",
        answer:
          "The name on the first line, then the dates, then gold, silver, or black. Add anything else you want us to know.",
      },
      {
        question: "Do I have to finish the page before the plaque ships?",
        answer:
          "No. The QR code already opens the page. You can add stories after the plaque is in the house.",
      },
    ],
    showConcierge: true,
    links: [
      { href: "/memorial-qr-for-grandparents", label: "A memorial QR for grandparents" },
      { href: "/digital-memorial-page", label: "What a digital memorial page includes" },
    ],
  },
  grandparents: {
    id: "grandparents",
    path: "/memorial-qr-for-grandparents",
    title: "Memorial QR for Grandparents | MemorialsQR",
    description:
      "Grandchildren can open a grandparent's photos and stories from one QR plaque. $29.99 once, with hosting included.",
    h1: "A memorial QR for grandparents",
    ogTitle: "A memorial QR for grandparents",
    ogSubtitle: "The stories grandchildren ask for later.",
    paragraphs: [
      "Grandchildren often meet a grandparent in pieces: a holiday, a kitchen, a story someone else tells. A memorial page is one place those pieces can sit, so a child who is ten now can still open them at twenty.",
      "The keepsake is the QR Memorial Plaque. It is not a headstone and it is not a book. The name and dates go on the metal, and the QR code opens the page. A parent can start the page. A cousin can add one photograph. Nobody has to write a full life.",
      `Order it when you have the name. The page can wait for the stories. Hosting for ${years} years is included with the plaque, and shipping to a United States address is included in the price.`,
    ],
    faqs: [
      {
        question: "Can more than one grandchild add a story?",
        answer:
          "Yes. Share the page with the family and ask for one memory each. The QR code on the plaque opens that same page.",
      },
      {
        question: "Is this a headstone?",
        answer:
          "No. It is a metal plaque with a QR code. Some families set a plaque with a headstone. Others keep it at home. We do not sell headstones.",
      },
      {
        question: "What does the price include?",
        answer: `The QR Memorial Plaque, the memorial page, and ${years} years of hosting. Shipping in the United States is included. Nothing is billed each month.`,
      },
    ],
    showConcierge: false,
    links: [
      { href: "/qr-code-for-headstone", label: "A QR code for a headstone" },
      { href: "/memorial-gift-loss-of-mother", label: "A memorial gift after losing a mother" },
    ],
  },
  cemetery: {
    id: "cemetery",
    path: "/cemetery-qr-code",
    title: "Cemetery QR Code | MemorialsQR",
    description:
      "A cemetery visitor can open a memorial page from a QR code, with no app. The plaque is $29.99, with hosting included.",
    h1: "A cemetery QR code",
    ogTitle: "A cemetery QR code",
    ogSubtitle: "For the person who finds the grave and wants more than the dates.",
    paragraphs: [
      "A cemetery visit is the walk, the search for the row, and then a stone that says very little. A QR code is for the visitor who is already there and wants the person, not another date.",
      "This page is about that visit. A grave marker page is about the flat marker. A headstone page is about the upright stone. The keepsake you can buy for any of them is the QR Memorial Plaque. We do not sell cemetery plots or stones. If the plaque will live outside, write that in the order notes and we will confirm the finish before we make it.",
      `A phone camera opens the memorial page. The visitor does not create an account. The page can hold photos and a few stories, and it can stay unfinished for a while. Hosting for ${years} years is included.`,
    ],
    faqs: [
      {
        question: "Do I need an app to scan a cemetery QR code?",
        answer: "No. A phone camera opens the memorial page. The visitor does not need an account.",
      },
      {
        question: "Do you engrave the cemetery stone?",
        answer:
          "No. We make a separate metal plaque with a QR code. Ask the cemetery before you attach anything to a stone they care for.",
      },
      {
        question: "What should visitors see first?",
        answer:
          "A name and one photograph are enough. You can add stories later. The QR code already opens the page when the order is paid.",
      },
    ],
    showConcierge: false,
    links: [
      { href: "/grave-marker-qr-code", label: "A QR code for a grave marker" },
      { href: "/qr-code-for-headstone", label: "A QR code for a headstone" },
    ],
  },
  farAway: {
    id: "farAway",
    path: "/memorial-page-for-family-far-away",
    title: "Memorial for Family Far Away | MemorialsQR",
    description:
      "Family who cannot travel can open the photos and stories from a link. The QR plaque is $29.99, and the page can be texted.",
    h1: "A memorial page for family far away",
    ogTitle: "A memorial page for family far away",
    ogSubtitle: "The people who could not get on the plane.",
    paragraphs: [
      "Some of the people who loved them cannot come. A job, a border, a body that does not travel, a child who cannot miss school. They still want the photographs and a way to leave one memory.",
      "The memorial page is a link you can text. It is also the page a QR code opens, so the people who are in the room and the people who are not open the same place. The QR Memorial Plaque is the keepsake that carries that code. We ship it in the United States. The link itself can be sent anywhere you already write to your family.",
      `You do not have to build the whole page before you send the link. Start with the name. Hosting for ${years} years is included with the plaque. If you would rather have us build the page, the concierge service is a separate purchase and nothing is shipped for that service.`,
    ],
    faqs: [
      {
        question: "Can I send the page to someone in another country?",
        answer:
          "Yes. The page is a link. We ship the plaque only inside the United States. The link can go to anyone you can already message.",
      },
      {
        question: "Do they need an account?",
        answer: "No. Opening the link or the QR code does not require an account.",
      },
      {
        question: "Is the plaque required to share the page?",
        answer:
          "The page you can order today comes with the QR Memorial Plaque. The link and the QR code open that same page. Concierge is a separate way to have us build a page, and nothing is shipped for that service.",
      },
    ],
    showConcierge: true,
    links: [
      { href: "/celebration-of-life-keepsake", label: "A keepsake after a celebration of life" },
      { href: "/memorial-qr-for-a-spouse", label: "A memorial QR for a spouse" },
    ],
  },
  bench: {
    id: "bench",
    path: "/memorial-bench-plaque-qr-code",
    title: "Memorial Bench Plaque QR Code | MemorialsQR",
    description:
      `A memorial bench has room for a name. A small QR plaque can open the photos and stories. $29.99 once, with ${years} years of hosting included.`,
    h1: "A QR code for a memorial bench plaque",
    ogTitle: "A QR code for a memorial bench",
    ogSubtitle: "The bench holds the name. The page holds the rest.",
    paragraphs: [
      "A memorial bench in a park, a garden, or a school yard usually carries a short plaque: a name, dates, maybe one line. People sit there for years, and most of them never learn who the person was.",
      "We do not sell benches or the engraved bench plaque. We sell the QR Memorial Plaque, a small metal piece with one QR code. Ask whoever manages the bench whether a small plaque can be added beside the existing one before you order. If it will be outdoors, say so in the order notes and we will confirm the finish before we make it.",
      `Anyone who sits down can scan the code with a phone camera and open the memorial page. No app is needed. Hosting for ${years} years is included in the $29.99 price, and nothing is billed each month.`,
    ],
    faqs: [
      {
        question: "Do you make the bench or the engraved bench plaque?",
        answer: "No. We make the QR Memorial Plaque and the memorial page it opens. It can sit beside a bench plaque you already have.",
      },
      {
        question: "Can the plaque stay outdoors on a bench?",
        answer:
          "Write that it will be outdoors in the order notes. We will confirm the finish before we make it. We do not promise that every finish is for permanent outdoor use.",
      },
      {
        question: "Do I need permission to add it to a public bench?",
        answer: "Often, yes. Parks, schools, and cemeteries set their own rules, so ask the bench owner before you order.",
      },
    ],
    showConcierge: false,
    links: [
      { href: "/grave-marker-qr-code", label: "A QR code for a grave marker" },
      { href: "/cemetery-qr-code", label: "A QR code for a cemetery visit" },
    ],
  },
  home: {
    id: "home",
    path: "/memorial-display-at-home",
    title: "Memorial Display at Home With a QR Code | MemorialsQR",
    description:
      "A shelf, a mantel, or a corner with a photo and a candle. A QR plaque there opens the whole memorial page. $29.99, hosting included.",
    h1: "A memorial display at home with a QR code",
    ogTitle: "A memorial corner at home",
    ogSubtitle: "One photo on the shelf. Every photo on the page.",
    paragraphs: [
      "Many families keep a small memorial at home: a framed photo, a candle, an urn, a card from the service. There is only room for a few things, and the rest of the photos sit in a phone.",
      "The QR Memorial Plaque is a small metal piece with a name, dates, and one QR code. Set it next to the photo or the urn. When a visitor asks about them, they can scan it and see the photos, videos, and stories on the memorial page.",
      `The page is created when the order is paid, so the code works the day it arrives. Keepsakes are made to order and ship within 7 to 10 business days to US addresses. Hosting for ${years} years is included.`,
    ],
    faqs: [
      {
        question: "Can the plaque sit next to an urn?",
        answer: "Yes. It is a small standalone plaque. We also have a guide on QR codes for urns if you want the code on the urn itself.",
      },
      {
        question: "Who can see the memorial page?",
        answer: "Anyone who scans the code or has the link can open the page. You can share the link with family who live far away.",
      },
      {
        question: "Is there a monthly fee?",
        answer: `No. The plaque is $29.99 and includes ${years} years of hosting for the page.`,
      },
    ],
    showConcierge: false,
    links: [
      { href: "/qr-code-for-urn", label: "A QR code for an urn" },
      { href: "/memorial-page-for-family-far-away", label: "A memorial page for family far away" },
    ],
  },
  sibling: {
    id: "sibling",
    path: "/memorial-qr-for-a-sibling",
    title: "Memorial Gift for Loss of a Brother or Sister | MemorialsQR",
    description:
      "A QR plaque that opens a memorial page for a brother or sister: childhood photos, stories, and messages from family. $29.99, hosting included.",
    h1: "A memorial QR for a brother or sister",
    ogTitle: "Remembering a brother or sister",
    ogSubtitle: "A lifetime of photos, one code.",
    paragraphs: [
      "Siblings share the longest stretch of a life. The photos are scattered across parents, cousins, old friends, and a dozen phones. A memorial page is one place to gather them.",
      "The QR Memorial Plaque carries a name, dates, and a QR code that opens that page. Family can add photos and stories after it is made, so you do not have to collect everything first.",
      `It can be a gift for a parent or another sibling, or something you keep yourself. Put the name on the first line of the order notes, then the dates, then gold, silver, or black. Hosting for ${years} years is included in the $29.99 price.`,
    ],
    faqs: [
      {
        question: "Can other family members add photos?",
        answer: "Yes. The memorial page can collect photos and stories from family after the plaque is made.",
      },
      {
        question: "Can I send it as a gift?",
        answer: "Yes. Enter the recipient's address at checkout. It ships within 7 to 10 business days to US addresses.",
      },
      {
        question: "What if the page is not ready when it arrives?",
        answer: "The page exists as soon as the order is paid. You can keep adding to it over time.",
      },
    ],
    showConcierge: false,
    links: [
      { href: "/memorial-gift-loss-of-mother", label: "A memorial gift for the loss of a mother" },
      { href: "/memorial-gift-loss-of-father", label: "A memorial gift for the loss of a father" },
    ],
  },
} as const satisfies Record<string, LongTailPage>

export const longTailList: LongTailPage[] = Object.values(longTailPages)
