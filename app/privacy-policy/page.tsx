import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
          <h1 className="text-3xl font-serif mb-6">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-medium mb-3">1. Introduction</h2>
              <p>
                Welcome to Memorial QR. We respect your privacy and are committed to protecting your personal data. This
                privacy policy will inform you about how we look after your personal data when you visit our website and
                tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-3">2. The Data We Collect</h2>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped
                together as follows:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  <strong>Identity Data</strong> includes first name, last name, username or similar identifier.
                </li>
                <li>
                  <strong>Contact Data</strong> includes billing address, email address and telephone numbers.
                </li>
                <li>
                  <strong>Financial Data</strong> includes payment card details.
                </li>
                <li>
                  <strong>Transaction Data</strong> includes details about payments to and from you and other details of
                  products and services you have purchased from us.
                </li>
                <li>
                  <strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type
                  and version, time zone setting and location, browser plug-in types and versions, operating system and
                  platform, and other technology on the devices you use to access this website.
                </li>
                <li>
                  <strong>Memorial Data</strong> includes photos, videos, stories, and other content you upload to
                  create memorial pages.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-3">3. How We Use Your Data</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal
                data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>
                  Where it is necessary for our legitimate interests and your interests and fundamental rights do not
                  override those interests.
                </li>
                <li>Where we need to comply with a legal obligation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-3">4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally
                lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to
                your personal data to those employees, agents, contractors and other third parties who have a business
                need to know.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-3">5. Data Retention</h2>
              <p>
                We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we
                collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or
                reporting requirements.
              </p>
              <p className="mt-2">
                Memorial content will be retained according to the plan you purchase. Premium and Legacy plans include
                lifetime hosting, while the Essential plan includes 5 years of hosting.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-3">6. Your Legal Rights</h2>
              <p>
                Under certain circumstances, you have rights under data protection laws in relation to your personal
                data, including the right to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Request access to your personal data.</li>
                <li>Request correction of your personal data.</li>
                <li>Request erasure of your personal data.</li>
                <li>Object to processing of your personal data.</li>
                <li>Request restriction of processing your personal data.</li>
                <li>Request transfer of your personal data.</li>
                <li>Right to withdraw consent.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-3">7. Third-Party Links</h2>
              <p>
                This website may include links to third-party websites, plug-ins and applications. Clicking on those
                links or enabling those connections may allow third parties to collect or share data about you. We do
                not control these third-party websites and are not responsible for their privacy statements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-3">8. Cookies</h2>
              <p>
                We use cookies to distinguish you from other users of our website, remember your preferences, and
                provide you with a good experience when you browse our website. You can set your browser to refuse all
                or some browser cookies, or to alert you when websites set or access cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-3">9. Changes to the Privacy Policy</h2>
              <p>
                We may update our privacy policy from time to time. We will notify you of any changes by posting the new
                privacy policy on this page and updating the "Last Updated" date at the top of this privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-3">10. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at:{" "}
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
