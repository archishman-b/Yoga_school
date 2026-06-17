import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // next param lets us redirect back to where the user was trying to go
  const next = searchParams.get('next') ?? '/en/members';

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth failed — send back to sign-in with an error hint
  return NextResponse.redirect(`${origin}/en/members/login?error=auth_callback_failed`);
}
