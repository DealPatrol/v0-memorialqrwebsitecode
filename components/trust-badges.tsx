import { Shield, Lock, Award, Heart, CreditCard, Clock } from "lucide-react"

export function TrustBadges() {
  return (
    <div className="bg-zinc-900 py-8 px-4 border-y border-zinc-800">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div className="flex flex-col items-center text-center gap-2">
          <Shield className="h-8 w-8 text-green-500" />
          <p className="text-sm font-semibold text-white">30-Day Guarantee</p>
          <p className="text-xs text-zinc-500">100% money back</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <Lock className="h-8 w-8 text-blue-500" />
          <p className="text-sm font-semibold text-white">SSL Secured</p>
          <p className="text-xs text-zinc-500">Bank-level encryption</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <CreditCard className="h-8 w-8 text-purple-500" />
          <p className="text-sm font-semibold text-white">Secure Payments</p>
          <p className="text-xs text-zinc-500">Powered by Square</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2 hidden md:flex">
          <Clock className="h-8 w-8 text-yellow-500" />
          <p className="text-sm font-semibold text-white">Lifetime Hosting</p>
          <p className="text-xs text-zinc-500">Forever accessible</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2 hidden lg:flex">
          <Award className="h-8 w-8 text-orange-500" />
          <p className="text-sm font-semibold text-white">Weather-Resistant</p>
          <p className="text-xs text-zinc-500">Built to last decades</p>
        </div>
      </div>
    </div>
  )
}
