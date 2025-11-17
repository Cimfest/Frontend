'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface AudioPlayerProps {
  title: string
  duration: string
  quality?: string
  format?: string
  downloadUrl?: string
  isGenerated?: boolean
  isReady?: boolean
}

export function AudioPlayer({
  title,
  duration,
  quality,
  format,
  downloadUrl,
  isGenerated = false,
  isReady = false,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element
  useEffect(() => {
    if (downloadUrl && isReady) {
      audioRef.current = new Audio(downloadUrl)
      
      // Update time and progress while playing
      const handleTimeUpdate = () => {
        if (audioRef.current) {
          const current = audioRef.current.currentTime
          const total = audioRef.current.duration
          
          // Format time as M:SS
          const minutes = Math.floor(current / 60)
          const seconds = Math.floor(current % 60)
          setCurrentTime(`${minutes}:${seconds.toString().padStart(2, '0')}`)
          
          // Calculate progress percentage
          setProgress((current / total) * 100)
        }
      }

      // Reset when audio ends
      const handleEnded = () => {
        setIsPlaying(false)
        setProgress(0)
        setCurrentTime('0:00')
      }

      audioRef.current.addEventListener('timeupdate', handleTimeUpdate)
      audioRef.current.addEventListener('ended', handleEnded)

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate)
          audioRef.current.removeEventListener('ended', handleEnded)
          audioRef.current.pause()
        }
      }
    }
  }, [downloadUrl, isReady])

  // Toggle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle download
  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `${title}.${format?.toLowerCase() || 'mp3'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {isGenerated && isReady && (
          <span className="text-sm text-green-400">✓ Ready</span>
        )}
      </div>

      <div className="flex items-center gap-4 mb-4">
        {/* Play/Pause Button */}
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90"
          onClick={togglePlay}
          disabled={!isReady || !downloadUrl}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-0.5" />
          )}
        </Button>

        {/* Time Display and Progress Bar */}
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">{currentTime}</span>
            <span className="text-muted-foreground">{duration}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* File Info */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-4 text-muted-foreground">
          {quality && <span>Quality: <span className="text-foreground">{quality}</span></span>}
          {format && <span>Format: <span className="text-foreground">{format}</span></span>}
        </div>

        {downloadUrl && isReady && (
          <Button 
            variant="link" 
            size="sm" 
            className="text-primary hover:text-primary/80"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Original
          </Button>
        )}
      </div>

      {/* Generated Track Info */}
      {isGenerated && isReady && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-3 w-3" />
              MP3
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-3 w-3" />
              WAV
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}