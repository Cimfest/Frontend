'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Upload } from 'lucide-react'

export function CreateSongDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(true)
  const [songTitle, setSongTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [mood, setMood] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleClose = () => {
    setOpen(false)
    // Navigate back to dashboard after closing
    setTimeout(() => router.push('/dashboard'), 150)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (
        droppedFile.type === 'audio/mpeg' ||
        droppedFile.type === 'audio/wav'
      ) {
        setFile(droppedFile)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // TODO: Implement actual file upload and song creation logic
    console.log({
      songTitle,
      genre,
      mood,
      file,
    })

    // For now, just close and navigate back
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Produce a New Track
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Song Title */}
          <div className="space-y-2">
            <Label htmlFor="song-title">Song Title</Label>
            <Input
              id="song-title"
              type="text"
              placeholder="Enter your song title"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              className="bg-secondary border-border"
              required
            />
          </div>

          {/* Upload Vocal Track */}
          <div className="space-y-2">
            <Label>Upload Your Vocal Track</Label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-secondary'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                accept=".mp3,.wav"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-primary">
                .mp3, .wav files only
              </p>
              {file && (
                <p className="mt-4 text-sm font-medium text-foreground">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>

          {/* Genre and Mood */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Select value={genre} onValueChange={setGenre} required>
                <SelectTrigger
                  id="genre"
                  className="bg-secondary border-border"
                >
                  <SelectValue placeholder="Afrobeats" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="afrobeats">Afrobeats</SelectItem>
                  <SelectItem value="makossa">Makossa</SelectItem>
                  <SelectItem value="bikutsi">Bikutsi</SelectItem>
                  <SelectItem value="coupedecale">Coupé-Décalé</SelectItem>
                  <SelectItem value="hiphop">Hip Hop</SelectItem>
                  <SelectItem value="rnb">R&B</SelectItem>
                  <SelectItem value="gospel">Gospel</SelectItem>
                  <SelectItem value="traditional">Traditional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood">Mood</Label>
              <Select value={mood} onValueChange={setMood} required>
                <SelectTrigger id="mood" className="bg-secondary border-border">
                  <SelectValue placeholder="Energetic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="energetic">Energetic</SelectItem>
                  <SelectItem value="romantic">Romantic</SelectItem>
                  <SelectItem value="melancholic">Melancholic</SelectItem>
                  <SelectItem value="uplifting">Uplifting</SelectItem>
                  <SelectItem value="chill">Chill</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                  <SelectItem value="peaceful">Peaceful</SelectItem>
                  <SelectItem value="party">Party</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            size="lg"
            disabled={!songTitle || !genre || !mood || !file}
          >
            Produce My Track
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}