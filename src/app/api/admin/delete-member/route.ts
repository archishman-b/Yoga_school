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
 * POST /api/admin/delete-member
 * Body: { id: string }  — the auth user UUID
 *
 * Deletes the Supabase auth user (which cascades to profiles via FK or trigger),
 * then removes the profile row explicitly as a safety net.
 */
export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: { id?: string };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  if (!body.id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  const admin = getAdminClient();

  // 1. Delete profile row first (in case FK constraint blocks auth deletion)
  await admin.from('profiles').delete().eq('id', body.id);

  // 2. Delete the auth user — this removes them from Supabase Auth entirely
  const { error } = await admin.auth.admin.deleteUser(body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
