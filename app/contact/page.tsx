import type { Metadata } from "next"
import { ContactClient } from "./contact-client"

export const metadata: Metadata = {
  title: "Contact Us - 24/7 Memorial Support | Memorial QR",
  description:
    "Get help creating your digital memorial. Contact our compassionate support team at 256-595-3354 or support@memorialsQR.com. Available 24/7 with 2-hour response time.",
  keywords:
    "memorial support, contact memorial QR, memorial help, customer service, memorial assistance, technical support",
  openGraph: {
    title: "Contact Memorial QR - 24/7 Support Available",
    description:
      "Our compassionate team is here to help you create the perfect memorial. Phone: 256-595-3354 | Email: support@memorialsQR.com",
    type: "website",
    url: "https://memorialsqr.com/contact",
    images: [
      {
        url: "https://memorialsqr.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Memorial QR Support",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Memorial QR - We're Here to Help",
    description: "24/7 support • 2-hour response • Phone & email available",
    images: ["https://memorialsqr.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://memorialsqr.com/contact",
  },
}

export default function ContactPage() {
  return <ContactClient />
}
