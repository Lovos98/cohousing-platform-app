'use client'

import { CompatibilityBreakdown } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCompatibilityColor, getCompatibilityLabel } from '@/lib/compatibility'
import { Progress } from '@/components/ui/progress'

interface CompatibilityScoreProps {
  breakdown: CompatibilityBreakdown
}

export function CompatibilityScore({ breakdown }: CompatibilityScoreProps) {
  const categories = [
    { key: 'cleanliness', label: 'Cleanliness' },
    { key: 'noiseTolerance', label: 'Noise Tolerance' },
    { key: 'socialLevel', label: 'Social Level' },
    { key: 'pets', label: 'Pets' },
    { key: 'smoking', label: 'Smoking' },
    { key: 'overnight_guests', label: 'Overnight Guests' },
    { key: 'shared_expenses', label: 'Shared Expenses' },
  ] as const

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Compatibility Analysis</span>
          <span className={`text-2xl ${getCompatibilityColor(breakdown.overall)}`}>
            {breakdown.overall}%
          </span>
        </CardTitle>
        <p className={`text-sm font-medium ${getCompatibilityColor(breakdown.overall)}`}>
          {getCompatibilityLabel(breakdown.overall)}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category) => {
          const score = breakdown.categories[category.key]
          return (
            <div key={category.key} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{category.label}</span>
                <span className={getCompatibilityColor(score)}>{score}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    score >= 80
                      ? 'bg-green-500'
                      : score >= 60
                      ? 'bg-blue-500'
                      : score >= 40
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
