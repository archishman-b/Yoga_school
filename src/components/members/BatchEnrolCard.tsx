'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import type { Batch } from '@/lib/supabase/types';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {
  batch: Batch;
  isEnrolled: boolean;
  memberId: string;
  locale: string;
  compact?: boolean;
  disabled?: boolean;
};

export default function BatchEnrolCard({ batch, isEnrolled, memberId, locale, compact, disabled }: Props) {
  const t = useTranslations('batches');
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>(
    isEnrolled ? 'done' : 'idle'
  );

  const handleEnrol = async () => {
    setStatus('loading');
    const supabase = createClient();
    const { error } = await supabase.from('enrollments').insert({
      member_id: memberId,
      batch_id: batch.id,
      start_date: new Date().toISOString().split('T')[0],
      status: 'active',
    });
    if (error) setStatus('error');
    else { setStatus('done'); router.refresh(); }
  };

  const isDone = status === 'done' || isEnrolled;

  const button = isDone ? (
    <div className="flex items-center gap-1.5 text-teal-600 text-sm font-medium">
      <CheckCircle2 size={15} /> {t('enrolled')}
    </div>
  ) : (
    <button
      onClick={handleEnrol}
      disabled={status === 'loading' || !!disabled}
      className={cn(
        'px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors',
        disabled
          ? 'bg-cream-dark text-ink/40 cursor-not-allowed'
          : 'bg-saffron-500 hover:bg-saffron-600 text-white',
        status === 'loading' && 'opacity-60 cursor-wait'
      )}
    >
      {status === 'loading' ? t('enrolling') : disabled ? t('full') : t('enrol')}
    </button>
  );

  if (compact) return (
    <div>
      {button}
      {status === 'error' && <p className="text-red-500 text-xs mt-1">Try again.</p>}
    </div>
  );

  return (
    <div className={cn('card p-5 flex flex-col gap-3', isEnrolled && 'border-teal-200 bg-teal-50/30')}>
      <div className="flex items-start justify-between">
        <h3 className="font-bold text-ink text-sm leading-snug pr-2">{batch.name_en}</h3>
      </div>
      <div className="text-xs text-ink/55">{batch.timing} · {batch.days}</div>
      {button}
      {status === 'error' && <p className="text-red-500 text-xs">Could not enrol. Try again.</p>}
    </div>
  );
}
