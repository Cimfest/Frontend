// Types
export interface DistributionMetadata {
  title: string
  artistName: string
  genre: string
  mood: string
  albumArt: string | null
  audioFileUrl?: string
  releaseDate: string
  isrc?: string
  upc?: string
  lyrics?: string
  language?: string
  explicit?: boolean
  tags?: string[]
  biography?: string
  pressRelease?: string
}

export interface DistributionResult {
  platform: string
  success: boolean
  url?: string
  message?: string
  error?: string
  trackingId?: string
}

// Generate ISRC code (International Standard Recording Code)
function generateISRC(): string {
  const countryCode = 'CM' // Cameroon
  const registrantCode = 'HAM' // Hamonix
  const year = new Date().getFullYear().toString().slice(-2)
  const designation = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0')
  return `${countryCode}-${registrantCode}-${year}-${designation}`
}

// Generate UPC code
function generateUPC(): string {
  return Math.floor(Math.random() * 1000000000000)
    .toString()
    .padStart(12, '0')
}

// Generate hashtags
function generateHashtags(metadata: DistributionMetadata): string {
  const baseHashtags = [
    '#NewMusic',
    '#' + metadata.genre.replace(/\s+/g, ''),
    '#' + metadata.mood.replace(/\s+/g, ''),
    '#CameroonianMusic',
    '#AfricanMusic',
    '#Hamonix',
    '#' + metadata.artistName.replace(/\s+/g, ''),
  ]

  if (metadata.tags && metadata.tags.length > 0) {
    metadata.tags.forEach(tag => {
      baseHashtags.push('#' + tag.replace(/\s+/g, ''))
    })
  }

  return baseHashtags.join(' ')
}

// Simulate YouTube Distribution
async function distributeToYouTube(
  metadata: DistributionMetadata
): Promise<DistributionResult> {
  await new Promise(resolve => setTimeout(resolve, 1500))

  try {
    const hashtags = generateHashtags(metadata)
    const videoId = 'yt_' + Math.random().toString(36).substr(2, 11)
    
    return {
      platform: 'YouTube Music',
      success: true,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      message: 'Successfully uploaded to YouTube Music',
      trackingId: videoId,
    }
  } catch (error: any) {
    return {
      platform: 'YouTube Music',
      success: false,
      error: error.message || 'Failed to upload to YouTube',
    }
  }
}

// Simulate Spotify Distribution
async function distributeToSpotify(
  metadata: DistributionMetadata
): Promise<DistributionResult> {
  await new Promise(resolve => setTimeout(resolve, 2000))

  try {
    const isrc = metadata.isrc || generateISRC()
    const trackingId = 'spotify_' + Math.random().toString(36).substr(2, 11)
    
    return {
      platform: 'Spotify',
      success: true,
      message: 'Successfully submitted to Spotify. Processing takes 5-10 business days.',
      trackingId: trackingId,
    }
  } catch (error: any) {
    return {
      platform: 'Spotify',
      success: false,
      error: error.message || 'Failed to submit to Spotify',
    }
  }
}

// Simulate Apple Music Distribution
async function distributeToAppleMusic(
  metadata: DistributionMetadata
): Promise<DistributionResult> {
  await new Promise(resolve => setTimeout(resolve, 1800))

  try {
    const trackingId = 'apple_' + Math.random().toString(36).substr(2, 11)
    
    return {
      platform: 'Apple Music',
      success: true,
      message: 'Successfully submitted to Apple Music. Review takes 5-7 business days.',
      trackingId: trackingId,
    }
  } catch (error: any) {
    return {
      platform: 'Apple Music',
      success: false,
      error: error.message || 'Failed to submit to Apple Music',
    }
  }
}

// Simulate Deezer Distribution
async function distributeToDeezer(
  metadata: DistributionMetadata
): Promise<DistributionResult> {
  await new Promise(resolve => setTimeout(resolve, 1600))

  try {
    const trackingId = 'deezer_' + Math.random().toString(36).substr(2, 11)
    
    return {
      platform: 'Deezer',
      success: true,
      message: 'Successfully submitted to Deezer. Processing takes 3-5 business days.',
      trackingId: trackingId,
    }
  } catch (error: any) {
    return {
      platform: 'Deezer',
      success: false,
      error: error.message || 'Failed to submit to Deezer',
    }
  }
}

// Simulate Tidal Distribution
async function distributeToTidal(
  metadata: DistributionMetadata
): Promise<DistributionResult> {
  await new Promise(resolve => setTimeout(resolve, 1700))

  try {
    const trackingId = 'tidal_' + Math.random().toString(36).substr(2, 11)
    
    return {
      platform: 'Tidal',
      success: true,
      message: 'Successfully submitted to Tidal. Hi-res processing takes 7-10 business days.',
      trackingId: trackingId,
    }
  } catch (error: any) {
    return {
      platform: 'Tidal',
      success: false,
      error: error.message || 'Failed to submit to Tidal',
    }
  }
}

// Main distribution function
export async function distributeTrack(
  metadata: DistributionMetadata,
  platforms: string[]
): Promise<DistributionResult[]> {
  const results: DistributionResult[] = []

  for (const platform of platforms) {
    let result: DistributionResult

    switch (platform.toLowerCase()) {
      case 'youtube':
        result = await distributeToYouTube(metadata)
        break
      case 'spotify':
        result = await distributeToSpotify(metadata)
        break
      case 'apple_music':
        result = await distributeToAppleMusic(metadata)
        break
      case 'deezer':
        result = await distributeToDeezer(metadata)
        break
      case 'tidal':
        result = await distributeToTidal(metadata)
        break
      default:
        result = {
          platform,
          success: false,
          error: 'Platform not supported',
        }
    }

    results.push(result)
  }

  return results
}

// Distribution records storage (in-memory for demo)
export interface DistributionRecord {
  id: string
  songId: string
  userId: string
  platform: string
  status: 'submitted' | 'processing' | 'live' | 'failed'
  distributionUrl?: string
  trackingId?: string
  submittedAt: string
  liveAt?: string
}

const distributionRecords: DistributionRecord[] = []

export async function saveDistributionRecord(
  record: Omit<DistributionRecord, 'id'>
): Promise<DistributionRecord> {
  const newRecord: DistributionRecord = {
    ...record,
    id: 'dist_' + Math.random().toString(36).substr(2, 9),
  }
  distributionRecords.push(newRecord)
  return newRecord
}

export async function getDistributionRecords(
  songId: string
): Promise<DistributionRecord[]> {
  return distributionRecords.filter(record => record.songId === songId)
}