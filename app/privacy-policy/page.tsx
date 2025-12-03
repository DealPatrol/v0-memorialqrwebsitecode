import Link from "next/link"
import { Header } from "@/components/header"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: January 2025</p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Introduction</h2>
            <p className="text-gray-700 mb-4">
              Memorial QR ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when you use our memorial creation and
              management services at memorialsqr.com.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect information you provide directly to us when creating memorial profiles, including names, dates,
              photos, biographical information, and contact details.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Personal Information:</strong> Email address, name, phone number, and billing information for
              order processing.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Memorial Content:</strong> Photos, videos, audio recordings, biographical information, dates,
              locations, and other memorial-related content you upload.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Account Information:</strong> If you sign in using Google or Facebook, we receive basic profile
              information including your name, email address, and profile picture as permitted by those services.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Usage Data:</strong> Information about how you access and use our services, including IP address,
              browser type, pages visited, and time spent on pages.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use the information to create and maintain digital memorials, process orders, provide customer support,
              and send important updates about your memorial.
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Create, host, and manage digital memorial pages</li>
              <li>Process payments and fulfill orders for physical products</li>
              <li>Send you QR codes and access links to your memorials</li>
              <li>Provide customer support and respond to your inquiries</li>
              <li>Improve our services and develop new features</li>
              <li>Send important service updates and notifications</li>
              <li>Prevent fraud and ensure platform security</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Third-Party Authentication</h2>
            <p className="text-gray-700 mb-4">
              We offer sign-in options through Google and Facebook. When you use these services:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>We receive only the information you authorize (name, email, profile picture)</li>
              <li>Your login credentials remain with Google/Facebook - we never see your passwords</li>
              <li>You can revoke our access at any time through your Google or Facebook account settings</li>
              <li>We use this information solely to create and authenticate your Memorial QR account</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information Sharing</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or rent your personal information to third parties. Memorial content is shared only
              according to the privacy settings you choose.
            </p>
            <p className="text-gray-700 mb-4">We may share information with:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>
                <strong>Service Providers:</strong> Payment processors, hosting providers, and email services that help
                us operate our platform
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety
              </li>
              <li>
                <strong>Public Memorials:</strong> Content you designate as public will be visible to anyone with the
                memorial link
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate security measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction.
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Encrypted data transmission using SSL/TLS</li>
              <li>Secure cloud storage with regular backups</li>
              <li>Access controls and authentication requirements</li>
              <li>Regular security audits and monitoring</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your information for as long as your memorial remains active. Memorials are designed to be
              permanent tributes, but you can request deletion at any time through your account settings or by
              contacting us.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Your Data Rights and Deletion</h2>
            <p className="text-gray-700 mb-4">
              You have the right to access, update, or delete your personal information. To exercise these rights:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>
                <strong>Access Your Data:</strong> Log into your account to view and download your information
              </li>
              <li>
                <strong>Update Your Data:</strong> Edit your profile and memorial content directly through your
                dashboard
              </li>
              <li>
                <strong>Delete Your Data:</strong> Request account deletion by emailing{" "}
                <Link href="mailto:privacy@memorialqr.com" className="text-orange-600 hover:underline">
                  privacy@memorialqr.com
                </Link>{" "}
                with the subject "Data Deletion Request"
              </li>
            </ul>
            <p className="text-gray-700 mb-4">Upon receiving a deletion request, we will:</p>
            <ol className="list-decimal pl-6 text-gray-700 mb-4">
              <li>Verify your identity</li>
              <li>Delete your account and all associated personal information within 30 days</li>
              <li>Remove all memorial content you created</li>
              <li>Notify you once the deletion is complete</li>
            </ol>
            <p className="text-gray-700 mb-4">
              Note: Some information may be retained in backup systems for up to 90 days for security and legal
              compliance purposes.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar technologies to enhance your experience, analyze usage, and maintain
              authentication sessions. You can control cookies through your browser settings.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our services are not directed to children under 13. We do not knowingly collect personal information from
              children. If you believe a child has provided us with personal information, please contact us.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy periodically. We will notify you of significant changes by email or
              through a notice on our website. Your continued use of our services after changes constitutes acceptance
              of the updated policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy, please contact us at{" "}
              <Link href="mailto:privacy@memorialqr.com" className="text-orange-600 hover:underline">
                privacy@memorialqr.com
              </Link>
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Memorial QR</strong>
              <br />
              Privacy Inquiries
              <br />
              Email: privacy@memorialqr.com
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
