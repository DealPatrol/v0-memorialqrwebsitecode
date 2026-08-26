import Link from "next/link"
import { Header } from "@/components/header"

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Returns & Refunds</h1>
          <p className="text-gray-600 mb-8">Last updated: May 2026</p>

          <div className="prose prose-lg max-w-none text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Return Window</h2>
            <p className="mb-4">
              You may request a return within 30 days of delivery for eligible products in original condition.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Custom Items</h2>
            <p className="mb-4">
              Personalized and custom memorial products may not be eligible for return unless they arrive damaged or
              incorrect.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Refund Processing</h2>
            <p className="mb-4">
              Approved refunds are issued to the original payment method and typically post within 5-10 business days.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Start a Return</h2>
            <p className="mb-4">
              Please{" "}
              <Link href="/contact" className="text-orange-600 hover:underline">
                contact support
              </Link>{" "}
              with your order number and reason for return, and our team will guide you through next steps.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Need More Details?</h2>
            <p className="mb-4">
              You can also review our{" "}
              <Link href="/terms-of-service" className="text-orange-600 hover:underline">
                Terms of Service
              </Link>{" "}
              for additional policy information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
