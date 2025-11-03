import Link from "next/link"
import { Header } from "@/components/header"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: December 2024</p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By using Memorial QR services, you agree to be bound by these Terms of Service and all applicable laws and
              regulations.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Service Description</h2>
            <p className="text-gray-700 mb-4">
              Memorial QR provides digital memorial services including online memorial pages and QR code plaques to
              honor deceased individuals.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">User Responsibilities</h2>
            <p className="text-gray-700 mb-4">
              You are responsible for providing accurate information and ensuring you have the right to create memorials
              for the individuals represented.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Payment Terms</h2>
            <p className="text-gray-700 mb-4">
              Payment is required at the time of order. We offer a 30-day money-back guarantee for our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Prohibited Uses</h2>
            <p className="text-gray-700 mb-4">
              You may not use our service for any unlawful purpose or to create memorials without proper authorization.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              Memorial QR shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-4">
              Questions about these Terms should be sent to{" "}
              <Link href="mailto:legal@memorialqr.com" className="text-orange-600 hover:underline">
                legal@memorialqr.com
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Memorial QR</h3>
              <p className="text-gray-400 text-sm">Honoring memories with digital memorials that last forever.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/how-it-works" className="hover:text-white">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/browse-memorials" className="hover:text-white">
                    Sample Memorials
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/privacy-policy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Memorial QR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
