import { Header } from "@/components/header"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Memorial QR",
  description: "Our privacy policy explains how Memorial QR protects your data and respects your privacy.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-black mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none text-zinc-700">
          <p className="text-sm text-zinc-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">1. Introduction</h2>
          <p>
            Memorial QR ("we," "us," or "our") operates the Memorial QR website and services. This Privacy Policy explains our data collection, use, and protection practices.
          </p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">2. Information We Collect</h2>
          <p>We collect information you provide directly, including:</p>
          <ul>
            <li>Account information (name, email, phone)</li>
            <li>Memorial content (photos, videos, text)</li>
            <li>Payment information (processed securely)</li>
            <li>Communications with our support team</li>
          </ul>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">3. How We Use Your Information</h2>
          <p>We use collected information to:</p>
          <ul>
            <li>Create and maintain your memorial</li>
            <li>Process payments and provide services</li>
            <li>Send service updates and support</li>
            <li>Improve our platform and user experience</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">4. Data Security</h2>
          <p>
            We implement industry-standard security measures including SSL encryption, secure databases, and regular security audits. Your memorial data is protected with the same security as financial institutions.
          </p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">5. Third-Party Services</h2>
          <p>
            We use trusted third parties for payment processing, cloud hosting, and analytics. These providers are contractually obligated to protect your data.
          </p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Request corrections to your information</li>
            <li>Request deletion of your account</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">7. Contact Us</h2>
          <p>
            For privacy inquiries, contact us at privacy@memorialqr.com or by mail at the address provided on our contact page.
          </p>
        </div>
      </div>
    </div>
  )
}
