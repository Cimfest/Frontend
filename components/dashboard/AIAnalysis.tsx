import { Progress } from '@/components/ui/progress'

interface AIAnalysisProps {
  vocalQuality: number
  pitchAccuracy: number
  rhythmSync: number
}

export function AIAnalysis({
  vocalQuality,
  pitchAccuracy,
  rhythmSync,
}: AIAnalysisProps) {
  const metrics = [
    { label: 'Vocal Quality', value: vocalQuality, color: 'text-green-400' },
    { label: 'Pitch Accuracy', value: pitchAccuracy, color: 'text-green-400' },
    { label: 'Rhythm Sync', value: rhythmSync, color: 'text-green-400' },
  ]

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">AI Analysis</h3>
      
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">{metric.label}</span>
              <span className={`text-sm font-medium ${metric.color}`}>
                {metric.value}%
              </span>
            </div>
            <Progress value={metric.value} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  )
}