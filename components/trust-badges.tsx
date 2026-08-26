import { Shield, Lock, Award, Heart } from 'lucide-react'

export function TrustBadges() {
  return (
    <div className="bg-muted/50 py-6 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col items-center text-center gap-2">
          <Shield className="h-8 w-8 text-green-600" />
          <p className="text-xs font-semibold">SSL Secured</p>
          <p className="text-xs text-muted-foreground">Bank-level encryption</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <Lock className="h-8 w-8 text-blue-600" />
          <p className="text-xs font-semibold">Privacy Protected</p>
          <p className="text-xs text-muted-foreground">Your data is safe</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <Award className="h-8 w-8 text-purple-600" />
          <p className="text-xs font-semibold">30-Day Guarantee</p>
          <p className="text-xs text-muted-foreground">100% money back</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <Heart className="h-8 w-8 text-red-600" />
          <p className="text-xs font-semibold">5,000+ Families</p>
          <p className="text-xs text-muted-foreground">Trust Memorial QR</p>
        </div>
      </div>
    </div>
  )
}
