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

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

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
