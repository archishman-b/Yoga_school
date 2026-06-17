'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Batch } from '@/lib/supabase/types';
import { cn } from '@/lib/utils';
import { CalendarDays, Users, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LEVEL_COLOURS: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700',
};

type Props = { batch: Batch; isEnrolled: boolean; memberId: string; locale: string };

export default function BatchEnrolCard({ batch, isEnrolled, memberId, locale }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>(
    isEnrolled ? 'done' : 'idle'
  );
  const isFull = batch.enrolled >= batch.capacity;

  const handleEnrol = async () => {
    setStatus('loading');
    const supabase = createClient();
    const { error } = await supabase.from('enrollments').insert({
      member_id: memberId,
      batch_id: batch.id,
      start_date: new Date().toISOString().split('T')[0],
      status: 'active',
    });
    if (error) {
      setStatus('error');
    } else {
      setStatus('done');
      router.refresh();
    }
  };

  return (
    <div className={cn('card p-5 flex flex-col gap-3', isEnrolled && 'border-teal-200 bg-teal-50/30')}>
      <div className="flex items-start justify-between">
        <h3 className="font-bold text-gray-900 text-sm leading-snug pr-2">{batch.name_en}</h3>
        <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0', LEVEL_COLOURS[batch.level ?? 'Beginner'])}>
          {batch.level}
        </span>
      </div>

      <div className="space-y-1.5 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <CalendarDays size={13} className="text-gray-400" />
          {batch.timing} · {batch.days}
        </div>
        <div className="flex items-center gap-1.5">
          <Users size={13} className="text-gray-400" />
          {batch.enrolled}/{batch.capacity} seats filled
          {isFull && <span className="text-red-500 font-medium ml-1">· Full</span>}
        </div>
      </div>

      {/* Seat bar */}
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full', isFull ? 'bg-red-400' : 'bg-teal-500')}
          style={{ width: `${Math.min(100, (batch.enrolled / batch.capacity) * 100)}%` }}
        />
      </div>

      {status === 'done' || isEnrolled ? (
        <div className="flex items-center gap-1.5 text-teal-600 text-sm font-medium">
          <CheckCircle2 size={16} /> Enrolled
        </div>
      ) : (
        <button
          onClick={handleEnrol}
          disabled={status === 'loading' || isFull}
          className="btn-primary w-full justify-center disabled:opacity-50"
        >
          {status === 'loading' ? 'Enrolling...' : isFull ? 'Batch Full' : 'Enrol Now'}
        </button>
      )}
      {status === 'error' && <p className="text-red-500 text-xs">Could not enrol. Try again.</p>}
    </div>
  );
}
