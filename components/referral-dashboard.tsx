"use client"

import { useState, useEffect } from "react"
import { Copy, Check, Gift, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface ReferralStats {
  referralCode: string | null
  totalReferrals: number
  completedReferrals: number
  pendingReferrals: number
  totalRewards: number
  claimedRewards: number
  unclaimedRewards: number
  referrals: any[]
  rewards: any[]
}

export function ReferralDashboard() {
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/referrals/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("[v0] Error fetching referral stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateCode = async () => {
    setGenerating(true)
    try {
      const response = await fetch("/api/referrals/generate-code", {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Referral Code Generated",
          description: "Your unique referral code is ready to share!",
        })
        fetchStats()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate referral code",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const copyReferralLink = () => {
    const link = `${window.location.origin}/signup?ref=${stats?.referralCode}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    toast({
      title: "Link Copied",
      description: "Referral link copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">Loading referral dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Referral Program</h2>
        <p className="text-slate-600">Invite friends and earn rewards when they create a memorial</p>
      </div>

      {!stats?.referralCode ? (
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Generate your unique referral code to start earning rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={generateCode} disabled={generating}>
              {generating ? "Generating..." : "Generate Referral Code"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Your Referral Code</CardTitle>
              <CardDescription>Share this code with friends and family</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={stats.referralCode} readOnly className="font-mono text-lg" />
                <Button onClick={copyReferralLink} variant="outline" size="icon">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-sm text-slate-600">
                Referral Link:{" "}
                <code className="bg-slate-100 px-2 py-1 rounded text-xs">
                  {window.location.origin}/signup?ref={stats.referralCode}
                </code>
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                  <Users className="w-4 h-4 text-slate-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{stats.totalReferrals}</div>
                <p className="text-xs text-slate-600 mt-1">{stats.completedReferrals} completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Rewards Earned</CardTitle>
                  <Gift className="w-4 h-4 text-slate-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{stats.totalRewards}</div>
                <p className="text-xs text-slate-600 mt-1">{stats.unclaimedRewards} unclaimed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Potential Earnings</CardTitle>
                  <TrendingUp className="w-4 h-4 text-slate-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">${(stats.completedReferrals * 9.99).toFixed(2)}</div>
                <p className="text-xs text-slate-600 mt-1">Value of rewards</p>
              </CardContent>
            </Card>
          </div>

          {stats.rewards.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Rewards</CardTitle>
                <CardDescription>Rewards you've earned from referrals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.rewards.map((reward: any) => (
                    <div key={reward.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{reward.description}</p>
                        <p className="text-xs text-slate-500">
                          Expires: {new Date(reward.expires_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={reward.claimed ? "secondary" : "default"}>
                        {reward.claimed ? "Claimed" : "Available"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm text-slate-700">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold text-xs">
                    1
                  </span>
                  <span>Share your unique referral code with friends and family</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold text-xs">
                    2
                  </span>
                  <span>They sign up and create their first memorial using your code</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold text-xs">
                    3
                  </span>
                  <span>You both receive rewards - they get 20% off and you get 1 month free!</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
