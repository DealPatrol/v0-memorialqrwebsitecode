import { Header } from "@/components/header"
import { Shield, Lock, Eye, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Security & Trust | Memorial QR",
  description: "Learn about Memorial QR's security measures, compliance, and commitment to protecting your memorial data.",
}

export default function SecurityPage() {
  const securityMeasures = [
    {
      icon: Lock,
      title: "Encryption",
      description: "SSL/TLS encryption for all data in transit. AES-256 encryption for data at rest.",
    },
    {
      icon: Shield,
      title: "Authentication",
      description: "Multi-factor authentication, secure password requirements, and session management.",
    },
    {
      icon: Eye,
      title: "Access Control",
      description: "Role-based access, limited staff permissions, and complete audit trails.",
    },
    {
      icon: Zap,
      title: "Monitoring",
      description: "24/7 security monitoring, intrusion detection, and regular penetration testing.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-black mb-6">Security & Trust</h1>
        <p className="text-xl text-zinc-600 mb-12 max-w-3xl">
          Your memorial data is precious. We implement enterprise-grade security to protect your memories and ensure your privacy.
        </p>

        {/* Security Measures */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {securityMeasures.map((measure, idx) => {
            const Icon = measure.icon
            return (
              <Card key={idx} className="border-zinc-200">
                <CardContent className="p-6">
                  <Icon className="w-8 h-8 text-black mb-4" />
                  <h3 className="font-bold text-black mb-2">{measure.title}</h3>
                  <p className="text-sm text-zinc-600">{measure.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Compliance Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-black mb-8">Compliance & Standards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-black mb-3">International Standards</h3>
              <ul className="space-y-2 text-zinc-700">
                <li>✓ GDPR Compliant (EU regulation)</li>
                <li>✓ PCI-DSS Level 1 (Payment security)</li>
                <li>✓ SOC 2 Type II Certified</li>
                <li>✓ ISO 27001 Aligned</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-black mb-3">Data Protection</h3>
              <ul className="space-y-2 text-zinc-700">
                <li>✓ Automated backups (daily)</li>
                <li>✓ Geographically redundant storage</li>
                <li>✓ Disaster recovery plan</li>
                <li>✓ Data retention policies</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Privacy & Control */}
        <div className="max-w-4xl">
          <h2 className="text-3xl font-bold text-black mb-8">Your Control & Privacy</h2>
          <div className="space-y-6 text-zinc-700">
            <div>
              <h3 className="font-bold text-black mb-2">Memorial Privacy Settings</h3>
              <p>
                You control who can see, comment on, and share your memorial. Options include: public, family only, private (locked), or custom access lists.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-black mb-2">Data Rights</h3>
              <p>
                We never sell your data. You can request a complete export of your memorial at any time. You can also request permanent deletion, though we recommend maintaining memorials for future generations.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-black mb-2">Transparency</h3>
              <p>
                We publish a transparency report annually showing any government requests for data. We disclose all third-party services we use and provide regular security updates.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-black mb-2">Lifetime Commitment</h3>
              <p>
                Even if Memorial QR closes, your memorial will be preserved. We maintain continuity agreements ensuring data migration to trusted archives if needed.
              </p>
            </div>
          </div>
        </div>

        {/* Security Reporting */}
        <div className="mt-16 bg-black text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Report a Security Issue</h2>
          <p className="mb-4">
            If you discover a security vulnerability, please report it responsibly to security@memorialqr.com. We appreciate your help in keeping Memorial QR secure.
          </p>
          <a
            href="mailto:security@memorialqr.com"
            className="inline-block bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition-colors"
          >
            Report Security Issue
          </a>
        </div>
      </div>
    </div>
  )
}
