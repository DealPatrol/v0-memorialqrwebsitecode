"use server"

import { z } from "zod"
import { getSquareClient } from "@/lib/square"
import { randomUUID } from "crypto"

// Validation schemas
const CreateOrderSchema = z.object({
  customerEmail: z.string().email("Invalid email address"),
  customerName: z.string().min(1, "Name is required"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  shippingAddress: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid zip code"),
    country: z.string().default("US"),
  }),
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().positive(),
    }),
  ),
})

const PaymentIntentSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("usd"),
  customerEmail: z.string().email("Invalid email address"),
  orderId: z.string().min(1, "Order ID is required"),
})

const CheckoutSessionSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  successUrl: z.string().url("Invalid success URL"),
  cancelUrl: z.string().url("Invalid cancel URL"),
})

const ProcessPaymentSchema = z.object({
  paymentMethodId: z.string().min(1, "Payment method ID is required"),
  paymentIntentId: z.string().min(1, "Payment intent ID is required"),
  orderId: z.string().min(1, "Order ID is required"),
})

const RefundPaymentSchema = z.object({
  paymentIntentId: z.string().min(1, "Payment intent ID is required"),
  amount: z.number().positive("Refund amount must be positive").optional(),
  reason: z.enum(["duplicate", "fraudulent", "requested_by_customer"]).default("requested_by_customer"),
})

// Types
export type CreateOrderData = z.infer<typeof CreateOrderSchema>
export type PaymentIntentData = z.infer<typeof PaymentIntentSchema>
export type CheckoutSessionData = z.infer<typeof CheckoutSessionSchema>
export type ProcessPaymentData = z.infer<typeof ProcessPaymentSchema>
export type RefundPaymentData = z.infer<typeof RefundPaymentSchema>

export interface OrderResult {
  success: boolean
  orderId?: string
  error?: string
}

export interface PaymentIntentResult {
  success: boolean
  clientSecret?: string
  paymentIntentId?: string
  error?: string
}

export interface CheckoutSessionResult {
  success: boolean
  sessionUrl?: string
  sessionId?: string
  error?: string
}

export interface PaymentResult {
  success: boolean
  paymentId?: string
  status?: string
  error?: string
}

export interface RefundResult {
  success: boolean
  refundId?: string
  amount?: number
  status?: string
  error?: string
}

// Create Order
export async function createOrder(data: CreateOrderData): Promise<OrderResult> {
  try {
    const validatedData = CreateOrderSchema.parse(data)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return {
      success: true,
      orderId,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      }
    }

    return {
      success: false,
      error: "Failed to create order. Please try again.",
    }
  }
}

// Create Payment Intent
export async function createPaymentIntent(data: PaymentIntentData): Promise<PaymentIntentResult> {
  try {
    const validatedData = PaymentIntentSchema.parse(data)
    await new Promise((resolve) => setTimeout(resolve, 800))
    const paymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const clientSecret = `${paymentIntentId}_secret_${Math.random().toString(36).substr(2, 9)}`

    return {
      success: true,
      clientSecret,
      paymentIntentId,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      }
    }

    return {
      success: false,
      error: "Failed to create payment intent. Please try again.",
    }
  }
}

// Create Checkout Session
export async function getCheckoutSession(data: CheckoutSessionData): Promise<CheckoutSessionResult> {
  try {
    const validatedData = CheckoutSessionSchema.parse(data)
    await new Promise((resolve) => setTimeout(resolve, 600))
    const sessionId = `cs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const sessionUrl = `https://checkout.example.com/pay/${sessionId}`

    return {
      success: true,
      sessionUrl,
      sessionId,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      }
    }

    return {
      success: false,
      error: "Failed to create checkout session. Please try again.",
    }
  }
}

// Process Payment
export async function processPayment(data: ProcessPaymentData): Promise<PaymentResult> {
  try {
    const validatedData = ProcessPaymentSchema.parse(data)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const status = Math.random() > 0.1 ? "succeeded" : "failed"

    if (status === "failed") {
      return {
        success: false,
        error: "Payment failed. Please check your payment method and try again.",
      }
    }

    return {
      success: true,
      paymentId,
      status,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      }
    }

    return {
      success: false,
      error: "Failed to process payment. Please try again.",
    }
  }
}

// Process Square Payment
export async function processSquarePayment(data: {
  sourceId: string
  amount: number
  currency?: string
  orderId: string
}): Promise<PaymentResult> {
  try {
    const squareClient = getSquareClient()
    const { paymentsApi } = squareClient

    const payment = await paymentsApi.createPayment({
      sourceId: data.sourceId,
      amountMoney: {
        amount: BigInt(Math.round(data.amount * 100)),
        currency: data.currency || "USD",
      },
      idempotencyKey: randomUUID(),
      locationId: process.env.SQUARE_LOCATION_ID!,
      referenceId: data.orderId,
    })

    if (payment.result.payment?.status === "COMPLETED") {
      return {
        success: true,
        paymentId: payment.result.payment.id,
        status: "succeeded",
      }
    } else {
      return {
        success: false,
        error: "Payment was not completed",
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to process payment",
    }
  }
}

// Refund Payment
export async function refundPayment(data: RefundPaymentData): Promise<RefundResult> {
  try {
    const validatedData = RefundPaymentSchema.parse(data)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const refundId = `re_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const amount = validatedData.amount || 11999
    const status = "succeeded"

    return {
      success: true,
      refundId,
      amount,
      status,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      }
    }

    return {
      success: false,
      error: "Failed to process refund. Please try again.",
    }
  }
}
