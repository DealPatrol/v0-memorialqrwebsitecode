import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function CreateProfileLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-100">
      {/* Progress Header Skeleton */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-2 max-w-md mx-auto" />
              <div className="h-4 bg-gray-200 rounded animate-pulse max-w-sm mx-auto" />
            </div>

            <Progress value={0} className="mb-8" />

            <div className="flex justify-between items-center">
              {[1, 2, 3, 4, 5, 6].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse mb-2" />
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Form Content Skeleton */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="h-10 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
                <div className="h-24 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>

            <div className="flex justify-between mt-8">
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
