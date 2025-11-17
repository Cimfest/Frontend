'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SongDetailHeaderProps {
  title: string
  artist: string
  status: 'Completed' | 'Processing' | 'Failed' | 'Pending'
}

const statusConfig = {
  Completed: {
    className: 'bg-green-500/20 text-green-400 border-green-500/50',
  },
  Processing: {
    className: 'bg-primary/20 text-primary border-primary/50',
  },
  Failed: {
    className: 'bg-destructive/20 text-red-400 border-red-500/50',
  },
  Pending: {
    className: 'bg-muted/50 text-muted-foreground border-muted',
  },
}

export function SongDetailHeader({ title, artist, status }: SongDetailHeaderProps) {
  const config = statusConfig[status]

  return (
    <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
      <div className="flex items-center gap-6">
        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">by {artist}</p>
        </div>
      </div>

      <Badge className={config.className}>
        {status}
      </Badge>
    </div>
  )
}