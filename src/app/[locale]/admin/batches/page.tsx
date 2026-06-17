import { requireAdmin } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import BatchEditor from '@/components/admin/BatchEditor';
import MaxEnrollmentsSetting from '@/components/admin/MaxEnrollmentsSetting';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin — Batches' };
type Props = { params: { locale: string } };

const GROUPS = [
  { label: 'Morning',  slots: ['6:15 AM – 7:15 AM','7:15 AM – 8:15 AM','8:15 AM – 9:15 AM','11:15 AM – 12:15 PM'] },
  { label: 'Noon',     slots: ['12:15 PM – 1:15 PM'] },
  { label: 'Evening',  slots: ['4:15 PM – 5:15 PM','5:15 PM – 6:15 PM','6:15 PM – 7:15 PM','7:15 PM – 8:15 PM','8:15 PM – 9:15 PM'] },
];

export default async function AdminBatchesPage({ params: { locale } }: Props) {
  await requireAdmin(locale);
  const supabase = createClient();

  const [{ data: batches }, { data: settings }] = await Promise.all([
    supabase.from('batches').select('*').order('timing'),
    supabase.from('school_settings').select('*').single(),
  ]);

  // Group by timing, then by mode
  const byTiming = new Map<string, { online?: any; offline?: any }>();
  for (const b of batches ?? []) {
    if (!byTiming.has(b.timing)) byTiming.set(b.timing, {});
    byTiming.get(b.timing)![b.mode as 'online'|'offline'] = b;
  }

  return (
    <div className="space-y-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batch Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage timing, fees, and fill-rate display for each batch.</p>
        </div>
        <MaxEnrollmentsSetting
          current={settings?.max_enrollments_per_member ?? 1}
        />
      </div>

      {/* Batch code legend */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Batch Code Format</h2>
        <p className="text-xs text-gray-500 mb-3">
          Codes are permanent identifiers — they don't change if timings shift slightly.
          Format: <code className="bg-white border px-1 py-0.5 rounded text-gray-700">[time slot]-[mode]</code>
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          {['M615','M715','M815','M1115','N1215','E415','E515','E615','E715','E815'].map(slot => (
            <span key={slot} className="flex gap-1">
              <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded font-mono">{slot}-OL</span>
              <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-mono">{slot}-OF</span>
            </span>
          ))}
        </div>
      </div>

      {GROUPS.map(({ label, slots }) => (
        <div key={label}>
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-4">{label}</h2>
          <div className="space-y-4">
            {slots.map(slot => {
              const pair = byTiming.get(slot);
              if (!pair) return null;
              return (
                <div key={slot} className="card overflow-hidden">
                  <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                    <span className="font-semibold text-gray-800">{slot}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    {(['online', 'offline'] as const).map(mode => {
                      const batch = pair[mode];
                      if (!batch) return null;
                      return (
                        <div key={mode} className="p-5">
                          <BatchEditor batch={batch} />
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
