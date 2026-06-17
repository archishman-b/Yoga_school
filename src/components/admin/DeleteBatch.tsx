'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeleteBatch({ batchId }: { batchId: string }) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.from('batches').update({ status: 'cancelled' }).eq('id', batchId);
    setLoading(false);
    setConfirm(false);
    router.refresh();
  };

  if (confirm) {
    return (
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={handleDelete} disabled={loading}
          className="px-3 py-1.5 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium disabled:opacity-50">
          {loading ? '…' : 'Confirm'}
        </button>
        <button onClick={() => setConfirm(false)}
          className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg font-medium">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirm(true)}
      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0">
      <Trash2 size={15} />
    </button>
  );
}
