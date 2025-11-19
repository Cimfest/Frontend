import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// This forces the route to be dynamically rendered, which is essential for auth.
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // --- Validation ---
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }
    // --- End Validation ---

    const cookieStore = cookies();
    // Use createServerActionClient for more robust server-side cookie handling
    const supabase = createServerActionClient({ cookies: () => cookieStore });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase Sign-In Error:', error.message);
      return NextResponse.json({ error: 'Invalid login credentials.' }, { status: 401 });
    }
    
    if (!data.session) {
        return NextResponse.json({ error: 'Login failed. No session was returned from Supabase.' }, { status: 401 });
    }

    return NextResponse.json({
      message: 'Login successful!',
      session: data.session,
    }, { status: 200 });

  } catch (err: any) {
    console.error('API Login Route Error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred on the server.' },
      { status: 500 }
    );
  }
}