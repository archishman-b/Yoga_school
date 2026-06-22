import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient as createAdminSupabase } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// ── Admin Supabase client (service role — bypasses RLS) ─────────────────────
function getAdminClient() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key  = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY env var');
  return createAdminSupabase(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

// ── Verify caller is an admin ────────────────────────────────────────────────
async function verifyAdmin(): Promise<boolean> {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  return profile?.role === 'admin';
}

// ── Generate unique NYT-XXXX member ID ───────────────────────────────────────
function randomFourDigit(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

async function generateUniqueMemberId(admin: ReturnType<typeof getAdminClient>): Promise<string> {
  for (let i = 0; i < 20; i++) {
    const num = randomFourDigit();
    const id = `NYT-${num}`;
    const { count } = await admin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('member_id', id);
    if ((count ?? 0) === 0) return id;
  }
  throw new Error('Could not generate a unique member_id after 20 attempts');
}

// ── Derive fake email from member ID ─────────────────────────────────────────
// NYT-3841 => nyt3841@nibedita.yoga
function memberIdToEmail(memberId: string): string {
  return memberId.replace('NYT-', 'nyt').toLowerCase() + '@nibedita.yoga';
}

function memberIdToTempPassword(memberId: string): string {
  const num = memberId.replace('NYT-', '');
  return `Yoga@${num}`;
}

// ── POST /api/admin/create-member ────────────────────────────────────────────
export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.full_name || typeof body.full_name !== 'string') {
    return NextResponse.json({ error: 'full_name is required' }, { status: 400 });
  }

  const admin = getAdminClient();

  // 1. Generate unique member ID
  let memberId: string;
  try {
    memberId = await generateUniqueMemberId(admin);
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }

  const fakeEmail   = memberIdToEmail(memberId);
  const tempPassword = memberIdToTempPassword(memberId);

  // 2. Create Supabase auth user
  const { data: authData, error: authErr } = await admin.auth.admin.createUser({
    email:          fakeEmail,
    password:       tempPassword,
    email_confirm:  true,   // skip email verification — admin-created accounts are pre-verified
    user_metadata:  { full_name: body.full_name },
  });

  if (authErr || !authData.user) {
    return NextResponse.json({ error: authErr?.message ?? 'Auth user creation failed' }, { status: 400 });
  }

  const userId = authData.user.id;

  // 3. Insert / upsert profile row with all provided fields
  const profileRow: Record<string, unknown> = {
    id:           userId,
    member_id:    memberId,
    email:        null,         // real email intentionally blank — fake email is internal only
    full_name:    body.full_name,
    phone:        body.phone        ?? null,
    address:      body.address      ?? null,
    gender:       body.gender       ?? null,
    date_of_birth:           body.date_of_birth           ?? null,
    guardian_name:           body.guardian_name           ?? null,
    occupation:              body.occupation              ?? null,
    marital_status:          body.marital_status          ?? null,
    mother_tongue:           body.mother_tongue           ?? null,
    education:               body.education               ?? null,
    height_cm:               body.height_cm               ?? null,
    weight_kg:               body.weight_kg               ?? null,
    diet_preference:         body.diet_preference         ?? null,
    medical_conditions:      body.medical_conditions      ?? null,
    cardiovascular_conditions: body.cardiovascular_conditions ?? null,
    previous_yoga:           body.previous_yoga           ?? null,
    doctor_referral:         body.doctor_referral         ?? null,
    ailments:                body.ailments                ?? null,
    course_interest:         body.course_interest         ?? null,
    emergency_contact:       body.emergency_contact       ?? null,
    preferred_language:      body.preferred_language      ?? 'en',
    role:                    'member',
    status:                  'active',
    joined_date:             body.joined_date ?? new Date().toISOString().split('T')[0],
  };

  const { error: profileErr } = await admin.from('profiles').upsert(profileRow);

  if (profileErr) {
    // Rollback: clean up the auth user so we don't leave orphans
    await admin.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: profileErr.message }, { status: 500 });
  }

  // 4. Return credential pair to admin (to share over WhatsApp etc.)
  return NextResponse.json({
    ok:        true,
    member_id: memberId,
    password:  tempPassword,
    user_id:   userId,
    message:   `Account created. Share these credentials with the member: Member ID = ${memberId}, Password = ${tempPassword}`,
  });
}
