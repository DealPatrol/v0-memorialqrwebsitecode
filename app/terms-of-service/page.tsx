import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
          <h1 className="text-3xl font-serif mb-6">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-medium mb-3">1. Introduction</h2>
              <p>
                Welcome to Memorial QR. These Terms of Service govern your use of our website and services. By accessing
                or using our website, you agree to be bound by these Terms. If you disagree with any part of the terms,
                you may not access the website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-3">2. Definitions</h2>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  <strong>"Service"</strong> refers to the Memorial QR website and all services provided through it.
                </li>
                <li>
                  <strong>"User"</strong> refers to the person who accesses or uses the Service.
                </li>
                <li>
                  <strong>"Content"</strong> refers to all text, images, videos, audio, and other materials uploaded to
                  or displayed on the Service.
                </li>
                <li>
                  <strong>"QR Code"</strong> refers to the physical or digital QR code provided as part of our Service.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-3">3. Account Registration</h2>
              <p>
                To use certain features of the Service, you may be required to register for an account. You agree to
                provide accurate, current, and complete information during the registration process and to update such
                information to keep it accurate, current, and complete.
              </p>
              <p className="mt-2">
                You are responsible for safeguarding the password that you use to access the Service and for any
                activities or actions under your password. We encourage you to use a strong password (a password that
                uses a combination of upper and lower case letters, numbers, and symbols) with your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-3">4. User Content</h2>
              <p>
                Our Service allows you to post, link, store, share and otherwise make available certain information,
                text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post
                on or through the Service, including its legality, reliability, and appropriateness.
              </p>
              <p className="mt-2">
                By posting Content on or through the Service, you represent and warrant that: (i) the Content is yours
                (you own it) and/or you have the right to use it and the right to grant us the rights and license as
                provided in these Terms, and (ii) that the posting of your Content on or through the Service does not
                violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any
                person or entity.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-3">5. QR Codes and Memorial Pages</h2>
              <p>
                The QR codes we provide are designed to be durable and weather-resistant, but we cannot guarantee their
                longevity in all environmental conditions. We are not responsible for damage to QR codes caused by
                vandalism, extreme weather, or improper installation.
              </p>
              <p className="mt-2">
                Memorial pages will be hosted according to the plan you purchase. Premium and Legacy plans include
                lifetime hosting, while the Essential plan includes 5 years of hosting. After the initial hosting period
                for the Essential plan, you may renew for an additional fee.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-3">6. Payments and Refunds</h2>
              <p>
                We offer various payment options for our services. All payments are processed securely through our
                payment processors. Prices for our services are subject to change without notice.
              </p>
              <p className="mt-2">
                We offer a 30-day money-back guarantee on all our plans. If you are not satisfied with our service, you
                may request a refund within 30 days of your purchase. Refunds will be processed through the original
                payment method.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-3">7. Intellectual Property</h2>
              <p>
                The Service and its original content (excluding Content provided by users), features, and functionality
                are and will remain the exclusive property of Memorial QR and its licensors. The Service is protected by
                copyright, trademark, and other laws of both the United States and foreign countries.
              </p>
              <p className="mt-2">
                Our trademarks and trade dress may not be used in connection with any product or service without the
                prior written consent of Memorial QR.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-3">8. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice
                or liability, under our sole discretion, for any reason whatsoever and without limitation, including but
                not limited to a breach of the Terms.
              </p>
              <p className="mt-2">
                If you wish to terminate your account, you may simply discontinue using the Service, or contact us to
                request account deletion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-3">9. Limitation of Liability</h2>
              <p>
                In no event shall Memorial QR, nor its directors, employees, partners, agents, suppliers, or affiliates,
                be liable for any indirect, incidental, special, consequential or punitive damages, including without
                limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your
                access to or use of or inability to access or use the Service; (ii) any conduct or content of any third
                party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or
                alteration of your transmissions or content, whether based on warranty, contract, tort (including
                negligence) or any other legal theory, whether or not we have been informed of the possibility of such
                damage.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-3">10. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What
                constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-3">11. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:{" "}
                <a href="mailto:colecollins763@gmail.com" className="text-blue-600 hover:underline">
                  colecollins763@gmail.com
                </a>{" "}
                or call us at (256) 595-3354. Our mailing address is: 12476 CR 747, Hanceville, AL 35077.
              </p>
            </section>
          </div>

          <div className="mt-12 text-center">
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
