import { requireAuth } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import BatchEnrolCard from '@/components/members/BatchEnrolCard';
import RollOffToggle from '@/components/members/RollOffToggle';
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
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${config.bg}`}>
        {config.label}
      </span>
    </div>
  );
}

const TIME_SLOTS = [
  { label: 'Morning', slots: ['6:15 AM – 7:15 AM','7:15 AM – 8:15 AM','8:15 AM – 9:15 AM','11:15 AM – 12:15 PM'] },
  { label: 'Noon',    slots: ['12:15 PM – 1:15 PM'] },
  { label: 'Evening', slots: ['4:15 PM – 5:15 PM','5:15 PM – 6:15 PM','6:15 PM – 7:15 PM','7:15 PM – 8:15 PM','8:15 PM – 9:15 PM'] },
];

export default async function BatchesPage({ params: { locale } }: Props) {
  const { profile } = await requireAuth(locale);
  const supabase = createClient();

  const [{ data: batches }, { data: enrollments }, { data: settings }] = await Promise.all([
    supabase.from('batches').select('*').eq('status', 'active').order('timing'),
    supabase.from('enrollments').select('*').eq('member_id', profile.id).neq('status', 'cancelled'),
    supabase.from('school_settings').select('max_enrollments_per_member').single(),
  ]);

  const maxEnrollments = settings?.max_enrollments_per_member ?? 1;
  const activeEnrollments = (enrollments ?? []).filter((e: any) => e.status === 'active');
  const atLimit = activeEnrollments.length >= maxEnrollments;

  // Map: batch_id → enrollment row
  const enrollmentByBatch = new Map((enrollments ?? []).map((e: any) => [e.batch_id, e]));

  // Group by timing
  const byTiming = new Map<string, { online?: any; offline?: any }>();
  for (const b of batches ?? []) {
    if (!byTiming.has(b.timing)) byTiming.set(b.timing, {});
    byTiming.get(b.timing)![b.mode as 'online'|'offline'] = b;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Batches</h1>
        <p className="text-gray-500 text-sm mt-1">
          Monthly fee: <span className="font-semibold text-gray-700">₹200</span> · You can be enrolled in up to <span className="font-semibold text-gray-700">{maxEnrollments}</span> {maxEnrollments === 1 ? 'batch' : 'batches'} at a time.
        </p>
      </div>

      {/* Current enrollments */}
      {activeEnrollments.length > 0 && (
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 space-y-3">
          <h2 className="font-semibold text-teal-900 text-sm">Your Current Enrollment{activeEnrollments.length > 1 ? 's' : ''}</h2>
          {activeEnrollments.map((enr: any) => {
            const batch = (batches ?? []).find((b: any) => b.id === enr.batch_id);
            if (!batch) return null;
            return (
              <div key={enr.id} className="flex items-center justify-between gap-3 bg-white rounded-xl px-4 py-3 border border-teal-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                    {batch.mode === 'online' ? <Wifi size={15}/> : <Building2 size={15}/>}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{batch.timing}</p>
                    <p className="text-gray-400 text-xs capitalize">{batch.mode} · {batch.days}</p>
                  </div>
                </div>
                <RollOffToggle
                  enrollmentId={enr.id}
                  memberId={profile.id}
                  currentStatus={enr.status}
                  batchName={`${batch.timing} (${batch.mode})`}
                />
              </div>
            );
          })}
          {atLimit && (
            <p className="text-xs text-teal-700 bg-teal-100 rounded-lg px-3 py-2">
              You're at your enrollment limit. Roll off your current batch to join a different one.
            </p>
          )}
        </div>
      )}

      {/* Timetable */}
      {TIME_SLOTS.map(({ label, slots }) => (
        <div key={label}>
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3">{label}</h2>
          <div className="space-y-3">
            {slots.map((slot) => {
              const pair = byTiming.get(slot);
              if (!pair) return null;
              return (
                <div key={slot} className="card overflow-hidden">
                  <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                    <span className="font-semibold text-gray-800">{slot}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                    {(['online','offline'] as const).map((mode) => {
                      const batch = pair[mode];
                      if (!batch) return null;
                      const enrollment = enrollmentByBatch.get(batch.id);
                      const isEnrolled = enrollment?.status === 'active';
                      const isRolledOff = enrollment?.status === 'paused';
                      const isFull = batch.display_fill_pct > 95;
                      const canEnrol = !atLimit && !isEnrolled && !isRolledOff;

                      return (
                        <div key={mode} className={`p-5 space-y-3 ${isEnrolled ? 'bg-teal-50/40' : ''}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                              {mode === 'online'
                                ? <><Wifi size={15} className="text-teal-600"/> Online</>
                                : <><Building2 size={15} className="text-saffron-600"/> In-Class</>}
                            </div>
                            {isRolledOff && (
                              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">Rolled Off</span>
                            )}
                          </div>

                          <AvailabilityPill pct={batch.display_fill_pct ?? 40} />

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-sm text-gray-500">₹{batch.fee_monthly ?? 200}/mo</span>
                            {isEnrolled ? (
                              <RollOffToggle
                                enrollmentId={enrollment.id}
                                memberId={profile.id}
                                currentStatus="active"
                                batchName={`${batch.timing} (${mode})`}
                              />
                            ) : isRolledOff ? (
                              <RollOffToggle
                                enrollmentId={enrollment.id}
                                memberId={profile.id}
                                currentStatus="paused"
                                batchName={`${batch.timing} (${mode})`}
                              />
                            ) : (
                              <BatchEnrolCard
                                batch={batch}
                                isEnrolled={false}
                                memberId={profile.id}
                                locale={locale}
                                compact
                                disabled={isFull || !canEnrol}
                              />
                            )}
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
