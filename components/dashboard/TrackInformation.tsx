interface TrackInformationProps {
  duration: string
  genre: string
  mood: string
  bpm: number
  key: string
  created: string
}

export function TrackInformation({
  duration,
  genre,
  mood,
  bpm,
  key,
  created,
}: TrackInformationProps) {
  const infoItems = [
    { label: 'Duration', value: duration },
    { label: 'Genre', value: genre },
    { label: 'Mood', value: mood },
    { label: 'BPM', value: bpm.toString() },
    { label: 'Key', value: key },
    { label: 'Created', value: created },
  ]

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Track Information</h3>
      
      <div className="space-y-3">
        {infoItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}