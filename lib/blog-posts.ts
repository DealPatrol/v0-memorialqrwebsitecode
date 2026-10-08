import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"

const years = HOSTING_INCLUDED_YEARS

export const blogPosts = [
  {
    slug: "complete-guide-to-memorial-qr-codes",
    title: "The Complete Guide to Memorial QR Codes: Honoring Loved Ones in the Digital Age",
    excerpt:
      "Discover how QR code memorials are revolutionizing the way we remember and honor those we've lost. Learn everything about creating lasting digital tributes.",
    seoTitle: "QR Code Memorial Guide | MemorialsQR",
    seoDescription: `How a QR code memorial opens an online memorial page of photos and stories. ${years} years of hosting with every keepsake.`,
    category: "Guides",
    author: "Sarah Mitchell",
    date: "2024-12-15",
    readTime: "8 min read",
    image: "/images/92623621-9554-4f8b-a5be.jpeg",
    featured: true,
  },
  {
    slug: "pet-memorial-ideas-honoring-furry-friends",
    title: "25 Beautiful Pet Memorial Ideas to Honor Your Furry Friend",
    excerpt:
      "Losing a pet is heartbreaking. Explore creative and touching ways to memorialize your beloved companion and keep their memory close.",
    seoTitle: "Pet Memorial Page Ideas | MemorialsQR",
    seoDescription: `Ideas for a pet memorial page with photos and stories. Every QR keepsake includes ${years} years of hosting.`,
    category: "Pet Memorials",
    author: "Dr. Emily Rogers",
    date: "2024-12-10",
    readTime: "10 min read",
    image: "/images/41730040-9590-452b-80df.jpeg",
    featured: true,
  },
  {
    slug: "how-to-create-meaningful-digital-memorial",
    title: "How to Create a Meaningful Digital Memorial: Step-by-Step Guide",
    excerpt:
      "Creating a digital memorial doesn't have to be overwhelming. Follow our comprehensive guide to build a beautiful tribute that honors your loved one's legacy.",
    seoTitle: "Create a Digital Memorial | MemorialsQR",
    seoDescription: `Steps to create a digital memorial for a loved one on a memorial website. ${years} years of hosting with every keepsake.`,
    category: "Guides",
    author: "Michael Chen",
    date: "2024-12-05",
    readTime: "12 min read",
    image: "/images/7dc9e3be-9214-4273-b976.jpeg",
  },
  {
    slug: "grief-support-coping-with-loss",
    title: "Coping with Loss: A Guide to Grief Support and Healing",
    excerpt:
      "Grieving is a personal journey. Find helpful resources, coping strategies, and support for navigating the difficult path of losing someone you love.",
    seoTitle: "Coping with Loss | MemorialsQR",
    seoDescription: "A short guide to grief support while you build an online memorial page for someone you love.",
    category: "Grief Support",
    author: "Dr. Jennifer Walsh",
    date: "2024-12-01",
    readTime: "7 min read",
    image: "/images/5a066d02-9fa2-4039-8ac7.jpeg",
  },
  {
    slug: "memorial-headstone-plaques-buying-guide",
    title: "A Digital Memorial Page Instead of a Plaque",
    excerpt:
      "MemorialsQR sells QR keepsakes that open an online memorial page. Headstone tags and garden stones are not for sale.",
    seoTitle: "Digital Pages, Not Plaques | MemorialsQR",
    seoDescription: `MemorialsQR sells QR keepsakes that open an online memorial page. Each includes ${years} years of hosting.`,
    category: "Product Guides",
    author: "Robert Thompson",
    date: "2024-11-28",
    readTime: "9 min read",
    image: "/images/1e1eb652-cd3d-4fa5-86c5.jpeg",
  },
  {
    slug: "personalized-memorial-gifts-ideas",
    title: "20 Personalized Memorial Gifts That Bring Comfort and Remembrance",
    excerpt:
      "Looking for a thoughtful memorial gift? Discover meaningful, personalized options that help keep cherished memories alive and provide comfort during difficult times.",
    seoTitle: "Memorial Gift Ideas | MemorialsQR",
    seoDescription: "Thoughtful ways to remember someone, including a memorial website their family can share.",
    category: "Gift Ideas",
    author: "Lisa Anderson",
    date: "2024-11-25",
    readTime: "6 min read",
    image: "/images/30a0c26e-3bab-4662-9598.jpeg",
  },
  {
    slug: "qr-code-technology-memorials",
    title: "How QR Code Technology is Transforming Memorial Services",
    excerpt:
      "QR codes are bridging the physical and digital worlds in memorial services. Explore the innovative technology making memorials more accessible and interactive.",
    seoTitle: "QR Code Memorial Technology | MemorialsQR",
    seoDescription: "How a QR code memorial connects a visit to an online memorial page of photos and stories.",
    category: "Technology",
    author: "David Martinez",
    date: "2024-11-20",
    readTime: "8 min read",
    image: "/images/adc4c31b-2080-4d10-809a.jpeg",
  },
  {
    slug: "veteran-memorial-ideas",
    title: "Honoring Veterans: Memorial Ideas for Military Service Members",
    excerpt:
      "Veterans deserve special recognition. Discover meaningful ways to honor military service members with patriotic memorial tributes and digital memorials.",
    seoTitle: "Veteran Memorial Ideas | MemorialsQR",
    seoDescription: "Ways to honor a veteran's service on a digital memorial page with photos, stories, and messages.",
    category: "Special Tributes",
    author: "Colonel James Wilson (Ret.)",
    date: "2024-11-15",
    readTime: "10 min read",
    image: "/images/1e1eb652-cd3d-4fa5-86c5.jpeg",
  },
  {
    slug: "preserving-family-history-digital-memorials",
    title: "Preserving Family History Through Digital Memorials",
    excerpt:
      "Digital memorials are more than tributes—they're family archives. Learn how to preserve stories, photos, and memories for future generations.",
    seoTitle: "Preserve Family History | MemorialsQR",
    seoDescription: "Use a memorial website to keep family photos and stories together for the next generation.",
    category: "Family Legacy",
    author: "Margaret Sullivan",
    date: "2024-11-10",
    readTime: "11 min read",
    image: "/images/7dc9e3be-9214-4273-b976.jpeg",
  },
]

export type BlogPost = (typeof blogPosts)[0]
