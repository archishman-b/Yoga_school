import { requireAuth } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import BatchEnrolCard from '@/components/members/BatchEnrolCard';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Batches' };

type Props = { params: { locale: string } };

export default async function BatchesPage({ params: { locale } }: Props) {
  const { profile } = await requireAuth(locale);
  const supabase = createClient();

  const [{ data: batches }, { data: enrollments }] = await Promise.all([
    supabase.from('batches').select('*').eq('status', 'active').order('level'),
    supabase.from('enrollments').select('*').eq('member_id', profile.id),
  ]);

  const enrolledBatchIds = new Set((enrollments ?? []).map((e: any) => e.batch_id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Batches</h1>
        <p className="text-gray-500 text-sm mt-1">
          Enrol in a batch or request a change. Contact us on WhatsApp for questions.
        </p>
      </div>

      {/* My enrollments */}
      {enrollments && enrollments.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3">
            My Enrollments
          </h2>
          <div className="space-y-3">
            {enrollments.map((enr: any) => {
              const batch = batches?.find((b: any) => b.id === enr.batch_id);
              return batch ? (
                <div key={enr.id} className="card p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700 text-lg">
                    🧘
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{batch.name_en}</p>
                    <p className="text-gray-500 text-xs">{batch.timing} · {batch.days}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-medium">
                    {enr.status}
                  </span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* All batches */}
      <div>
        <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3">
          Available Batches
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(batches ?? []).map((batch: any) => (
            <BatchEnrolCard
              key={batch.id}
              batch={batch}
              isEnrolled={enrolledBatchIds.has(batch.id)}
              memberId={profile.id}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
