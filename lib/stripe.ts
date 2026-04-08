import "server-only"

import Stripe from "stripe"

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not set in environment variables")
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: "2024-11-20.acacia",
    })
  }
  return stripeInstance
}

// For backwards compatibility with existing code
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop: string | symbol) {
    const stripeClient = getStripe()
    const value = stripeClient[prop as keyof Stripe]
    if (typeof value === 'function') {
      return value.bind(stripeClient)
    }
    return value
  }
})
