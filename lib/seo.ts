import type { Metadata } from "next"
import { adLandingPages } from "@/lib/ad-landings"
import { CONCIERGE_PRODUCTS, PLAQUE_PRICE } from "@/lib/catalog"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { longTailPages } from "@/lib/long-tail"
import { SITE_NAME, SITE_URL } from "@/lib/site"

/**
 * Search Console HTML-tag verification. Next.js renders this as
 * `<meta name="google-site-verification" content="...">`.
 * An empty or whitespace-only value omits the tag.
 * The root layout reads this at build time.
 */
export function googleSiteVerificationTag(raw: string | undefined): { google: string } | undefined {
  const token = raw?.trim()
  if (!token) return undefined
  return { google: token }
}

const conciergeOffer = CONCIERGE_PRODUCTS.find((product) => product.id === "concierge-digital")

if (!conciergeOffer) {
  throw new Error("Concierge digital offer is missing from the catalog")
}

/** Real charged amounts. Descriptions and JSON-LD must use these, not rounded marketing numbers. */
export const CONCIERGE_PRICE_AMOUNT = conciergeOffer.price
/** Keepsakes include hosting. There is no recurring plan. */
export const HOSTING_INCLUDED_TEXT = `${HOSTING_INCLUDED_YEARS} years of hosting included`
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

const years = HOSTING_INCLUDED_YEARS
const concierge = CONCIERGE_PRICE_LABEL
const plaque = `$${PLAQUE_PRICE.toFixed(2)}`

