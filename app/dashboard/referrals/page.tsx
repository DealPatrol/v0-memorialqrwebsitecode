import { ReferralDashboard } from "@/components/referral-dashboard"
import { Header } from "@/components/header"

export default function ReferralsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-100">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <ReferralDashboard />
        </div>
      </div>
    </div>
  )
}
