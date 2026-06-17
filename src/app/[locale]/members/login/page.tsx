import LoginForm from '@/components/members/LoginForm';
import { getSessionAndProfile } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Member Login' };

type Props = { params: { locale: string } };

export default async function LoginPage({ params: { locale } }: Props) {
  const session = await getSessionAndProfile();
  if (session) redirect(`/${locale}/members`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 to-gray-900 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🪷</span>
          <h1 className="text-2xl font-bold text-white mt-4">Member Login</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Enter your email — we'll send you a one-time login link.
          </p>
        </div>
        <LoginForm locale={locale} />
      </div>
    </div>
  );
}
