"use server"

import { stripe } from "@/lib/stripe"
import { createServerSupabaseClient } from "@/lib/supabase"

export type CheckoutItem = {
  name: string
  description: string
  price: number
  quantity: number
}

export type ShippingInfo = {
  name: string
  address: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
}

export async function createCheckoutSession(
  items: CheckoutItem[],
  shipping: ShippingInfo,
  metadata: Record<string, string> = {},
) {
  // Check if Stripe is properly initialized
  if (!stripe) {
    throw new Error("Stripe has not been initialized. Check your environment variables.")
  }

  try {
    // Calculate total amount
    const amount = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

    // Add shipping cost
    const shippingCost = 499 // $4.99 in cents
    const totalAmount = amount + shippingCost

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: item.description,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: shippingCost,
              currency: "usd",
            },
            display_name: "Standard Shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/create-account?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?canceled=true`,
      customer_email: metadata.email,
      metadata: {
        ...metadata,
        shipping_name: shipping.name,
        shipping_address_line1: shipping.address.line1,
        shipping_address_line2: shipping.address.line2 || "",
        shipping_address_city: shipping.address.city,
        shipping_address_state: shipping.address.state,
        shipping_address_postal_code: shipping.address.postal_code,
        shipping_address_country: shipping.address.country,
      },
    })

    // Store the checkout session in the database
    const supabase = createServerSupabaseClient()
    await supabase.from("orders").insert({
      stripe_session_id: session.id,
      status: "pending",
      amount: totalAmount / 100, // Convert back to dollars
      metadata: {
        items,
        shipping,
        ...metadata,
      },
    })

    return { sessionId: session.id, sessionUrl: session.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw new Error("Failed to create checkout session")
  }
}

export async function getCheckoutSession(sessionId: string) {
  // Check if Stripe is properly initialized
  if (!stripe) {
    throw new Error("Stripe has not been initialized. Check your environment variables.")
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "line_items"],
    })

    return session
  } catch (error) {
    console.error("Error retrieving checkout session:", error)
    throw new Error("Failed to retrieve checkout session")
  }
}

export async function updateOrderWithPaymentStatus(sessionId: string, status: string) {
  try {
    const supabase = createServerSupabaseClient()

    await supabase.from("orders").update({ status }).eq("stripe_session_id", sessionId)

    return { success: true }
  } catch (error) {
    console.error("Error updating order status:", error)
    throw new Error("Failed to update order status")
  }
}
