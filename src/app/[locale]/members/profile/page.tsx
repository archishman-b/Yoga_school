import { requireAuth } from '@/lib/supabase/auth';
import ProfileForm from '@/components/members/ProfileForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Profile' };

type Props = { params: { locale: string } };

export default async function ProfilePage({ params: { locale } }: Props) {
  const { profile } = await requireAuth(locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Keep your details up to date.</p>
      </div>
      <ProfileForm profile={profile} locale={locale} />
    </div>
  );
}
