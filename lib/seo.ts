import type { Metadata } from "next"
import { CONCIERGE_PRODUCTS } from "@/lib/catalog"
import { HOSTING_MONTHLY_PRICE } from "@/lib/pricing"
import { SITE_NAME, SITE_URL } from "@/lib/site"

const conciergeOffer = CONCIERGE_PRODUCTS.find((product) => product.id === "concierge-digital")

if (!conciergeOffer) {
  throw new Error("Concierge digital offer is missing from the catalog")
}

/** Real charged amounts. Descriptions and JSON-LD must use these, not rounded marketing numbers. */
export const HOSTING_PRICE_AMOUNT = HOSTING_MONTHLY_PRICE
export const CONCIERGE_PRICE_AMOUNT = conciergeOffer.price
export const HOSTING_PRICE_LABEL = `$${HOSTING_MONTHLY_PRICE.toFixed(2)}`
export const CONCIERGE_PRICE_LABEL = `$${conciergeOffer.price.toFixed(2)}`

export type ChangeFrequency = "daily" | "weekly" | "monthly" | "yearly"

export type SeoPage = {
  path: string
  title: string
  description: string
  file: string
  changeFrequency: ChangeFrequency
  priority: number
  index: boolean
  inSitemap: boolean
}

const hosting = HOSTING_PRICE_LABEL
const concierge = CONCIERGE_PRICE_LABEL

