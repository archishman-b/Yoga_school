import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/auth/member-login
 *
 * Looks up a member by their Member ID (e.g. "NYT-3841") and returns the
 * internal fake email so the client can call signInWithPassword.
 *
 * Uses the SERVICE ROLE key for the lookup so RLS doesn't block the
 * unauthenticated read — the user isn't logged in yet at this point.
 */

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

export async function POST(request: Request) {
  let body: { member_id?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const raw = (body.member_id ?? '').trim().toUpperCase();

  // Normalise: accept "3841" or "NYT3841" or "NYT-3841"
  let memberId = raw;
  if (/^\d{4}$/.test(raw)) memberId = `NYT-${raw}`;
  else if (/^NYT\d{4}$/.test(raw)) memberId = `NYT-${raw.slice(3)}`;

  if (!/^NYT-\d{4}$/.test(memberId)) {
    return NextResponse.json(
      { error: 'Invalid Member ID format. Expected NYT-XXXX (e.g. NYT-3841).' },
      { status: 400 },
    );
  }

  if (!body.password || body.password.length < 4) {
    return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
  }

  // Use service role to bypass RLS — user is not authenticated yet
  const admin = getAdminClient();
  const { count } = await admin
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('member_id', memberId);

  if ((count ?? 0) === 0) {
    return NextResponse.json(
      { error: 'Member ID not found. Please check with your teacher.' },
      { status: 404 },
    );
  }

  // Derive fake email — deterministic: NYT-3841 → nyt3841@nibedita.yoga
  const fakeEmail = memberId.replace('NYT-', 'nyt').toLowerCase() + '@nibedita.yoga';

  return NextResponse.json({ ok: true, email: fakeEmail });
}
