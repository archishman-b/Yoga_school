import { requireAuth } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { User, CalendarDays, CreditCard, AlertCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Member Dashboard' };

type Props = { params: { locale: string } };

export default async function MemberDashboard({ params: { locale } }: Props) {
  const t = await getTranslations('members');
  const { profile } = await requireAuth(locale);
  const supabase = createClient();

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*, batch:batches(*)')
    .eq('member_id', profile.id)
    .eq('status', 'active');

  const { data: fees } = await supabase
    .from('fee_records')
    .select('status, amount')
    .eq('member_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(12);

  const pendingFees = fees?.filter((f) => f.status !== 'confirmed') ?? [];
  const enrollCount = enrollments?.length ?? 0;

  const cards = [
    {
      href: `/${locale}/members/profile`,
      icon: <User size={22} />,
      label: t('myProfile'),
      sub: profile.full_name ?? 'Complete your profile',
      colour: 'from-teal-500 to-teal-700',
    },
    {
      href: `/${locale}/members/batches`,
      icon: <CalendarDays size={22} />,
      label: t('myBatches'),
      sub: `${enrollCount} ${enrollCount !== 1 ? t('activeEnrollments') : t('activeEnrollment')}`,
      colour: 'from-saffron-500 to-orange-600',
    },
    {
      href: `/${locale}/members/fees`,
      icon: <CreditCard size={22} />,
      label: t('feeRecords'),
      sub: pendingFees.length > 0 ? t('paymentPending') : t('paymentsUpToDate'),
      colour: 'from-purple-500 to-purple-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-ink">
          {t('welcomeBack')}{profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 🙏
        </h1>
        <p className="text-ink/55 text-sm mt-1">{t('practiceOverview')}</p>
      </div>

      {/* Quick cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-card overflow-hidden shadow-card border border-teal-600/10 hover:shadow-card-hover transition-shadow"
          >
            <div className={`bg-gradient-to-br ${card.colour} p-4 text-white`}>
              {card.icon}
            </div>
            <div className="p-4 bg-cream">
              <p className="font-semibold text-ink">{card.label}</p>
              <p className="text-ink/55 text-xs mt-0.5">{card.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Active batches */}
      {enrollments && enrollments.length > 0 && (
        <div className="bg-cream rounded-card border border-teal-600/10 shadow-card p-5">
          <h2 className="font-bold text-ink mb-4">{t('myBatches')}</h2>
          <div className="space-y-3">
            {enrollments.map((enr: any) => (
              <div key={enr.id} className="flex items-center gap-4 p-3 rounded-xl bg-teal-50">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <p className="font-medium text-ink text-sm">{enr.batch?.name_en}</p>
                  <p className="text-ink/55 text-xs">{enr.batch?.timing} · {enr.batch?.days}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fee status */}
      {pendingFees.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={18} className="text-amber-600" />
            <h2 className="font-bold text-amber-800">{t('paymentPending')}</h2>
          </div>
          <Link
            href={`/${locale}/members/fees`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-900"
          >
            {t('feeRecords')} →
          </Link>
        </div>
      )}
    </div>
  );
}
