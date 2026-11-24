import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { EXAMPLE_HOLIDAY_PATH } from "@/lib/memorial-urls"
import { formatUsd } from "@/lib/site"

const price = formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)
const years = HOSTING_INCLUDED_YEARS

/** /christmas-memorial-ideas. Every sentence describes something the site does today. */
export const christmasMemorial = {
  path: "/christmas-memorial-ideas",
  title: "First Christmas Memorial Ideas | MemorialsQR",
  description: `Small ways to include someone at the first Christmas without them, plus a memorial page with a holiday view family can scan. ${price} once.`,
  h1: "Christmas memorial ideas for the first Christmas without them",
  ogTitle: "Christmas memorial ideas",
  ogSubtitle: "A place at the table, and a page the family can scan.",
  answer: `The first Christmas after a death is often the hardest. Small, specific things tend to help more than big gestures: say their name, set out something that was theirs, make the dish they made, and give people a place to share a memory. A MemorialsQR page does the last part. Every memorial page has a Christmas remembrance view where family can leave a holiday memory, and the QR code we email can go on a card, a place setting, or an ornament tag. It is ${price} once with ${years} years of hosting, and nothing is shipped.`,
  ideas: [
    { title: "Say their name", body: "Many grieving people want to hear the name. Tell one story at dinner, or ask each person for one sentence about them." },
    { title: "Set out something that was theirs", body: "A mug, a hat, a recipe card in their handwriting, or the ornament they always hung. It gives them a place in the room without a speech." },
    { title: "Make the dish they made", body: "Cook from their recipe, even if it does not come out the same. Someone at the table will remember who made it first." },
    { title: "Light a candle at the table", body: "A candle by an empty chair, or at the moment of the day that mattered most to them." },
    { title: "Give the family one place for memories", body: "Relatives who are far away can open the same page from a link. People who are in the room can scan the QR code on a card." },
    { title: "Give people a way out", body: "Not every tradition has to happen this year. It is fine to skip one, shorten the day, or leave early." },
  ],
  howTo: {
    name: "How to set up a Christmas remembrance page with a QR code",
    totalTime: "PT20M",
    steps: [
      { name: "Order the digital memorial page", text: `Order the digital memorial page for ${price}. Put their name on the first line of the order notes. The page is created when the order is paid.` },
      { name: "Add one photo and one story", text: "Start small. One photograph and a few sentences are enough. Family can add more later." },
      { name: "Open the Christmas remembrance view", text: "Every memorial page has a holiday view at the same address with /holiday on the end. It shows holiday memories and photos and has a button for visitors to share a memory." },
      { name: "Print the QR code", text: "We email the QR code as a PNG. Print it on a card for the table, a place setting, or a tag for an ornament you already have." },
      { name: "Send the link to family far away", text: "Text or email the page link to the people who cannot be there, so everyone opens the same place." },
    ],
  },
  faqs: [
    {
      question: "What is the Christmas remembrance view?",
      answer: "It is a holiday version of the memorial page. It shows the family's holiday memories and photos and lets a visitor leave a short memory. The owner of the page can remove a memory.",
    },
    {
      question: "Do you sell Christmas memorial ornaments?",
      answer: "No. MemorialsQR does not sell ornaments. Our sister shop, Custom Gifts Online, sells personalized Christmas ornaments, and you can print our QR code on a tag for any ornament.",
    },
    {
      question: "Will it arrive before Christmas?",
      answer: "Nothing is shipped. The page is online once the order is paid, and the QR code is emailed as a PNG, so you can print it the same day.",
    },
    {
      question: "Is there a monthly fee?",
      answer: `No. The digital memorial page is ${price} once and includes ${years} years of hosting.`,
    },
    {
      question: "Can we see an example first?",
      answer: "Yes. The example remembrance page shows the holiday view with a made-up person. It is for looking only.",
    },
  ],
  memoryPrompts: [
    "The ornament or decoration they always put up first",
    "What they cooked, and what they always burned",
    "The gift they gave that you still use",
    "Where they sat on Christmas morning",
    "A song they sang along to, badly or well",
    "The one tradition they would not let anyone skip",
  ],
  examplePath: EXAMPLE_HOLIDAY_PATH,
} as const
