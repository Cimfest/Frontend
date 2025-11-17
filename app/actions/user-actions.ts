'use server';

import { createClient } from '@supabase/supabase-js';

export async function getUserProfile() {
  try {
    // For demo - just return a dummy profile without any security checks
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Just get any user session without redirecting
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // Try to get profile, but if it fails, return dummy data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        return profile;
      }

      // Return user data from auth if profile doesn't exist
      return {
        id: session.user.id,
        first_name: session.user.user_metadata?.first_name || 'Demo',
        last_name: session.user.user_metadata?.last_name || 'User',
        artist_name: session.user.user_metadata?.artist_name || 'Demo Artist',
        email: session.user.email || 'demo@example.com',
      };
    }

    // If no session, return dummy data for demo
    return {
      id: 'demo-user-id',
      first_name: 'Demo',
      last_name: 'User', 
      artist_name: 'Demo Artist',
      email: 'demo@example.com',
    };

  } catch (error) {
    console.error('Error in getUserProfile:', error);
    // Return dummy data on error
    return {
      id: 'demo-user-id',
      first_name: 'Demo',
      last_name: 'User',
      artist_name: 'Demo Artist', 
      email: 'demo@example.com',
    };
  }
}