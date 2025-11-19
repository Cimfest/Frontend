export interface DummyUser {
  id: string
  username: string
  password: string
  first_name: string
  last_name: string
  artist_name: string
  email: string
  avatar?: string
}

export const dummyUsers: DummyUser[] = [
  {
    id: 'user-001',
    username: 'brandon237',
    password: 'demo123',
    first_name: 'Brandon',
    last_name: 'Blink',
    artist_name: 'Brandon Blink',
    email: 'brandon237@gmail.com',
    avatar: '/avatars/8.jpg',
  },
  {
    id: 'user-002',
    username: 'aminata_fire',
    password: 'demo123',
    first_name: 'Aminata',
    last_name: 'Diallo',
    artist_name: 'Aminata Fire',
    email: 'aminata.diallo@hamonix.cm',
    avatar: '/avatars/22.jpg',
  },
  {
    id: 'user-003',
    username: 'kwame_beats',
    password: 'demo123',
    first_name: 'Kwame',
    last_name: 'Asante',
    artist_name: 'Kwame Asante',
    email: 'kwame.asante@hamonix.cm',
    avatar: '/avatars/23.jpg',
  },
  {
    id: 'user-004',
    username: 'grace_dreams',
    password: 'demo123',
    first_name: 'Grace',
    last_name: 'Mbock',
    artist_name: 'Grace Mbock',
    email: 'grace.mbock@hamonix.cm',
    avatar: '/avatars/26.jpg',
  },
  {
    id: 'user-005',
    username: 'emmanuel_njoya',
    password: 'demo123',
    first_name: 'Emmanuel',
    last_name: 'Njoya',
    artist_name: 'Emmanuel Njoya',
    email: 'emmanuel.njoya@hamonix.cm',
    avatar: '/avatars/34.jpg',
  },
]

// Helper function to get current demo user
export function getCurrentDemoUser(): DummyUser {
  // For demo, always return the first user (Brandon Blink)
  // In a real app, you'd get this from session storage or context
  const storedUserId = typeof window !== 'undefined' 
    ? sessionStorage.getItem('currentUserId')
    : null
  
  if (storedUserId) {
    const user = dummyUsers.find(u => u.id === storedUserId)
    if (user) return user
  }
  
  return dummyUsers[0] // Default to Brandon Blink
}

// Set current user
export function setCurrentDemoUser(userId: string) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('currentUserId', userId)
  }
}

// Get user by username
export function getDemoUserByUsername(username: string): DummyUser | undefined {
  return dummyUsers.find(u => u.username === username)
}

// Validate login
export function validateDemoLogin(username: string, password: string): DummyUser | null {
  const user = dummyUsers.find(u => u.username === username && u.password === password)
  return user || null
}