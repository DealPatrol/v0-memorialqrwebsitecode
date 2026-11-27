import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { formatUsd } from "@/lib/site"

const price = formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)
const years = HOSTING_INCLUDED_YEARS

export const OBITUARY_PATH = "/obituary-template"

/**
 * /obituary-template: a fill-in obituary template and a free writer that runs in the browser.
 * The writer fills a template from what the family types. It is not an AI model and the page says so.
 * Every sentence describes common practice or something MemorialsQR does today.
 */
export const obituaryPage = {
  path: OBITUARY_PATH,
  title: "Obituary Template & Free Obituary Writer | MemorialsQR",
  description: `A fill-in obituary template with an example, and a free writer that drafts it from your family's details. Put it on a memorial page for ${price}.`,
  h1: "Obituary template and free obituary writer",
  ogTitle: "Obituary template",
  ogSubtitle: "Fill in the details. Copy the draft. Make it yours.",
  answer:
    "An obituary usually has five parts, in this order: the announcement (full name, age, hometown and the date they died), a short life story, the family who survive them and those who died before them, the service details, and where to send donations or flowers. Write it in the past tense, keep the newspaper version short, and put the longer story, photos and memories on an online memorial page. The writer below drafts all five parts from the details you type. Nothing you type leaves your browser.",
  parts: [
    { title: "1. The announcement", body: "Full name (with a nickname in quotes if people knew them by it), age, the town they lived in, and the date they died. Many families also say where, for example at home or surrounded by family." },
    { title: "2. Their life", body: "Where and when they were born, their parents, school, work, military service, faith, and the things people knew them for. Two or three specific details say more than a list of virtues." },
    { title: "3. Family", body: "“Survived by” lists the living: spouse, children, grandchildren, siblings. “Preceded in death by” lists close family who died before them. Spell every name the way that person spells it." },
    { title: "4. Service details", body: "Visitation, funeral or celebration of life: day, date, time and place, and who is officiating if the family wants to say. Check every date and address with the funeral home before it is published." },
    { title: "5. Flowers, donations and the memorial page", body: "If the family prefers donations, name the charity. Add the memorial page link or QR code so people can share photos and stories." },
  ],
  exampleTitle: "A filled-in example (made-up person)",
  example:
    "Margaret “Peggy” Ellis, 81, of Cullman, Alabama, died peacefully at home on November 2, 2026, surrounded by her family.\n\nPeggy was born in Hanceville to Ruth and Harold Pruitt. She taught second grade for 31 years and never stopped correcting grammar at the dinner table. She grew tomatoes nobody could match and played piano at her church every Sunday.\n\nShe is survived by her husband of 58 years, Don; her children, Karen (Mike) Lowery and Steve Ellis; five grandchildren; and her sister, June. She was preceded in death by her parents and her brother, Earl.\n\nVisitation will be Friday, November 6, from 5 to 7 PM, with the funeral Saturday at 11 AM. In lieu of flowers, the family asks that donations be made to the church music fund.\n\nFamily and friends can share photos and memories on her memorial page.",
  exampleNote: "Peggy Ellis is made up. The names, dates, places and numbers are an example only.",
  howTo: {
    name: "How to write an obituary",
    totalTime: "PT45M",
    steps: [
      { name: "Gather the facts", text: "Full legal name and nickname, age, town, date of death, birth date and place, parents, spouse, children and other close family, and the service details from the funeral home." },
      { name: "Write the announcement", text: "One sentence: name, age, town, and the date they died." },
      { name: "Tell a short life story", text: "Birthplace, work, service, faith and two or three specific things people remember about them." },
      { name: "List the family", text: "Survived by, then preceded in death by. Check spelling and spouses' names with each branch of the family." },
      { name: "Add service and donation details", text: "Visitation and funeral times and places, and the charity if the family prefers donations to flowers." },
      { name: "Check it and share it", text: "Have one other person read it aloud. Send the short version to the newspaper or funeral home and put the full story, photos and memories on a memorial page with a QR code for the program." },
    ],
  },
  faqs: [
    {
      question: "What should an obituary include?",
      answer: "The announcement (name, age, town, date of death), a short life story, surviving family and family who died before them, the visitation and funeral details, and where to send flowers or donations. Many families add a link or QR code to an online memorial page.",
    },
    {
      question: "How long should an obituary be?",
      answer: "As long as the family wants online. Newspapers often charge by length, so many families send a short version to the paper and put the full story on a memorial page, where there is no length limit. Ask your funeral home what the local paper charges.",
    },
    {
      question: "Who usually writes the obituary?",
      answer: "Usually a close family member, often with help from the funeral director, who can check dates and service details and send it to the newspaper.",
    },
    {
      question: "What should we leave out of an obituary?",
      answer: "Many families leave out the home address, the full birth date and the mother's maiden name, because those details are used to verify identity. Mentioning that the home will be empty during the service is also best avoided.",
    },
    {
      question: "Does the obituary writer use AI?",
      answer: "No. It fills a template with the details you type, in the order obituaries usually follow, and you edit the result. Nothing you type is sent to us or anyone else.",
    },
    {
      question: "Where can we publish the full obituary online?",
      answer: `On a MemorialsQR memorial page. It is ${price} once with ${years} years of hosting. Paste the obituary into the biography, add photos, and share the link or print the QR code on the funeral program. Nothing is shipped.`,
    },
  ],
} as const

