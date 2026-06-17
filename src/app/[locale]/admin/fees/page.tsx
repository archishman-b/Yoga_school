import { requireAdmin } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import FeeActions from '@/components/admin/FeeActions';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin — Fees' };
type Props = { params: { locale: string } };

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  confirmed:           { label: 'Paid',          cls: 'bg-green-50 text-green-700' },
  screenshot_uploaded: { label: 'Screenshot',    cls: 'bg-blue-50 text-blue-700' },
  pending:             { label: 'Pending',        cls: 'bg-amber-50 text-amber-700' },
  overdue:             { label: 'Overdue',        cls: 'bg-red-50 text-red-700' },
};

export default async function AdminFeesPage({ params: { locale } }: Props) {
  await requireAdmin(locale);
  const supabase = createClient();

  const { data: fees } = await supabase
    .from('fee_records')
    .select('*, member:profiles(full_name, email, photo_url)')
    .order('month', { ascending: false })
    .order('created_at', { ascending: false });

  const totals = { pending: 0, overdue: 0, confirmed: 0, screenshot_uploaded: 0 };
  for (const f of fees ?? []) totals[f.status as keyof typeof totals] = (totals[f.status as keyof typeof totals] ?? 0) + 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fee Records</h1>
        <p className="text-gray-500 text-sm mt-1">Review and confirm member fee payments.</p>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(totals).map(([status, count]) => {
          const { label, cls } = STATUS_LABELS[status] ?? { label: status, cls: '' };
          return <span key={status} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${cls}`}>{label}: {count}</span>;
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wide bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 font-medium">Member</th>
              <th className="text-left px-4 py-3 font-medium">Month</th>
              <th className="text-left px-4 py-3 font-medium">Amount</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Method</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(fees ?? []).map((fee: any) => {
              const { label, cls } = STATUS_LABELS[fee.status] ?? { label: fee.status, cls: '' };
              return (
                <tr key={fee.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {fee.member?.photo_url
                        ? <img src={fee.member.photo_url} className="w-7 h-7 rounded-full object-cover" alt="" />
                        : <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-600 text-xs flex items-center justify-center font-bold shrink-0">
                            {fee.member?.full_name?.[0] ?? '?'}
                          </div>
                      }
                      <div>
                        <p className="font-medium text-gray-900 text-sm leading-tight">{fee.member?.full_name ?? '—'}</p>
                        <p className="text-gray-400 text-xs">{fee.member?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">{fee.month}</td>
                  <td className="px-4 py-3 text-gray-600">₹{fee.amount?.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs capitalize hidden md:table-cell">{fee.method ?? '—'}</td>
                  <td className="px-4 py-3">
                    <FeeActions feeId={fee.id} status={fee.status} screenshotUrl={fee.screenshot_url} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!fees?.length && (
          <p className="text-gray-400 text-sm text-center py-12">No fee records yet.</p>
        )}
      </div>
    </div>
  );
}
