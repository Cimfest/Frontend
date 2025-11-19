import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// This forces the route to be dynamically rendered, which is essential for auth.
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, artistName, email, password } = await request.json();

    // --- Validation ---
    if (!firstName || !lastName || !artistName || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }
    // --- End Validation ---

    const cookieStore = await cookies();
    const supabase = createServerActionClient({ cookies: () => cookieStore });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          artist_name: artistName,
        },
      },
    });

    if (error) {
      console.error('Supabase Sign-Up Error:', error.message);
      return NextResponse.json({ error: error.message }, { status: error.status || 400 });
    }
    
    if (!data.user) {
      return NextResponse.json({ error: 'Sign-up failed. No user data returned from Supabase.' }, { status: 500 });
    }

    // Create the absolute redirect URL
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard'; // Set the path to /dashboard
    return NextResponse.redirect(url); // Use the absolute URL for redirect

  } catch (err: any) {
    console.error('API Sign-Up Route Error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred on the server.' },
      { status: 500 }
    );
  }
}