import { requireAuth } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { User, CalendarDays, CreditCard, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Member Dashboard' };

type Props = { params: { locale: string } };

export default async function MemberDashboard({ params: { locale } }: Props) {
  const { profile } = await requireAuth(locale);
  const supabase = createClient();

  // Fetch enrollments with batch details
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*, batch:batches(*)')
    .eq('member_id', profile.id)
    .eq('status', 'active');

  // Fetch fee summary
  const { data: fees } = await supabase
    .from('fee_records')
    .select('status, amount')
    .eq('member_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(12);

  const pendingFees = fees?.filter((f) => f.status !== 'confirmed') ?? [];
  const paidFees = fees?.filter((f) => f.status === 'confirmed') ?? [];

  const cards = [
    {
      href: `/${locale}/members/profile`,
      icon: <User size={22} />,
      label: 'My Profile',
      sub: profile.full_name ?? 'Complete your profile',
      colour: 'from-teal-500 to-teal-700',
    },
    {
      href: `/${locale}/members/batches`,
      icon: <CalendarDays size={22} />,
      label: 'My Batches',
      sub: `${enrollments?.length ?? 0} active enrollment${(enrollments?.length ?? 0) !== 1 ? 's' : ''}`,
      colour: 'from-saffron-500 to-orange-600',
    },
    {
      href: `/${locale}/members/fees`,
      icon: <CreditCard size={22} />,
      label: 'Fee Records',
      sub: pendingFees.length > 0 ? `${pendingFees.length} payment pending` : 'All payments up to date',
      colour: 'from-purple-500 to-purple-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 🙏
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here's your practice overview.</p>
      </div>

      {/* Quick cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className={`bg-gradient-to-br ${card.colour} p-4 text-white`}>
              {card.icon}
            </div>
            <div className="p-4 bg-white">
              <p className="font-semibold text-gray-900">{card.label}</p>
              <p className="text-gray-500 text-xs mt-0.5">{card.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Active batches */}
      {enrollments && enrollments.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">Active Batches</h2>
          <div className="space-y-3">
            {enrollments.map((enr: any) => (
              <div key={enr.id} className="flex items-center gap-4 p-3 rounded-xl bg-teal-50">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{enr.batch?.name_en}</p>
                  <p className="text-gray-500 text-xs">{enr.batch?.timing} · {enr.batch?.days}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fee status */}
      {pendingFees.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={18} className="text-amber-600" />
            <h2 className="font-bold text-amber-800">Payment Due</h2>
          </div>
          <p className="text-amber-700 text-sm mb-3">
            You have {pendingFees.length} pending payment{pendingFees.length > 1 ? 's' : ''}.
          </p>
          <Link
            href={`/${locale}/members/fees`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-900"
          >
            Pay now →
          </Link>
        </div>
      )}
    </div>
  );
}
