'use client';

import { useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Star, Send, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = { memberId: string; existing?: { id: string; body: string; rating: number | null; status: string } | null };

export default function TestimonialForm({ memberId, existing }: Props) {
  const t = useTranslations('testimonialForm');
  const [body, setBody] = useState(existing?.body ?? '');
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [hover, setHover] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    startTransition(async () => {
      const supabase = createClient();
      let err;
      if (existing?.id) {
        ({ error: err } = await supabase
          .from('testimonials')
          .update({ body: body.trim(), rating: rating || null, status: 'pending', updated_at: new Date().toISOString() })
          .eq('id', existing.id));
      } else {
        ({ error: err } = await supabase
          .from('testimonials')
          .insert({ member_id: memberId, body: body.trim(), rating: rating || null, status: 'pending' }));
      }
      if (err) { setError(err.message); return; }
      setDone(true);
    });
  };

  if (done) {
    return (
      <div className="flex items-center gap-3 py-4 text-teal-700">
        <CheckCircle2 size={20} className="shrink-0" />
        <span className="text-sm font-medium">
          {existing ? t('updated') : t('submitted')} {t('afterReview')}
        </span>
      </div>
    );
  }

  const statusPill = existing?.status === 'approved'
    ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{t('statusApproved')}</span>
    : existing?.status === 'pending'
    ? <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{t('statusPending')}</span>
    : existing?.status === 'rejected'
    ? <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">{t('statusRejected')}</span>
    : null;

  return (
    <form onSubmit={submit} className="space-y-4">
      {existing && (
        <div className="flex items-center gap-2 text-sm text-ink/70">
          <span>{t('yourTestimonial')}</span>
          {statusPill}
        </div>
      )}

      {/* Star rating */}
      <div className="flex items-center gap-1">
        {[1,2,3,4,5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n === rating ? 0 : n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              size={22}
              className={n <= (hover || rating) ? 'text-amber-400 fill-amber-400' : 'text-ink/30'}
            />
          </button>
        ))}
        {rating > 0 && <span className="text-xs text-ink/40 ml-1">{rating}/5</span>}
      </div>

      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        rows={4}
        placeholder={t('placeholder')}
        maxLength={500}
        required
        className="w-full rounded-xl border border-teal-600/15 px-4 py-3 text-sm text-ink focus:outline-none focus:border-teal-400 resize-none"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-ink/40">{body.length}/500</span>
        {error && <span className="text-xs text-red-500">{error}</span>}
        <button
          type="submit"
          disabled={isPending || !body.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-40 transition-colors"
        >
          <Send size={14} />
          {isPending ? t('submitting') : existing ? t('update') : t('submit')}
        </button>
      </div>
      <p className="text-xs text-ink/40">{t('reviewNote')}</p>
    </form>
  );
}