export type ObituaryInput = {
  fullName: string
  nickname: string
  age: string
  town: string
  dateOfDeath: string
  circumstance: string
  birthPlace: string
  parents: string
  lifeDetails: string
  survivedBy: string
  precededBy: string
  service: string
  donations: string
  includeMemorialLink: boolean
}

function clean(value: string) {
  return value.trim().replace(/\s+/g, " ").replace(/[.]+$/, "")
}

function displayName(input: ObituaryInput) {
  const name = clean(input.fullName) || "[Full name]"
  const nick = clean(input.nickname).replace(/^["“”']+|["“”']+$/g, "")
  if (!nick) return name
  const parts = name.split(" ")
  if (parts.length < 2) return `${name} “${nick}”`
  return `${parts[0]} “${nick}” ${parts.slice(1).join(" ")}`
}

function firstName(input: ObituaryInput) {
  const nick = clean(input.nickname).replace(/^["“”']+|["“”']+$/g, "")
  if (nick) return nick
  return clean(input.fullName).split(" ")[0] || "[First name]"
}

function sentences(lines: string) {
  return lines
    .split(/\n+/)
    .map(clean)
    .filter(Boolean)
    .map((line) => `${line.charAt(0).toUpperCase()}${line.slice(1)}.`)
}

/** Builds the full obituary and a two-sentence short version from the family's details. */
export function buildObituary(input: ObituaryInput): { full: string; short: string } {
  const name = displayName(input)
  const first = firstName(input)
  const age = clean(input.age)
  const town = clean(input.town)
  const date = clean(input.dateOfDeath) || "[date]"
  const circumstance = clean(input.circumstance)

  const announcement = `${name}${age ? `, ${age},` : ""}${town ? ` of ${town},` : ""} died${circumstance ? ` ${circumstance}` : ""} on ${date}.`

  const born = clean(input.birthPlace)
  const parents = clean(input.parents)
  const life = [
    born || parents ? `${first} was born${born ? ` in ${born}` : ""}${parents ? ` to ${parents}` : ""}.` : "",
    ...sentences(input.lifeDetails),
  ]
    .filter(Boolean)
    .join(" ")

  const survived = clean(input.survivedBy)
  const preceded = clean(input.precededBy)
  const family = [
    survived ? `${first} is survived by ${survived}.` : "",
    preceded ? `${first} was preceded in death by ${preceded}.` : "",
  ]
    .filter(Boolean)
    .join(" ")

  const service = sentences(input.service).join(" ")
  const donations = clean(input.donations)
  const closing = [
    service,
    donations ? `In lieu of flowers, the family asks that donations be made to ${donations}.` : "",
    input.includeMemorialLink ? "Family and friends can share photos and memories on the memorial page: [memorial page link]." : "",
  ]
    .filter(Boolean)
    .join(" ")

  const full = [announcement, life, family, closing].filter(Boolean).join("\n\n")
  const short = [announcement, service || (input.includeMemorialLink ? "Service details and the memorial page: [memorial page link]." : "")]
    .filter(Boolean)
    .join(" ")
  return { full, short }
}
