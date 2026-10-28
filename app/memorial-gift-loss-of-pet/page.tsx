import { BuyerIntentView } from "@/components/buyer-intent-view"
import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import { giftIntentList, giftIntentPages } from "@/lib/gift-intent"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { pageMetadata, publicPages } from "@/lib/seo"
import { formatUsd } from "@/lib/site"

const page = giftIntentPages.pet
const price = formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)

export const metadata = pageMetadata(publicPages.petGift)

export default function PetGiftPage() {
  return (
    <BuyerIntentView
      page={page}
      related={giftIntentList.filter((item) => item.id !== page.id)}
      relatedHeading="Other remembrance gifts"
      digitalOffer={{
        href: "/pet-digital-memorial-qr",
        note: `The gift you can order today is a digital memorial page for ${price}. We email a PNG and the page. Nothing is shipped. Hosting for ${HOSTING_INCLUDED_YEARS} years is included. The Pet Memorial QR Plaque is not part of that order.`,
        linkLabel: "Pet memorial QR code",
      }}
    />
  )
}
