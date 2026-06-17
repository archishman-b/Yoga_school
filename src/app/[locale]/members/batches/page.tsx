import { requireAuth } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import BatchEnrolCard from '@/components/members/BatchEnrolCard';
import { Wifi, Building2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Batches' };

type Props = { params: { locale: string } };

function AvailabilityPill({ pct }: { pct: number }) {
  const config =
    pct <= 25 ? { label: 'Open',        bar: 'bg-green-500', bg: 'bg-green-50 text-green-700' } :
    pct <= 55 ? { label: 'Filling Up',  bar: 'bg-teal-500',  bg: 'bg-teal-50 text-teal-700' } :
    pct <= 80 ? { label: 'Almost Full', bar: 'bg-amber-500', bg: 'bg-amber-50 text-amber-700' } :
                { label: 'Full',        bar: 'bg-red-500',   bg: 'bg-red-50 text-red-700' };
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full ${config.bar}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.bg}`}>
        {config.label}
      </span>
    </div>
  );
}

const TIME_SLOTS = [
  { label: 'Morning', slots: ['6:15 AM – 7:15 AM', '7:15 AM – 8:15 AM', '8:15 AM – 9:15 AM', '11:15 AM – 12:15 PM'] },
  { label: 'Noon',    slots: ['12:15 PM – 1:15 PM'] },
  { label: 'Evening', slots: ['4:15 PM – 5:15 PM', '5:15 PM – 6:15 PM', '6:15 PM – 7:15 PM', '7:15 PM – 8:15 PM', '8:15 PM – 9:15 PM'] },
];

export default async function BatchesPage({ params: { locale } }: Props) {
  const { profile } = await requireAuth(locale);
  const supabase = createClient();

  const [{ data: batches }, { data: enrollments }] = await Promise.all([
    supabase.from('batches').select('*').eq('status', 'active').order('timing'),
    supabase.from('enrollments').select('*').eq('member_id', profile.id),
  ]);

  const enrolledBatchIds = new Set((enrollments ?? []).map((e: any) => e.batch_id));

  // Group by timing → { online, offline }
  const byTiming = new Map<string, { online?: any; offline?: any }>();
  for (const b of batches ?? []) {
    if (!byTiming.has(b.timing)) byTiming.set(b.timing, {});
    byTiming.get(b.timing)![b.mode as 'online' | 'offline'] = b;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Batches</h1>
        <p className="text-gray-500 text-sm mt-1">
          Choose a time slot and mode. Monthly fee: <span className="font-semibold text-gray-700">₹200</span>.
        </p>
      </div>

      {/* My enrollments */}
      {enrollments && enrollments.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3">My Enrollments</h2>
          <div className="space-y-3">
            {enrollments.map((enr: any) => {
              const batch = batches?.find((b: any) => b.id === enr.batch_id);
              return batch ? (
                <div key={enr.id} className="card p-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                    {batch.mode === 'online' ? <Wifi size={18} /> : <Building2 size={18} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{batch.timing}</p>
                    <p className="text-gray-500 text-xs capitalize">{batch.mode} · {batch.days}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-medium capitalize">
                    {enr.status}
                  </span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Timetable by section */}
      {TIME_SLOTS.map(({ label, slots }) => (
        <div key={label}>
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3">{label}</h2>
          <div className="space-y-3">
            {slots.map((slot) => {
              const pair = byTiming.get(slot);
              if (!pair) return null;
              return (
                <div key={slot} className="card overflow-hidden">
                  {/* Slot header */}
                  <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                    <span className="font-semibold text-gray-800">{slot}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                    {(['online', 'offline'] as const).map((mode) => {
                      const batch = pair[mode];
                      if (!batch) return null;
                      const isEnrolled = enrolledBatchIds.has(batch.id);
                      const isFull = batch.display_fill_pct > 95;
                      return (
                        <div key={mode} className="p-5 space-y-3">
                          {/* Mode label */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                              {mode === 'online'
                                ? <><Wifi size={15} className="text-teal-600" /> Online</>
                                : <><Building2 size={15} className="text-saffron-600" /> In-Class</>}
                            </div>
                            {isEnrolled && (
                              <span className="text-xs text-teal-600 font-semibold">✓ Enrolled</span>
                            )}
                          </div>
                          {/* Availability bar */}
                          <AvailabilityPill pct={batch.display_fill_pct ?? 40} />
                          {/* Fee + enrol */}
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-sm text-gray-500">₹200 / month</span>
                            <BatchEnrolCard
                              batch={batch}
                              isEnrolled={isEnrolled}
                              memberId={profile.id}
                              locale={locale}
                              compact
                              disabled={isFull && !isEnrolled}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
