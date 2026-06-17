import { createClient } from '@/lib/supabase/server';
import ConfirmFeeButton from '@/components/admin/ConfirmFeeButton';
import AddFeeForm from '@/components/admin/AddFeeForm';

type Props = { params: { locale: string } };

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  screenshot_uploaded: 'bg-blue-50 text-blue-700',
  confirmed: 'bg-green-50 text-green-700',
  overdue: 'bg-red-50 text-red-700',
};

export default async function AdminFeesPage({ params: { locale } }: Props) {
  const supabase = createClient();

  const [{ data: fees }, { data: members }] = await Promise.all([
    supabase
      .from('fee_records')
      .select('*, profiles(full_name, email)')
      .order('month', { ascending: false })
      .limit(100),
    supabase.from('profiles').select('id, full_name, email').eq('role', 'member').order('full_name'),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fee Records</h1>
        <p className="text-gray-500 text-sm mt-1">Add monthly fees and confirm payments.</p>
      </div>

      <AddFeeForm members={members ?? []} />

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
              <th className="text-left px-5 py-3 font-medium">Member</th>
              <th className="text-left px-5 py-3 font-medium">Month</th>
              <th className="text-right px-5 py-3 font-medium hidden sm:table-cell">Amount</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Receipt</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(fees ?? []).map((fee: any) => (
              <tr key={fee.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3">
                  <p className="font-medium text-gray-900 text-xs">{fee.profiles?.full_name ?? '—'}</p>
                  <p className="text-gray-400 text-xs">{fee.profiles?.email}</p>
                </td>
                <td className="px-5 py-3 text-gray-700 text-xs">{fee.month}</td>
                <td className="px-5 py-3 text-right text-gray-900 hidden sm:table-cell">
                  ₹{fee.amount?.toLocaleString('en-IN')}
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[fee.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {fee.status}
                  </span>
                </td>
                <td className="px-5 py-3 hidden md:table-cell">
                  {fee.screenshot_url ? (
                    <a href={fee.screenshot_url} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-teal-600 underline">
                      View
                    </a>
                  ) : '—'}
                </td>
                <td className="px-5 py-3">
                  {fee.status === 'screenshot_uploaded' && (
                    <ConfirmFeeButton feeId={fee.id} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!fees || fees.length === 0) && (
          <p className="px-5 py-8 text-sm text-gray-400 text-center">No fee records yet.</p>
        )}
      </div>
    </div>
  );
}
