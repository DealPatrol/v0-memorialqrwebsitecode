"use client"

import Script from "next/script"

// Organization Schema - appears in Google Knowledge Panel
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://memorialsqr.com/#organization",
    name: "Memorial QR",
    url: "https://memorialsqr.com",
    logo: {
      "@type": "ImageObject",
      url: "https://memorialsqr.com/logo.png",
      width: 512,
      height: 512,
    },
    image: "https://memorialsqr.com/og-image.jpg",
    description:
      "Memorial QR creates beautiful QR code memorial plaques that connect visitors to photos, videos, and stories of your loved ones. Lifetime hosting included.",
    foundingDate: "2024",
    founders: [
      {
        "@type": "Person",
        name: "Memorial QR Team",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+1-256-595-3354",
        contactType: "customer service",
        email: "support@memorialsqr.com",
        availableLanguage: ["English"],
        areaServed: "US",
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "00:00",
          closes: "23:59",
        },
      },
    ],
    sameAs: [
      "https://www.facebook.com/memorialqr",
      "https://www.instagram.com/memorialqr",
      "https://twitter.com/memorialqr",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "247",
      bestRating: "5",
      worstRating: "1",
    },
    priceRange: "$39.89 - $249",
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// WebSite Schema - enables sitelinks search box in Google
export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://memorialsqr.com/#website",
    url: "https://memorialsqr.com",
    name: "Memorial QR",
    description: "Create beautiful QR code memorial plaques with lifetime digital hosting",
    publisher: {
      "@id": "https://memorialsqr.com/#organization",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://memorialsqr.com/browse-memorials?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-US",
  }

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Product Schema - shows price, availability, ratings in search
export function ProductSchema({
  name = "Memorial QR Plaque",
  description = "Weather-resistant QR code memorial plaque with lifetime digital memorial page",
  price = 39.89,
  image = "https://memorialsqr.com/og-image.jpg",
  sku = "MQR-PLAQUE-001",
}: {
  name?: string
  description?: string
  price?: number
  image?: string
  sku?: string
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `https://memorialsqr.com/products/memorial-qr-plaque#product`,
    name,
    description,
    image: [image],
    sku,
    mpn: sku,
    brand: {
      "@type": "Brand",
      name: "Memorial QR",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Memorial QR",
    },
    offers: {
      "@type": "Offer",
      url: "https://memorialsqr.com/pricing",
      priceCurrency: "USD",
      price: price.toFixed(2),
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@id": "https://memorialsqr.com/#organization",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "USD",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "US",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "US",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "247",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        author: {
          "@type": "Person",
          name: "Sarah M.",
        },
        reviewBody: "Beautiful quality and the digital memorial page is perfect for our family.",
        datePublished: "2024-11-15",
      },
    ],
  }

  return (
    <Script
      id="product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// FAQ Schema - shows FAQ rich snippets in search
export function FAQSchema({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  )
}

// BreadcrumbList Schema - shows breadcrumb trail in search results
export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// LocalBusiness Schema - for local SEO
export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://memorialsqr.com/#localbusiness",
    name: "Memorial QR",
    image: "https://memorialsqr.com/og-image.jpg",
    url: "https://memorialsqr.com",
    telephone: "+1-256-595-3354",
    email: "support@memorialsqr.com",
    priceRange: "$39 - $249",
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 34.7304,
      longitude: -86.5861,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    sameAs: ["https://www.facebook.com/memorialqr", "https://www.instagram.com/memorialqr"],
  }

  return (
    <Script
      id="localbusiness-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Service Schema - for service-based SEO
export function ServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://memorialsqr.com/#service",
    name: "Digital Memorial Creation Service",
    description:
      "Create beautiful QR code memorial plaques that connect visitors to photos, videos, and stories of your loved ones with lifetime hosting.",
    provider: {
      "@id": "https://memorialsqr.com/#organization",
    },
    serviceType: "Memorial Services",
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Memorial QR Products",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Digital Memorial Page",
            description: "Lifetime hosted memorial page with unlimited photos and videos",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "QR Code Memorial Plaque",
            description: "Weather-resistant aluminum plaque with custom QR code",
          },
        },
      ],
    },
  }

  return (
    <Script
      id="service-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// HowTo Schema - for how-it-works page
export function HowToSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Create a Digital Memorial with Memorial QR",
    description: "Learn how to create a lasting digital memorial in three simple steps",
    image: "https://memorialsqr.com/og-image.jpg",
    totalTime: "PT20M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "39.89",
    },
    step: [
      {
        "@type": "HowToStep",
        name: "Create Your Memorial",
        text: "Upload photos, videos, and stories to create a beautiful digital memorial page for your loved one.",
        image: "https://memorialsqr.com/step-1.jpg",
        url: "https://memorialsqr.com/how-it-works#step-1",
      },
      {
        "@type": "HowToStep",
        name: "Get Your QR Code",
        text: "Receive a custom QR code that links directly to your memorial page, ready for your plaque.",
        image: "https://memorialsqr.com/step-2.jpg",
        url: "https://memorialsqr.com/how-it-works#step-2",
      },
      {
        "@type": "HowToStep",
        name: "Share Their Story",
        text: "Visitors can scan the QR code to view photos, videos, and memories, keeping their legacy alive.",
        image: "https://memorialsqr.com/step-3.jpg",
        url: "https://memorialsqr.com/how-it-works#step-3",
      },
    ],
  }

  return (
    <Script id="howto-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  )
}
