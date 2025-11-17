// This file contains mock data for songs
// Update the audio file paths to match your actual music files

export interface Song {
  id: string
  title: string
  artist_name: string
  status: 'Completed' | 'Processing' | 'Failed' | 'Pending'
  genre: string
  mood: string
  bpm: number
  key: string
  created_at: string
  duration: string
  original_vocal: {
    quality: string
    format: string
    url?: string
  }
  generated_track: {
    bpm: number
    key: string
    genre: string
    formats: string[]
    url?: string
  }
  ai_analysis: {
    vocal_quality: number
    pitch_accuracy: number
    rhythm_sync: number
  }
}

// Dummy songs data with real audio file paths
// IMPORTANT: Place your audio files in the public/music folder
// e.g., public/music/afro-love-original.mp3
export const dummySongs: Song[] = [
  {
    id: '1',
    title: 'Afro Love',
    artist_name: 'Kwame Asante',
    status: 'Completed',
    genre: 'Afrobeats',
    mood: 'Energetic',
    bpm: 128,
    key: 'C Major',
    created_at: '2024-01-15',
    duration: '3:42',
    original_vocal: {
      quality: 'Studio',
      format: 'WAV',
      url: '/musics/(256k)(1).mp3', // Update with your actual file name
    },
    generated_track: {
      bpm: 128,
      key: 'C Major',
      genre: 'Afrobeats',
      formats: ['MP3', 'WAV'],
      url: '/musics/(256k)(2).mp3', // Update with your actual file name
    },
    ai_analysis: {
      vocal_quality: 85,
      pitch_accuracy: 92,
      rhythm_sync: 78,
    },
  },
  {
    id: '2',
    title: 'Mbolé Fire',
    artist_name: 'Aminata Diallo',
    status: 'Processing',
    genre: 'Makossa',
    mood: 'Energetic',
    bpm: 125,
    key: 'D Minor',
    created_at: '2024-01-16',
    duration: '4:15',
    original_vocal: {
      quality: 'Home',
      format: 'MP3',
      url: '/musics/(256k)(4).mp3',
    },
    generated_track: {
      bpm: 125,
      key: 'D Minor',
      genre: 'Makossa',
      formats: ['MP3'],
      url: '/musics/(256k)(7).mp3',
    },
    ai_analysis: {
      vocal_quality: 72,
      pitch_accuracy: 88,
      rhythm_sync: 85,
    },
  },
  {
    id: '3',
    title: 'Midnight Makossa',
    artist_name: 'Jean-Claude Mbarga',
    status: 'Failed',
    genre: 'Makossa',
    mood: 'Melancholic',
    bpm: 110,
    key: 'A Minor',
    created_at: '2024-01-14',
    duration: '3:28',
    original_vocal: {
      quality: 'Home',
      format: 'MP3',
    },
    generated_track: {
      bpm: 110,
      key: 'A Minor',
      genre: 'Makossa',
      formats: [],
    },
    ai_analysis: {
      vocal_quality: 65,
      pitch_accuracy: 70,
      rhythm_sync: 68,
    },
  },
  {
    id: '4',
    title: 'Savanna Soul',
    artist_name: 'Fatou Bensouda',
    status: 'Pending',
    genre: 'R&B',
    mood: 'Romantic',
    bpm: 95,
    key: 'E Major',
    created_at: '2024-01-17',
    duration: '4:02',
    original_vocal: {
      quality: 'Studio',
      format: 'WAV',
    },
    generated_track: {
      bpm: 95,
      key: 'E Major',
      genre: 'R&B',
      formats: [],
    },
    ai_analysis: {
      vocal_quality: 90,
      pitch_accuracy: 94,
      rhythm_sync: 88,
    },
  },
  {
    id: '5',
    title: 'Bamenda Beats',
    artist_name: 'Emmanuel Njoya',
    status: 'Completed',
    genre: 'Hip Hop',
    mood: 'Aggressive',
    bpm: 140,
    key: 'F# Minor',
    created_at: '2024-01-13',
    duration: '3:55',
    original_vocal: {
      quality: 'Studio',
      format: 'WAV',
      url: '/musics/KRYS_M_-_Chacun_sa_chance__official_video__directed_by_Kwedi_nelson(256k).mp3',
    },
    generated_track: {
      bpm: 140,
      key: 'F# Minor',
      genre: 'Hip Hop',
      formats: ['MP3', 'WAV'],
      url: '/musics/KRYS_M_-_Qui_croira_verra__official_video__Directed_by_CHUZIH(256k).mp3',
    },
    ai_analysis: {
      vocal_quality: 88,
      pitch_accuracy: 90,
      rhythm_sync: 92,
    },
  },
  {
    id: '6',
    title: 'Douala Dreams',
    artist_name: 'Grace Mbock',
    status: 'Processing',
    genre: 'Afrobeats',
    mood: 'Uplifting',
    bpm: 118,
    key: 'G Major',
    created_at: '2024-01-18',
    duration: '3:20',
    original_vocal: {
      quality: 'Home',
      format: 'MP3',
      url: '/musics/KRYS_M_-_Qui_croira_verra__official_video__Directed_by_CHUZIH(256k).mp3',
    },
    generated_track: {
      bpm: 118,
      key: 'G Major',
      genre: 'Afrobeats',
      formats: [],
    },
    ai_analysis: {
      vocal_quality: 80,
      pitch_accuracy: 86,
      rhythm_sync: 84,
    },
  },
]

export function getSongById(id: string): Song | undefined {
  return dummySongs.find((song) => song.id === id)
}

export function getAllSongs(): Song[] {
  return dummySongs
}