'use client'

import { Button } from '@/components/ui/button'
import { FileText, Settings, Music } from 'lucide-react'

export function QuickActions() {
  const actions = [
    { icon: FileText, label: 'View Lyrics', onClick: () => console.log('View Lyrics') },
    { icon: Settings, label: 'Technical Details', onClick: () => console.log('Technical Details') },
    { icon: Music, label: 'Remix Track', onClick: () => console.log('Remix Track') },
  ]

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      
      <div className="space-y-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start"
            onClick={action.onClick}
          >
            <action.icon className="mr-3 h-4 w-4" />
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  )
}