export const publicPages = {
  home: {
    path: "/",
    title: "Online Memorial Page | MemorialsQR",
    description: `QR memorial keepsakes that open an online memorial page for a loved one or pet. Every keepsake includes ${years} years of hosting. No recurring fees.`,
    file: "app/page.tsx",
    changeFrequency: "weekly",
    priority: 1,
    index: true,
    inSitemap: true,
  },
  store: {
    path: "/store",
    title: "QR Memorial Keepsakes | MemorialsQR",
    description: `Printed QR memorial keepsakes that open a memorial page of photos and stories. ${years} years of hosting included. No recurring fees.`,
    file: "app/store/page.tsx",
    changeFrequency: "weekly",
    priority: 0.9,
    index: true,
    inSitemap: true,
  },
  tombstones: {
    path: "/memorial-qr-codes-tombstones",
    title: "QR Code Memorial Pages | MemorialsQR",
    description: `A QR code memorial keepsake opens an online memorial page of photos and stories. ${years} years of hosting included.`,
    file: "app/memorial-qr-codes-tombstones/page.tsx",
    changeFrequency: "monthly",
    priority: 0.8,
    index: true,
    inSitemap: true,
  },
  pricing: {
    path: "/pricing",
    title: "Memorial Keepsake Pricing | MemorialsQR",
    description: `Each QR memorial keepsake is a one-time purchase with ${years} years of memorial page hosting included. No recurring fees.`,
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
    description: `Order a QR memorial keepsake, build the memorial page, and share it. ${years} years of hosting included with every keepsake.`,
    file: "app/how-it-works/page.tsx",
    changeFrequency: "monthly",
    priority: 0.7,
    index: true,
    inSitemap: true,
  },
  faq: {
    path: "/faq",
    title: "Memorial Page FAQ | MemorialsQR",
    description: `Answers about QR memorial keepsakes, the ${years} years of included hosting, and the ${concierge} concierge memorial service.`,
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
    description: `A QR memorial keepsake and online memorial page for a parent, grandparent, or friend. ${years} years of hosting included.`,
    file: "app/human-memorials/page.tsx",
    changeFrequency: "monthly",
    priority: 0.8,
    index: true,
    inSitemap: true,
  },
  petMemorials: {
    path: "/pet-memorials",
    title: "Pet Memorial Page | MemorialsQR",
    description: `A QR memorial keepsake and pet memorial page with photos and stories. ${years} years of hosting included. No recurring fees.`,
    file: "app/pet-memorials/page.tsx",
    changeFrequency: "monthly",
    priority: 0.8,
    index: true,
    inSitemap: true,
  },
  terms: {
    path: "/terms-of-service",
    title: "Terms of Service | MemorialsQR",
    description: `Terms for MemorialsQR keepsakes, the ${years} years of included memorial page hosting, and the concierge memorial service.`,
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
    description: `MemorialsQR, based in Hanceville, Alabama, sells QR memorial keepsakes. Each includes ${years} years of memorial page hosting.`,
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
    description: `Set up the online memorial page for your QR keepsake with photos, stories, and messages.`,
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
    description: `Help with QR memorial keepsakes, memorial pages, the ${years} years of included hosting, and the concierge service.`,
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
    description: `Photos, stories, guest messages, and a QR code memorial on one memorial website. ${years} years of hosting with every keepsake.`,
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
  headstoneQr: {
    path: "/qr-code-for-headstone",
    title: "QR Code for a Headstone | MemorialsQR",
    description: `Visitors at a headstone can open photos and stories with a QR code. The QR Memorial Plaque is ${plaque} and includes ${years} years of hosting.`,
    file: "app/qr-code-for-headstone/page.tsx",
    changeFrequency: "monthly",
    priority: 0.8,
    index: true,
    inSitemap: true,
  },
  plaqueQr: {
    path: "/memorial-qr-code-plaque",
    title: "Memorial QR Code Plaque | MemorialsQR",
    description: `A memorial QR code plaque in gold, silver, or black opens a page of photos and stories. ${plaque} once, with ${years} years of hosting included.`,
    file: "app/memorial-qr-code-plaque/page.tsx",
    changeFrequency: "monthly",
    priority: 0.8,
    index: true,
    inSitemap: true,
  },
  urnQr: {
    path: "/qr-code-for-urn",
    title: "QR Code for an Urn | MemorialsQR",
    description: `A QR code beside an urn opens the memorial page when words are hard to find. The plaque is ${plaque} and includes ${years} years of hosting.`,
    file: "app/qr-code-for-urn/page.tsx",
    changeFrequency: "monthly",
    priority: 0.8,
    index: true,
    inSitemap: true,
  },
  petQr: {
    path: "/pet-memorial-qr-code",
    title: "Pet Memorial QR Code | MemorialsQR",
    description: `A pet memorial QR code opens photos and stories of a companion you miss. The plaque is ${plaque} and includes ${years} years of hosting.`,
    file: "app/pet-memorial-qr-code/page.tsx",
    changeFrequency: "monthly",
    priority: 0.8,
    index: true,
    inSitemap: true,
  },
  programQr: {
    path: "/funeral-program-qr-code",
    title: "Funeral Program QR Code | MemorialsQR",
    description: `A funeral program QR code lets guests open the memorial page during the service. The plaque is ${plaque}, with ${years} years of hosting.`,
    file: "app/funeral-program-qr-code/page.tsx",
    changeFrequency: "monthly",
    priority: 0.8,
    index: true,
    inSitemap: true,
  },
  digitalPage: {
    path: "/digital-memorial-page",
    title: "Digital Memorial Page | MemorialsQR",
    description: `A digital memorial page holds photos, stories, and messages. It comes with the ${plaque} QR plaque and ${years} years of hosting.`,
    file: "app/digital-memorial-page/page.tsx",
    changeFrequency: "monthly",
    priority: 0.8,
    index: true,
    inSitemap: true,
  },
  funeralHomes: {
    path: "/funeral-homes",
    title: "Funeral Home Partners | MemorialsQR",
    description: "Funeral homes can ask about offering MemorialsQR keepsakes to families. Tell us about your funeral home and we will reply by email.",
    file: "app/funeral-homes/page.tsx",
    changeFrequency: "monthly",
    priority: 0.6,
    index: true,
    inSitemap: true,
  },
  sympathyGifts: {
    path: "/sympathy-gift-ideas",
    title: "Sympathy Gift Ideas | MemorialsQR",
    description: `Sympathy gift ideas besides flowers: a QR plaque the family can keep and open later. The plaque is ${plaque} once, with hosting included.`,
    file: "app/sympathy-gift-ideas/page.tsx",
    changeFrequency: "monthly",
    priority: 0.8,
    index: true,
    inSitemap: true,
  },
  motherGift: {
    path: "/memorial-gift-loss-of-mother",
    title: "Memorial Gift for a Mother | MemorialsQR",
    description: `A gift after losing a mother, for her recipes and the way she said your name. The QR plaque is ${plaque}, with hosting included.`,
    file: "app/memorial-gift-loss-of-mother/page.tsx",
    changeFrequency: "monthly",
    priority: 0.8,
    index: true,
    inSitemap: true,
  },
  fatherGift: {
    path: "/memorial-gift-loss-of-father",
    title: "Memorial Gift for a Father | MemorialsQR",
    description: `A gift after losing a father, for the shop, the driveway, and his stories. The QR plaque is ${plaque}, with hosting included.`,
    file: "app/memorial-gift-loss-of-father/page.tsx",
    changeFrequency: "monthly",
    priority: 0.8,
    index: true,
    inSitemap: true,
  },
  petGift: {
    path: "/memorial-gift-loss-of-pet",
    title: "Memorial Gift for a Pet | MemorialsQR",
    description: `A gift for the person grieving a pet, not a collar tag and not the pet's own page. The plaque is ${plaque}, hosting included.`,
    file: "app/memorial-gift-loss-of-pet/page.tsx",
    changeFrequency: "monthly",
    priority: 0.8,
    index: true,
    inSitemap: true,
  },
  personalizedGift: {
    path: "/personalized-memorial-gift",
    title: "Personalized Memorial Gift | MemorialsQR",
    description: `A personalized memorial gift engraved with their name, dates, and a QR code. The plaque is ${plaque} once, hosting included.`,
    file: "app/personalized-memorial-gift/page.tsx",
    changeFrequency: "monthly",
    priority: 0.8,
    index: true,
    inSitemap: true,
  },
  friendGift: {
    path: "/remembrance-gift-for-a-friend",
    title: "Remembrance Gift for a Friend | MemorialsQR",
    description: `A remembrance gift you hand a grieving friend, with the page left for them to fill. The plaque is ${plaque}, hosting included.`,
    file: "app/remembrance-gift-for-a-friend/page.tsx",
    changeFrequency: "monthly",
    priority: 0.8,
    index: true,
    inSitemap: true,
  },
  guides: {
    path: "/guides",
    title: "Memorial QR Guides | MemorialsQR",
    description:
      "Guides for a headstone QR, a grave marker, a cemetery visit, and a memorial page the family can share.",
    file: "app/guides/page.tsx",
    changeFrequency: "monthly",
    priority: 0.7,
    index: true,
    inSitemap: true,
  },
  gifts: {
    path: "/gifts",
    title: "Memorial Gift Ideas | MemorialsQR",
    description:
      "Sympathy and remembrance gifts that open a memorial page. The QR plaque is a one-time purchase with hosting included.",
    file: "app/gifts/page.tsx",
    changeFrequency: "monthly",
    priority: 0.7,
    index: true,
    inSitemap: true,
  },
  graveMarker: {
    path: longTailPages.graveMarker.path,
    title: longTailPages.graveMarker.title,
    description: longTailPages.graveMarker.description,
    file: "app/grave-marker-qr-code/page.tsx",
    changeFrequency: "monthly",
    priority: 0.7,
    index: true,
    inSitemap: true,
  },
  photoVideo: {
    path: longTailPages.photoVideo.path,
    title: longTailPages.photoVideo.title,
    description: longTailPages.photoVideo.description,
    file: "app/memorial-plaque-with-photo-and-video/page.tsx",
    changeFrequency: "monthly",
    priority: 0.7,
    index: true,
    inSitemap: true,
  },
  celebration: {
    path: longTailPages.celebration.path,
    title: longTailPages.celebration.title,
    description: longTailPages.celebration.description,
    file: "app/celebration-of-life-keepsake/page.tsx",
    changeFrequency: "monthly",
    priority: 0.7,
    index: true,
    inSitemap: true,
  },
  columbarium: {
    path: longTailPages.columbarium.path,
    title: longTailPages.columbarium.title,
    description: longTailPages.columbarium.description,
    file: "app/qr-code-for-a-columbarium/page.tsx",
    changeFrequency: "monthly",
    priority: 0.7,
    index: true,
    inSitemap: true,
  },
  spouse: {
    path: longTailPages.spouse.path,
    title: longTailPages.spouse.title,
    description: longTailPages.spouse.description,
    file: "app/memorial-qr-for-a-spouse/page.tsx",
    changeFrequency: "monthly",
    priority: 0.7,
    index: true,
    inSitemap: true,
  },
  bench: {
    path: longTailPages.bench.path,
    title: longTailPages.bench.title,
    description: longTailPages.bench.description,
    file: "app/memorial-bench-plaque-qr-code/page.tsx",
    changeFrequency: "monthly",
    priority: 0.7,
    index: true,
    inSitemap: true,
  },
  home: {
    path: longTailPages.home.path,
    title: longTailPages.home.title,
    description: longTailPages.home.description,
    file: "app/memorial-display-at-home/page.tsx",
    changeFrequency: "monthly",
    priority: 0.7,
    index: true,
    inSitemap: true,
  },
  sibling: {
    path: longTailPages.sibling.path,
    title: longTailPages.sibling.title,
    description: longTailPages.sibling.description,
    file: "app/memorial-qr-for-a-sibling/page.tsx",
    changeFrequency: "monthly",
    priority: 0.7,
    index: true,
    inSitemap: true,
  },
  grandparents: {
    path: longTailPages.grandparents.path,
    title: longTailPages.grandparents.title,
    description: longTailPages.grandparents.description,
    file: "app/memorial-qr-for-grandparents/page.tsx",
    changeFrequency: "monthly",
    priority: 0.7,
    index: true,
    inSitemap: true,
  },
  cemetery: {
    path: longTailPages.cemetery.path,
    title: longTailPages.cemetery.title,
    description: longTailPages.cemetery.description,
    file: "app/cemetery-qr-code/page.tsx",
    changeFrequency: "monthly",
    priority: 0.7,
    index: true,
    inSitemap: true,
  },
  farAway: {
    path: longTailPages.farAway.path,
    title: longTailPages.farAway.title,
    description: longTailPages.farAway.description,
    file: "app/memorial-page-for-family-far-away/page.tsx",
    changeFrequency: "monthly",
    priority: 0.7,
    index: true,
    inSitemap: true,
  },
  adPlaqueGift: {
    path: adLandingPages.plaqueGift.path,
    title: adLandingPages.plaqueGift.title,
    description: adLandingPages.plaqueGift.description,
    file: "app/ads/memorial-qr-plaque-gift/page.tsx",
    changeFrequency: "monthly",
    priority: 0.1,
    index: false,
    inSitemap: false,
  },
  adPetPlaque: {
    path: adLandingPages.petPlaque.path,
    title: adLandingPages.petPlaque.title,
    description: adLandingPages.petPlaque.description,
    file: "app/ads/pet-memorial-qr-plaque/page.tsx",
    changeFrequency: "monthly",
    priority: 0.1,
    index: false,
    inSitemap: false,
  },
  adPartner: {
    path: adLandingPages.partner.path,
    title: adLandingPages.partner.title,
    description: adLandingPages.partner.description,
    file: "app/ads/funeral-home-partner/page.tsx",
    changeFrequency: "monthly",
    priority: 0.1,
    index: false,
    inSitemap: false,
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
