import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get('next') ?? '/en/members';

  const supabase = createClient();

  // ── Path 1: OAuth / PKCE (Google) ────────────────────────────────────────
  // Google → Supabase → back here with ?code=
  const code = searchParams.get('code');
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error('[auth/callback] exchangeCodeForSession error:', error.message);
    return NextResponse.redirect(`${origin}/en/members/login?error=oauth_failed`);
  }

  // ── Path 2: Email magic link / OTP confirmation ───────────────────────────
  // Resend/SMTP sends links with ?token_hash=&type=magiclink|signup|recovery
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error('[auth/callback] verifyOtp error:', error.message);
    return NextResponse.redirect(`${origin}/en/members/login?error=link_expired`);
  }

  // ── No recognised params ──────────────────────────────────────────────────
  return NextResponse.redirect(`${origin}/en/members/login?error=missing_params`);
}
