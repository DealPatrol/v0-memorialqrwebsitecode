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
              Memorial QR provides digital memorial services including online memorial pages and QR code products
              (plaques, tags, stones, and accessories) to honor deceased individuals and pets. All products include a
              one-time purchase price plus a monthly website hosting fee of $4.99.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">User Responsibilities</h2>
            <p className="text-gray-700 mb-4">
              You are responsible for providing accurate information and ensuring you have the right to create memorials
              for the individuals or pets represented. You must maintain accurate payment information for monthly
              hosting fees.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Payment Terms</h2>
            <p className="text-gray-700 mb-4">
              Payment is required at the time of order for physical products. Monthly hosting fees of $4.99 will be
              charged automatically to maintain your digital memorial website. We offer a 30-day money-back guarantee
              for physical products. Monthly hosting fees are non-refundable but can be canceled at any time.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Shipping and Delivery</h2>
            <p className="text-gray-700 mb-4">
              Physical memorial products ship within 3-5 business days. Free shipping is included on all orders within
              the United States. International shipping rates apply for orders outside the US.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Digital Memorial Content</h2>
            <p className="text-gray-700 mb-4">
              You retain ownership of all photos, videos, and content uploaded to your memorial pages. Memorial QR has
              the right to host and display this content as part of the memorial service. Content must comply with our
              acceptable use policy and must not include illegal, offensive, or inappropriate material.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Prohibited Uses</h2>
            <p className="text-gray-700 mb-4">
              You may not use our service for any unlawful purpose or to create memorials without proper authorization.
              You may not upload content that infringes on intellectual property rights, contains malware, or violates
              privacy laws.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cancellation and Refunds</h2>
            <p className="text-gray-700 mb-4">
              Physical products can be returned within 30 days for a full refund. Monthly hosting subscriptions can be
              canceled at any time through your account dashboard. Upon cancellation, your memorial website will remain
              active until the end of your current billing period.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              Memorial QR shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
              Our total liability shall not exceed the amount paid for services in the past 12 months.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these terms at any time. Continued use of our services constitutes
              acceptance of modified terms. We will notify users of significant changes via email.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-4">
              Questions about these Terms should be sent to{" "}
              <Link
                href={`mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL || "support@memorialqr.com"}`}
                className="text-orange-600 hover:underline"
              >
                {process.env.NEXT_PUBLIC_ADMIN_EMAIL || "support@memorialqr.com"}
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
