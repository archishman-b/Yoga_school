/**
 * Auth helper utilities for member portal.
 * Use on Server Components / Route Handlers where cookies are available.
 */
import { createClient } from './server';
import { redirect } from 'next/navigation';
import type { Profile } from './types';

/** Returns the current session + profile, or null if not logged in */
export async function getSessionAndProfile(): Promise<{
  userId: string;
  profile: Profile;
} | null> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  // Profile missing — can happen for OAuth sign-ins if the DB trigger hasn't
  // been applied yet, or on the very first sign-in before the trigger fires.
  // Create a minimal profile row so the user isn't permanently locked out.
  if (!profile) {
    const meta = session.user.user_metadata ?? {};
    const { data: created } = await supabase
      .from('profiles')
      .insert({
        id: session.user.id,
        email: session.user.email,
        full_name: meta.full_name ?? meta.name ?? null,
        photo_url: meta.avatar_url ?? null,
        role: 'member',
        status: 'active',
      })
      .select()
      .single();
    profile = created;
  }

  if (!profile) return null;

  return { userId: session.user.id, profile };
}

/** Require auth — redirects to /[locale]/members/login if not signed in */
export async function requireAuth(locale: string) {
  const result = await getSessionAndProfile();
  if (!result) redirect(`/${locale}/members/login`);
  return result;
}

/** Require admin role — redirects home if not admin */
export async function requireAdmin(locale: string) {
  const result = await requireAuth(locale);
  if (result.profile.role !== 'admin') redirect(`/${locale}`);
  return result;
}