export const publicPages = {
  home: {
    path: "/",
    title: "Online Memorial Page | MemorialsQR",
    description: `Create an online memorial page for a loved one or pet. Hosting is ${hosting} a month. Concierge is ${concierge}. Nothing ships.`,
    file: "app/page.tsx",
    changeFrequency: "weekly",
    priority: 1,
    index: true,
    inSitemap: true,
  },
  store: {
    path: "/store",
    title: "Memorial Website Hosting | MemorialsQR",
    description: `Host a memorial website with photos and stories for ${hosting} per month. Nothing is shipped.`,
    file: "app/store/page.tsx",
    changeFrequency: "weekly",
    priority: 0.9,
    index: true,
    inSitemap: true,
  },
  tombstones: {
    path: "/memorial-qr-codes-tombstones",
    title: "QR Code Memorial Pages | MemorialsQR",
    description: `A QR code memorial opens an online memorial page of photos and stories. Hosting is ${hosting} a month. Nothing ships.`,
    file: "app/memorial-qr-codes-tombstones/page.tsx",
    changeFrequency: "monthly",
    priority: 0.8,
    index: true,
    inSitemap: true,
  },
  pricing: {
    path: "/pricing",
    title: "Memorial Page Pricing | MemorialsQR",
    description: `Online memorial page hosting is ${hosting} USD per month. The concierge memorial service is ${concierge}. Nothing ships.`,
    file: "app/pricing/page.tsx",
    changeFrequency: "monthly",
    priority: 0.8,
    index: true,
    inSitemap: true,
  },
  blog: {
    path: "/blog",
    title: "Memorial Guides | MemorialsQR",
    description: "Guides for an online memorial page, a pet memorial page, and a QR code memorial you can share.",
    file: "app/blog/page.tsx",
    changeFrequency: "weekly",
    priority: 0.7,
    index: true,
    inSitemap: true,
  },
  howItWorks: {
    path: "/how-it-works",
    title: "How a Memorial Page Works | MemorialsQR",
    description: `Create a digital memorial for a loved one, share a QR code memorial, and host it for ${hosting} a month.`,
    file: "app/how-it-works/page.tsx",
    changeFrequency: "monthly",
    priority: 0.7,
    index: true,
    inSitemap: true,
  },
  faq: {
    path: "/faq",
    title: "Memorial Page FAQ | MemorialsQR",
    description: `Answers about online memorial pages, ${hosting} monthly hosting, and the ${concierge} concierge memorial service.`,
    file: "app/faq/page.tsx",
    changeFrequency: "monthly",
    priority: 0.7,
    index: true,
    inSitemap: true,
  },
  contact: {
    path: "/contact",
    title: "Contact MemorialsQR Support",
    description: "Email support@memorialsqr.com about an online memorial page. MemorialsQR is based in Hanceville, Alabama.",
    file: "app/contact/page.tsx",
    changeFrequency: "monthly",
    priority: 0.6,
    index: true,
    inSitemap: true,
  },
  ourStory: {
    path: "/our-story",
    title: "Our Story | MemorialsQR",
    description: "Cole Collins started MemorialsQR after a digital memorial for his grandmother, Glenda Jane Kelso.",
    file: "app/our-story/page.tsx",
    changeFrequency: "monthly",
    priority: 0.6,
    index: true,
    inSitemap: true,
  },
  humanMemorials: {
    path: "/human-memorials",
    title: "Digital Memorial for a Loved One",
    description: `An online memorial page for a parent, grandparent, or friend. Photos, stories, and a QR code. ${hosting} a month.`,
    file: "app/human-memorials/page.tsx",
    changeFrequency: "monthly",
    priority: 0.8,
    index: true,
    inSitemap: true,
  },
  petMemorials: {
    path: "/pet-memorials",
    title: "Pet Memorial Page | MemorialsQR",
    description: `Create a pet memorial page with photos, stories, and a QR code memorial. Hosting is ${hosting} a month. Nothing ships.`,
    file: "app/pet-memorials/page.tsx",
    changeFrequency: "monthly",
    priority: 0.8,
    index: true,
    inSitemap: true,
  },
  terms: {
    path: "/terms-of-service",
    title: "Terms of Service | MemorialsQR",
    description: `Terms for MemorialsQR memorial website hosting at ${hosting} per month and the concierge memorial service.`,
    file: "app/terms-of-service/page.tsx",
    changeFrequency: "yearly",
    priority: 0.3,
    index: true,
    inSitemap: true,
  },
  privacy: {
    path: "/privacy-policy",
    title: "Privacy Policy | MemorialsQR",
    description: "How MemorialsQR collects and protects information for online memorial pages, accounts, and payments.",
    file: "app/privacy-policy/page.tsx",
    changeFrequency: "yearly",
    priority: 0.3,
    index: true,
    inSitemap: true,
  },
  concierge: {
    path: "/concierge",
    title: "Concierge Memorial Service | MemorialsQR",
    description: `We build the online memorial page for you. Concierge memorial service is ${concierge}. Nothing is shipped.`,
    file: "app/concierge/page.tsx",
    changeFrequency: "monthly",
    priority: 0.8,
    index: true,
    inSitemap: true,
  },
  about: {
    path: "/about",
    title: "About MemorialsQR",
    description: `MemorialsQR hosts digital memorial pages from Hanceville, Alabama. Hosting is ${hosting} a month. Nothing ships.`,
    file: "app/about/page.tsx",
    changeFrequency: "monthly",
    priority: 0.6,
    index: true,
    inSitemap: true,
  },
  browse: {
    path: "/browse-memorials",
    title: "Browse Memorial Pages | MemorialsQR",
    description: "Browse public online memorial pages, including the Glenda Jane Kelso memorial that inspired MemorialsQR.",
    file: "app/browse-memorials/page.tsx",
    changeFrequency: "weekly",
    priority: 0.6,
    index: true,
    inSitemap: true,
  },
  createMemorial: {
    path: "/create-memorial",
    title: "Create a Memorial Page | MemorialsQR",
    description: `Start an online memorial page with photos, stories, and a QR code memorial. Hosting is ${hosting} per month.`,
    file: "app/create-memorial/page.tsx",
    changeFrequency: "monthly",
    priority: 0.4,
    index: false,
    inSitemap: false,
  },
  qrGenerator: {
    path: "/qr-generator",
    title: "QR Code Memorial Generator | MemorialsQR",
    description: "Make a QR code memorial that opens an online memorial page. Download and share it. Nothing is shipped.",
    file: "app/qr-generator/page.tsx",
    changeFrequency: "monthly",
    priority: 0.6,
    index: true,
    inSitemap: true,
  },
  help: {
    path: "/help",
    title: "Memorial Page Help | MemorialsQR",
    description: `Help with an online memorial page, hosting at ${hosting} a month, and the concierge memorial service.`,
    file: "app/help/page.tsx",
    changeFrequency: "monthly",
    priority: 0.5,
    index: true,
    inSitemap: true,
  },
  cookies: {
    path: "/cookies",
    title: "Cookie Policy | MemorialsQR",
    description: "How MemorialsQR uses cookies and browser storage for sign-in, checkout, and basic site preferences.",
    file: "app/cookies/page.tsx",
    changeFrequency: "yearly",
    priority: 0.2,
    index: true,
    inSitemap: true,
  },
  security: {
    path: "/security",
    title: "Security and Trust | MemorialsQR",
    description: "How MemorialsQR protects memorial pages, accounts, and payments for families in the United States.",
    file: "app/security/page.tsx",
    changeFrequency: "yearly",
    priority: 0.3,
    index: true,
    inSitemap: true,
  },
  programs: {
    path: "/programs",
    title: "Memorial Website Features | MemorialsQR",
    description: `Photos, stories, guest messages, and a QR code memorial on one memorial website. Hosting is ${hosting} a month.`,
    file: "app/programs/page.tsx",
    changeFrequency: "monthly",
    priority: 0.5,
    index: true,
    inSitemap: true,
  },
  glenda: {
    path: "/memorial/glenda-kelso",
    title: "Glenda Jane Kelso Memorial | MemorialsQR",
    description: "Public online memorial page for Glenda Jane Kelso, July 27, 1952 to August 27, 2025.",
    file: "app/memorial/glenda-kelso/page.tsx",
    changeFrequency: "monthly",
    priority: 0.6,
    index: true,
    inSitemap: true,
  },
} as const satisfies Record<string, SeoPage>

for (const page of Object.values(publicPages)) {
  assertMetadataLength(page.title, page.description, page.path)
}

export function assertMetadataLength(title: string, description: string, path: string) {
  if (title.length > 60) {
    throw new Error(`Title for ${path} is ${title.length} characters: ${title}`)
  }
  if (description.length > 155) {
    throw new Error(`Description for ${path} is ${description.length} characters: ${description}`)
  }
  if (title.length === 0 || description.length === 0) {
    throw new Error(`Missing title or description for ${path}`)
  }
}

type PageMetadataInput = {
  title: string
  description: string
  path: string
  index?: boolean
  ogType?: "website" | "article"
}

export function pageMetadata({
  title,
  description,
  path,
  index = true,
  ogType = "website",
}: PageMetadataInput): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`
  const robots = index
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large" as const,
          "max-snippet": -1,
        },
      }
    : {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      }

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: ogType,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots,
  }
}
