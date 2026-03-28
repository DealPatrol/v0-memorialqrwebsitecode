"use server"

import { stripe } from "@/lib/stripe"
import { PACKAGES, ADDONS } from "@/lib/products"

interface CheckoutData {
  packageId: string
  addonIds: string[]
  plaqueColor: string
  boxPersonalization?: string
  customerEmail: string
  customerName: string
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
}

export async function createCheckoutSession(data: CheckoutData) {
  const pkg = PACKAGES[data.packageId]
  if (!pkg) {
    throw new Error(`Package "${data.packageId}" not found`)
  }

  // Build line items
  const lineItems: Array<{
    price_data: {
      currency: string
      product_data: {
        name: string
        description: string
      }
      unit_amount: number
    }
    quantity: number
  }> = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: pkg.name,
          description: `${pkg.description} - Includes ${pkg.videos} videos, ${pkg.audio} audio files, ${pkg.photos} photos`,
        },
        unit_amount: pkg.priceInCents,
      },
      quantity: 1,
    },
  ]

  // Add selected add-ons
  for (const addonId of data.addonIds) {
    const addon = ADDONS[addonId]
    if (addon) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: addon.name,
            description: addon.description,
          },
          unit_amount: addon.priceInCents,
        },
        quantity: 1,
      })
    }
  }

  // Create checkout session with embedded mode
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: lineItems,
    mode: "payment",
    customer_email: data.customerEmail,
    metadata: {
      packageId: data.packageId,
      addonIds: data.addonIds.join(","),
      plaqueColor: data.plaqueColor,
      boxPersonalization: data.boxPersonalization || "",
      customerName: data.customerName,
      shippingLine1: data.shippingAddress.line1,
      shippingLine2: data.shippingAddress.line2 || "",
      shippingCity: data.shippingAddress.city,
      shippingState: data.shippingAddress.state,
      shippingPostalCode: data.shippingAddress.postal_code,
    },
    shipping_address_collection: {
      allowed_countries: ["US"],
    },
  })

  return {
    clientSecret: session.client_secret,
    sessionId: session.id,
  }
}

export async function getCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return {
    status: session.status,
    paymentStatus: session.payment_status,
    customerEmail: session.customer_email,
    metadata: session.metadata,
    amountTotal: session.amount_total,
  }
}
