import { createClient } from '@/lib/supabase/server';
import BatchFillSlider from '@/components/admin/BatchFillSlider';
import { Wifi, Building2 } from 'lucide-react';

type Props = { params: { locale: string } };

function groupByTiming(batches: any[]) {
  const map = new Map<string, { online?: any; offline?: any }>();
  for (const b of batches) {
    if (!map.has(b.timing)) map.set(b.timing, {});
    map.get(b.timing)![b.mode as 'online' | 'offline'] = b;
  }
  return map;
}

function FillBadge({ pct }: { pct: number }) {
  const config =
    pct <= 25 ? { label: 'Open', bg: 'bg-green-50 text-green-700' } :
    pct <= 55 ? { label: 'Filling Up', bg: 'bg-teal-50 text-teal-700' } :
    pct <= 80 ? { label: 'Almost Full', bg: 'bg-amber-50 text-amber-700' } :
                { label: 'Full', bg: 'bg-red-50 text-red-700' };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${config.bg}`}>
      {config.label}
    </span>
  );
}

export default async function AdminBatchesPage({ params: { locale } }: Props) {
  const supabase = createClient();
  const { data: batches } = await supabase
    .from('batches')
    .select('*')
    .eq('status', 'active')
    .order('timing');

  const grouped = groupByTiming(batches ?? []);

  const sections = [
    { label: 'Morning', slots: ['6:15 AM – 7:15 AM', '7:15 AM – 8:15 AM', '8:15 AM – 9:15 AM', '11:15 AM – 12:15 PM'] },
    { label: 'Noon',    slots: ['12:15 PM – 1:15 PM'] },
    { label: 'Evening', slots: ['4:15 PM – 5:15 PM', '5:15 PM – 6:15 PM', '6:15 PM – 7:15 PM', '7:15 PM – 8:15 PM', '8:15 PM – 9:15 PM'] },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Batch Availability</h1>
        <p className="text-gray-500 text-sm mt-1">
          Use the sliders to control what members see. Actual enrollment numbers stay private.
        </p>
      </div>

      {/* Legend */}
      <div className="card p-4 flex flex-wrap gap-4 text-sm">
        {[
          { label: 'Open',        color: 'bg-green-500', range: '0–25%' },
          { label: 'Filling Up',  color: 'bg-teal-500',  range: '26–55%' },
          { label: 'Almost Full', color: 'bg-amber-500', range: '56–80%' },
          { label: 'Full',        color: 'bg-red-500',   range: '81–100%' },
        ].map(({ label, color, range }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${color}`} />
            <span className="font-medium text-gray-700">{label}</span>
            <span className="text-gray-400 text-xs">{range}</span>
          </div>
        ))}
      </div>

      {sections.map(({ label, slots }) => (
        <div key={label} className="card overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">{label}</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-50">
                <th className="text-left px-5 py-2 font-medium">Time Slot</th>
                <th className="px-3 py-2 font-medium text-center"><Wifi size={13} className="inline" /> Online</th>
                <th className="text-left px-5 py-2 font-medium w-56">Availability</th>
                <th className="px-3 py-2 font-medium text-center"><Building2 size={13} className="inline" /> Offline</th>
                <th className="text-left px-5 py-2 font-medium w-56">Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {slots.map((slot) => {
                const pair = grouped.get(slot) ?? {};
                return (
                  <tr key={slot} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3 font-medium text-gray-800 whitespace-nowrap">{slot}</td>

                    <td className="px-3 py-3 text-center">
                      {pair.online
                        ? <FillBadge pct={pair.online.display_fill_pct ?? 40} />
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-3">
                      {pair.online
                        ? <BatchFillSlider batchId={pair.online.id} initialPct={pair.online.display_fill_pct ?? 40} />
                        : <span className="text-gray-300 text-xs">No batch</span>}
                    </td>

                    <td className="px-3 py-3 text-center">
                      {pair.offline
                        ? <FillBadge pct={pair.offline.display_fill_pct ?? 40} />
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-3">
                      {pair.offline
                        ? <BatchFillSlider batchId={pair.offline.id} initialPct={pair.offline.display_fill_pct ?? 40} />
                        : <span className="text-gray-300 text-xs">No batch</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
