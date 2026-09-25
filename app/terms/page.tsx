import { Header } from "@/components/header"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Memorial QR",
  description: "Memorial QR Terms of Service - read our full terms and conditions.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-black mb-8">Terms of Service</h1>
        <div className="prose prose-lg max-w-none text-zinc-700">
          <p className="text-sm text-zinc-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing and using the Memorial QR service, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">2. Use of Service</h2>
          <p>
            Memorial QR is provided for creating and sharing digital memorials. Users agree not to use the service for unlawful purposes or in violation of any applicable laws.
          </p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">3. User Content</h2>
          <p>
            You retain all rights to content you upload. By uploading, you grant Memorial QR a worldwide license to store, display, and share your memorial content according to your privacy settings.
          </p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">4. Payment Terms</h2>
          <p>
            Payment is required to create memorials. We offer a 30-day money-back guarantee if you're unsatisfied. Refunds must be requested within 30 days of purchase.
          </p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">5. Limitations of Liability</h2>
          <p>
            Memorial QR is provided "as is" without warranties. We're not liable for indirect, incidental, or consequential damages. Our liability is limited to the amount paid for services.
          </p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">6. Termination</h2>
          <p>
            We reserve the right to terminate accounts that violate these terms. Your memorial will be preserved, but access may be restricted.
          </p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">7. Contact</h2>
          <p>
            For questions about these terms, contact legal@memorialqr.com.
          </p>
        </div>
      </div>
    </div>
  )
}
