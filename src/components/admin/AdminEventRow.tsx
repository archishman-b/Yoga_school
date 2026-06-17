'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Pin, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Event = { id: string; title_en?: string; event_date?: string; pinned: boolean; created_at: string };

export default function AdminEventRow({ event }: { event: Event }) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.from('events').delete().eq('id', event.id);
    setLoading(false);
    router.refresh();
  };

  const togglePin = async () => {
    const supabase = createClient();
    await supabase.from('events').update({ pinned: !event.pinned }).eq('id', event.id);
    router.refresh();
  };

  return (
    <div className="card p-4 flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {event.pinned && <Pin size={13} className="text-saffron-500 shrink-0" />}
          <p className="font-medium text-gray-900 text-sm truncate">{event.title_en ?? '(no title)'}</p>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          {event.event_date
            ? new Date(event.event_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            : new Date(event.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
      </div>

      <button
        onClick={togglePin}
        title={event.pinned ? 'Unpin' : 'Pin to top'}
        className={`p-2 rounded-lg transition-colors ${
          event.pinned
            ? 'bg-saffron-50 text-saffron-600 hover:bg-saffron-100'
            : 'text-gray-400 hover:bg-gray-50 hover:text-saffron-500'
        }`}
      >
        <Pin size={15} />
      </button>

      {confirm ? (
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-1.5 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? '…' : 'Delete'}
          </button>
          <button
            onClick={() => setConfirm(false)}
            className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg font-medium"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirm(true)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
}
