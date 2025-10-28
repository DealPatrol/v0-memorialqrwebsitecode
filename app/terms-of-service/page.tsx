import Link from "next/link"
import { Header } from "@/components/header"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 2024</p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Acceptance of Terms</h2>
            <p className="text-foreground/80 mb-4">
              By using Memorial QR services, you agree to be bound by these Terms of Service and all applicable laws and
              regulations.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Service Description</h2>
            <p className="text-foreground/80 mb-4">
              Memorial QR provides digital memorial services including online memorial pages and QR code plaques to
              honor deceased individuals.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">User Responsibilities</h2>
            <p className="text-foreground/80 mb-4">
              You are responsible for providing accurate information and ensuring you have the right to create memorials
              for the individuals represented.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Payment Terms</h2>
            <p className="text-foreground/80 mb-4">
              Payment is required at the time of order. We offer a 30-day money-back guarantee for our services.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Prohibited Uses</h2>
            <p className="text-foreground/80 mb-4">
              You may not use our service for any unlawful purpose or to create memorials without proper authorization.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-foreground/80 mb-4">
              Memorial QR shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Contact Information</h2>
            <p className="text-foreground/80 mb-4">
              Questions about these Terms should be sent to{" "}
              <Link href="mailto:legal@memorialqr.com" className="text-primary hover:underline">
                legal@memorialqr.com
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card text-card-foreground py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Memorial QR</h3>
              <p className="text-muted-foreground text-sm">
                Honoring memories with digital memorials that last forever.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/how-it-works" className="hover:text-foreground transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/browse-memorials" className="hover:text-foreground transition-colors">
                    Sample Memorials
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Memorial QR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
