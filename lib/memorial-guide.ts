import { attributionFromUnknown, formatAttribution, type ClickAttribution } from "@/lib/attribution"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { SUPPORT_EMAIL } from "@/lib/site"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type GuideSection = {
  heading: string
  body: string
}

/** The guide we email. The same words are shown on the page. */
export const MEMORIAL_GUIDE_SECTIONS: GuideSection[] = [
  {
    heading: "Start with their name",
    body: "Write the name you want on the page, then the dates if you know them. You do not need a title or a perfect sentence. If you are unsure of a date, leave it until someone in the family can confirm it.",
  },
  {
    heading: "Choose a few photographs",
    body: "Five photographs that show a real day are enough to begin. A kitchen, a porch, a holiday, a pet in their lap. You can add more later. You do not have to scan every album before the page is worth opening.",
  },
  {
    heading: "Tell one ordinary story",
    body: "Write the story you would tell a friend who never met them: a habit, a joke, a thing they made, the way they answered the phone. Ordinary details are what people are afraid of losing. A long biography can wait.",
  },
  {
    heading: "Leave room for other people",
    body: "Send the link to one person who loved them and ask for a single memory, not a eulogy. People often write more freely when the page already has a name and one story on it.",
  },
  {
    heading: "Stop, and come back",
    body: `You can close the page and return when you have more to add. Nothing on the page has to be finished in one sitting. If you also order the QR Memorial Plaque, the page is included and hosting lasts ${HOSTING_INCLUDED_YEARS} years from the order. The plaque is optional. The page can begin before you decide.`,
  },
]

export function parseGuideEmail(
  body: unknown,
): { ok: true; email: string; attribution: ClickAttribution | null } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Enter an email address." }
  const record = body as { email?: unknown; attribution?: unknown }
  const email = typeof record.email === "string" ? record.email.trim() : ""
  if (!EMAIL_PATTERN.test(email) || email.length > 200) return { ok: false, error: "Enter a valid email address." }
  return { ok: true, email, attribution: attributionFromUnknown(record.attribution) }
}

export function buildGuideLeadNote(email: string, attribution: ClickAttribution | null) {
  const attributionText = formatAttribution(attribution)
  const text = [`Guide signup: ${email}`, attributionText].filter(Boolean).join("\n")
  return {
    subject: "Memorial guide signup",
    text,
    html: `<p>Guide signup: ${escapeHtml(email)}</p>${attributionText ? `<pre>${escapeHtml(attributionText)}</pre>` : ""}`,
  }
}

export function buildGuideEmail(email: string) {
  const sections = MEMORIAL_GUIDE_SECTIONS.map((section) => `${section.heading}\n${section.body}`).join("\n\n")
  const text = `How to create a meaningful memorial page\n\n${sections}\n\nYou asked us to email this guide to ${email}. We saved that address so we can send it again if you ask. This note is the guide, not a series of emails.\n\n${SUPPORT_EMAIL}`
  const html = `<h1>How to create a meaningful memorial page</h1>${MEMORIAL_GUIDE_SECTIONS.map(
    (section) => `<h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.body)}</p>`,
  ).join("")}<p>You asked us to email this guide. We saved your address so we can send it again if you ask. This note is the guide, not a series of emails.</p><p>${escapeHtml(SUPPORT_EMAIL)}</p>`
  return {
    subject: "Your guide: how to create a meaningful memorial page",
    text,
    html,
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!)
}
