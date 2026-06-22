import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient as createAdminSupabase } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

function getAdminClient() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key  = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY env var');
  return createAdminSupabase(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

async function verifyAdmin(): Promise<boolean> {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  return profile?.role === 'admin';
}

async function generateUniqueMemberId(admin: ReturnType<typeof getAdminClient>): Promise<string> {
  for (let i = 0; i < 20; i++) {
    const num = String(Math.floor(1000 + Math.random() * 9000));
    const id  = `NYT-${num}`;
    const { count } = await admin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('member_id', id);
    if ((count ?? 0) === 0) return id;
  }
  throw new Error('Could not generate a unique member_id after 20 attempts');
}

function memberIdToEmail(memberId: string): string {
  return memberId.replace('NYT-', 'nyt').toLowerCase() + '@nibedita.yoga';
}

function memberIdToTempPassword(memberId: string): string {
  return `Yoga@${memberId.replace('NYT-', '')}`;
}

// Convert a value to null if it is empty string, null, or undefined.
// Use for enum/constrained columns so the DB check constraint is not violated.
function nullIfEmpty(v: unknown): unknown {
  if (v === null || v === undefined || v === '') return null;
  return v;
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }); }

  if (!body.full_name || typeof body.full_name !== 'string') {
    return NextResponse.json({ error: 'full_name is required' }, { status: 400 });
  }

  const admin = getAdminClient();

  let memberId: string;
  try { memberId = await generateUniqueMemberId(admin); }
  catch (err: unknown) { return NextResponse.json({ error: (err as Error).message }, { status: 500 }); }

  const fakeEmail    = memberIdToEmail(memberId);
  const tempPassword = memberIdToTempPassword(memberId);

  const { data: authData, error: authErr } = await admin.auth.admin.createUser({
    email:         fakeEmail,
    password:      tempPassword,
    email_confirm: true,
    user_metadata: { full_name: body.full_name },
  });

  if (authErr || !authData.user) {
    return NextResponse.json({ error: authErr?.message ?? 'Auth user creation failed' }, { status: 400 });
  }

  const userId = authData.user.id;

  // Build profile row — use nullIfEmpty for all enum/constrained fields so
  // empty strings from the form never reach the DB check constraint.
  const profileRow: Record<string, unknown> = {
    id:           userId,
    member_id:    memberId,
    email:        null,
    full_name:    body.full_name,
    phone:                    nullIfEmpty(body.phone),
    address:                  nullIfEmpty(body.address),
    gender:                   nullIfEmpty(body.gender),           // CHECK constraint
    date_of_birth:            nullIfEmpty(body.date_of_birth),
    guardian_name:            nullIfEmpty(body.guardian_name),
    occupation:               nullIfEmpty(body.occupation),
    marital_status:           nullIfEmpty(body.marital_status),   // CHECK constraint
    mother_tongue:            nullIfEmpty(body.mother_tongue),
    education:                nullIfEmpty(body.education),
    height_cm:                body.height_cm ? parseFloat(body.height_cm as string) : null,
    weight_kg:                body.weight_kg ? parseFloat(body.weight_kg as string) : null,
    diet_preference:          nullIfEmpty(body.diet_preference),  // CHECK constraint
    medical_conditions:       nullIfEmpty(body.medical_conditions),
    cardiovascular_conditions: nullIfEmpty(body.cardiovascular_conditions),
    previous_yoga:            body.previous_yoga ?? null,
    doctor_referral:          body.doctor_referral ?? null,
    ailments:                 nullIfEmpty(body.ailments),
    course_interest:          nullIfEmpty(body.course_interest),
    naval_assessment_result:  nullIfEmpty(body.naval_assessment_result), // CHECK constraint
    emergency_contact:        nullIfEmpty(body.emergency_contact),
    preferred_language:       (body.preferred_language as string) || 'en',
    role:                     'member',
    status:                   'active',
    joined_date:              nullIfEmpty(body.joined_date) ?? new Date().toISOString().split('T')[0],
  };

  const { error: profileErr } = await admin.from('profiles').upsert(profileRow);

  if (profileErr) {
    await admin.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: profileErr.message }, { status: 500 });
  }

  return NextResponse.json({
    ok:        true,
    member_id: memberId,
    password:  tempPassword,
    user_id:   userId,
    message:   `Account created. Share with member: Member ID = ${memberId}, Password = ${tempPassword}`,
  });
}
