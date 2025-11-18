'use server'

import { getCurrentDemoUser, type DummyUser } from '@/lib/data/dummy-users'

export async function getUserProfile(): Promise<DummyUser> {
  // Return current demo user
  return getCurrentDemoUser()
}