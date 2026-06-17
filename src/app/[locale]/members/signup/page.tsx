import SignupForm from '@/components/members/SignupForm';
import { getSessionAndProfile } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Join — Nibedita Yoga' };
type Props = { params: { locale: string } };

export default async function SignupPage({ params: { locale } }: Props) {
  const session = await getSessionAndProfile();
  if (session) redirect(`/${locale}/members`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 to-gray-900 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🪷</span>
          <h1 className="text-2xl font-bold text-white mt-4">Join Nibedita Yoga</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Create your member account to enroll in batches and track your journey.
          </p>
        </div>
        <SignupForm locale={locale} />
      </div>
    </div>
  );
}
