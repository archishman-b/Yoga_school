'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ConfirmFeeButton({ feeId }: { feeId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const confirm = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from('fee_records')
      .update({ status: 'confirmed', paid_date: new Date().toISOString().split('T')[0] })
      .eq('id', feeId);
    setDone(true);
    setLoading(false);
    router.refresh();
  };

  if (done) return <CheckCircle2 size={16} className="text-green-500 mx-auto" />;

  return (
    <button
      onClick={confirm}
      disabled={loading}
      className="px-3 py-1.5 text-xs bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium disabled:opacity-50 whitespace-nowrap"
    >
      {loading ? '…' : 'Confirm Paid'}
    </button>
  );
}
