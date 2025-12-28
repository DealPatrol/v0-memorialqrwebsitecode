import { loadStripe } from "@stripe/stripe-js"
import Stripe from "stripe"

// Initialize Stripe on the server side with proper error handling
let stripe: Stripe | null = null

// Only initialize if the API key is available
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  })
}

// Initialize Stripe on the client side
let stripePromise: Promise<any> | null = null
export const getStripe = () => {
  if (!stripePromise && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

export { stripe }
