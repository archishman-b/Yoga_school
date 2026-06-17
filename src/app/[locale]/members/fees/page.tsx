import { requireAuth } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import FeeTable from '@/components/members/FeeTable';
import UPIPayment from '@/components/members/UPIPayment';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Fee Records' };

type Props = { params: { locale: string } };

export default async function FeesPage({ params: { locale } }: Props) {
  const { profile } = await requireAuth(locale);
  const supabase = createClient();

  const { data: fees } = await supabase
    .from('fee_records')
    .select('*')
    .eq('member_id', profile.id)
    .order('month', { ascending: false });

  const pendingFees = (fees ?? []).filter((f: any) => f.status !== 'confirmed');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fee Records</h1>
        <p className="text-gray-500 text-sm mt-1">Your payment history and pending dues.</p>
      </div>

      {/* UPI payment widget — only if there are pending fees */}
      {pendingFees.length > 0 && (
        <UPIPayment pendingFees={pendingFees} memberId={profile.id} />
      )}

      {/* All fee records */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Payment History</h2>
        </div>
        <FeeTable fees={fees ?? []} />
      </div>
    </div>
  );
}
