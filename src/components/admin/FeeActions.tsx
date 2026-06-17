'use client';

import { useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

type Props = { feeId: string; status: string; screenshotUrl: string | null };

export default function FeeActions({ feeId, status, screenshotUrl }: Props) {
  const [isPending, startTransition] = useTransition();

  const update = (newStatus: string) => {
    startTransition(async () => {
      const supabase = createClient();
      const patch: any = { status: newStatus, updated_at: new Date().toISOString() };
      if (newStatus === 'confirmed') patch.paid_date = new Date().toISOString().split('T')[0];
      await supabase.from('fee_records').update(patch).eq('id', feeId);
      window.location.reload();
    });
  };

  return (
    <div className="flex items-center gap-2">
      {screenshotUrl && (
        <a href={screenshotUrl} target="_blank" rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 transition-colors" title="View screenshot">
          <ExternalLink size={15} />
        </a>
      )}
      {status !== 'confirmed' && (
        <button onClick={() => update('confirmed')} disabled={isPending}
          className="text-green-600 hover:text-green-700 disabled:opacity-40 transition-colors" title="Mark as paid">
          <CheckCircle2 size={16} />
        </button>
      )}
      {status === 'confirmed' && (
        <button onClick={() => update('pending')} disabled={isPending}
          className="text-gray-400 hover:text-gray-600 disabled:opacity-40 transition-colors" title="Unmark payment">
          <XCircle size={16} />
        </button>
      )}
      {status === 'pending' && (
        <button onClick={() => update('overdue')} disabled={isPending}
          className="text-red-400 hover:text-red-600 disabled:opacity-40 transition-colors text-xs font-medium" title="Mark overdue">
          Overdue
        </button>
      )}
    </div>
  );
}
