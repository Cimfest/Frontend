'use server'

import {
  distributeTrack,
  saveDistributionRecord,
  getDistributionRecords,
  type DistributionMetadata,
  type DistributionResult,
} from '@/lib/services/distribution-service'
import { getCurrentDemoUser } from '@/lib/data/dummy-users'

export async function submitDistribution(
  songId: string,
  platforms: string[],
  metadata: DistributionMetadata
): Promise<{ success: boolean; results: DistributionResult[]; error?: string }> {
  try {
    // Get current demo user
    const user = getCurrentDemoUser()

    // Distribute to selected platforms
    const results = await distributeTrack(metadata, platforms)

    // Save distribution records
    for (const result of results) {
      if (result.success) {
        await saveDistributionRecord({
          songId: songId,
          userId: user.id,
          platform: result.platform,
          status: 'submitted',
          distributionUrl: result.url,
          trackingId: result.trackingId,
          submittedAt: new Date().toISOString(),
        })
      }
    }

    return {
      success: true,
      results,
    }
  } catch (error: any) {
    console.error('Distribution error:', error)
    return {
      success: false,
      results: [],
      error: error.message || 'Distribution failed',
    }
  }
}

export async function getDistributionStatus(songId: string) {
  try {
    const distributions = await getDistributionRecords(songId)

    return {
      success: true,
      distributions,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}