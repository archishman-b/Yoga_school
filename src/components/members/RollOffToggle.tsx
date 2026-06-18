'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { PauseCircle, PlayCircle } from 'lucide-react';

type Props = {
  enrollmentId: string;
  memberId: string;
  currentStatus: 'active' | 'paused' | 'cancelled';
  batchName: string;
};

export default function RollOffToggle({ enrollmentId, memberId, currentStatus, batchName }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const isActive = currentStatus === 'active';

  const toggle = async () => {
    setLoading(true);
    const supabase = createClient();
    const newStatus = isActive ? 'paused' : 'active';
    const today = new Date().toISOString().split('T')[0];

    await supabase.from('enrollments').update({ status: newStatus }).eq('id', enrollmentId);

    // Record in pause history
    if (isActive) {
      await supabase.from('enrollment_pauses').insert({
        enrollment_id: enrollmentId,
        member_id: memberId,
        paused_at: today,
        reason: reason || null,
      });
    } else {
      // Close the most recent open pause
      const { data: openPause } = await supabase
        .from('enrollment_pauses')
        .select('id')
        .eq('enrollment_id', enrollmentId)
        .is('resumed_at', null)
        .order('paused_at', { ascending: false })
        .limit(1)
        .single();
      if (openPause) {
        await supabase.from('enrollment_pauses').update({ resumed_at: today }).eq('id', openPause.id);
      }
    }

    setLoading(false);
    setShowConfirm(false);
    setReason('');
    router.refresh();
  };

  if (showConfirm) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
        <p className="text-sm font-medium text-amber-900">
          {isActive ? `Roll off from "${batchName}"?` : `Resume "${batchName}"?`}
        </p>
        {isActive && (
          <div>
            <label className="text-xs text-amber-700 font-medium block mb-1">Reason (optional)</label>
            <input
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Summer break, travel…"
              className="w-full px-3 py-2 rounded-lg border border-amber-200 text-sm bg-cream focus:outline-none focus:border-amber-400"
            />
          </div>
        )}
        <div className="flex gap-2">
          <button onClick={toggle} disabled={loading}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg disabled:opacity-60 transition-colors">
            {loading ? 'Saving…' : 'Confirm'}
          </button>
          <button onClick={() => setShowConfirm(false)}
            className="px-4 py-1.5 bg-cream border border-teal-600/15 text-ink/70 text-sm rounded-lg hover:bg-cream-dark/50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button onClick={() => setShowConfirm(true)}
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
        isActive
          ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
          : 'text-teal-700 bg-teal-50 hover:bg-teal-100'
      }`}>
      {isActive
        ? <><PauseCircle size={14} /> Roll Off</>
        : <><PlayCircle size={14} /> Roll Back On</>}
    </button>
  );
}
