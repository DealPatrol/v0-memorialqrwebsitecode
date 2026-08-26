import Link from "next/link"
import { Header } from "@/components/header"

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Shipping Information</h1>
          <p className="text-gray-600 mb-8">Last updated: May 2026</p>

          <div className="prose prose-lg max-w-none text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Processing Time</h2>
            <p className="mb-4">
              Orders are processed in 1-2 business days. Custom memorial products may require additional production time.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Domestic Shipping</h2>
            <p className="mb-4">
              Standard U.S. shipping typically arrives in 3-5 business days after your order has been processed.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">International Shipping</h2>
            <p className="mb-4">
              International delivery times vary by destination and customs processing requirements.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Tracking</h2>
            <p className="mb-4">
              You will receive a shipping confirmation email with tracking details once your order is fulfilled.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Need Help?</h2>
            <p className="mb-4">
              For shipping questions, visit our{" "}
              <Link href="/help" className="text-orange-600 hover:underline">
                Help Center
              </Link>{" "}
              or{" "}
              <Link href="/contact" className="text-orange-600 hover:underline">
                contact support
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
