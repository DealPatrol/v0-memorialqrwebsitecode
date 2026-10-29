import { BuyerIntentView } from "@/components/buyer-intent-view"
import { buyerIntentPages } from "@/lib/buyer-intent"
import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { pageMetadata, publicPages } from "@/lib/seo"
import { formatUsd } from "@/lib/site"

const price = formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)

export const metadata = pageMetadata(publicPages.petQr)

export default function PetQrPage() {
  return (
    <BuyerIntentView
      page={buyerIntentPages.pet}
      digitalOffer={{
        href: "/pet-digital-memorial-qr",
        note: `You can order a pet memorial QR code today for ${price}. We email a PNG and the page. Nothing is shipped. Hosting for ${HOSTING_INCLUDED_YEARS} years is included. The pet QR plaque on this page is still coming soon.`,
        linkLabel: "Pet memorial QR code",
      }}
    />
  )
}
