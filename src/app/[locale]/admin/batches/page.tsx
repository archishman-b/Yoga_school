import { requireAdmin } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import BatchEditor from '@/components/admin/BatchEditor';
import MaxEnrollmentsSetting from '@/components/admin/MaxEnrollmentsSetting';
import BatchCreator from '@/components/admin/BatchCreator';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin — Batches' };
type Props = { params: { locale: string } };

export default async function AdminBatchesPage({ params: { locale } }: Props) {
  await requireAdmin(locale);
  const supabase = createClient();

  const [{ data: batches }, { data: settings }] = await Promise.all([
    supabase.from('batches').select('*').order('batch_code'),
    supabase.from('school_settings').select('*').single(),
  ]);

  // Group by batch_code prefix: M / N / E
  const groups: Record<string, any[]> = { Morning: [], Noon: [], Evening: [], Other: [] };
  for (const b of batches ?? []) {
    const code = b.batch_code ?? '';
    if (code.startsWith('M'))      groups.Morning.push(b);
    else if (code.startsWith('N')) groups.Noon.push(b);
    else if (code.startsWith('E')) groups.Evening.push(b);
    else                           groups.Other.push(b);
  }

  return (
    <div className="space-y-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batch Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            {(batches ?? []).length} batches · Edit, add, or remove batches.
          </p>
        </div>
        <MaxEnrollmentsSetting current={settings?.max_enrollments_per_member ?? 1} />
      </div>

      {/* Code legend */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 flex items-start gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-1">Code format: <code className="bg-white border px-1 rounded">[Period+Seq]-[OL/CR]</code></p>
          <p className="text-xs text-gray-400">M = Morning · N = Noon · E = Evening · OL = Online · CR = Classroom</p>
        </div>
      </div>

      {/* Add new batch */}
      <BatchCreator />

      {/* Batch list grouped */}
      {(['Morning', 'Noon', 'Evening', 'Other'] as const).map(group => {
        const list = groups[group];
        if (!list.length) return null;
        return (
          <div key={group}>
            <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3">{group}</h2>
            <div className="space-y-2">
              {list.map((batch: any) => (
                <BatchEditor key={batch.id} batch={batch} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
