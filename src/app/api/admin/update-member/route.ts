import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient as createAdminSupabase } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

function getAdminClient() {
  return createAdminSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
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

/**
 * PATCH /api/admin/update-member
 * Body: { id: string (user UUID), ...any profile fields to update }
 */
export async function PATCH(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { id, ...fields } = body;
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'id (user UUID) is required' }, { status: 400 });
  }

  // Coerce numeric and boolean fields
  if (fields.height_cm !== undefined) fields.height_cm = fields.height_cm ? parseFloat(fields.height_cm as string) : null;
  if (fields.weight_kg !== undefined) fields.weight_kg = fields.weight_kg ? parseFloat(fields.weight_kg as string) : null;
  if (fields.previous_yoga   === 'yes') fields.previous_yoga   = true;
  if (fields.previous_yoga   === 'no')  fields.previous_yoga   = false;
  if (fields.doctor_referral === 'yes') fields.doctor_referral = true;
  if (fields.doctor_referral === 'no')  fields.doctor_referral = false;

  // Strip undefined / empty string → null
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v === '' || v === undefined) clean[k] = null;
    else clean[k] = v;
  }

  // Never allow escalating role via this route
  delete clean.role;
  delete clean.member_id;  // member_id is assigned on creation, not editable

  const admin = getAdminClient();
  const { error } = await admin.from('profiles').update(clean).eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
