'use client';

import { useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Star, Check, X, GripVertical, Eye, EyeOff } from 'lucide-react';

type Testimonial = {
  id: string;
  body: string;
  rating: number | null;
  status: string;
  display_order: number | null;
  created_at: string;
  member?: { full_name: string | null; photo_url: string | null };
};

type Props = { testimonials: Testimonial[] };

function Stars({ n }: { n: number | null }) {
  if (!n) return null;
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} className={i <= n ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
      ))}
    </span>
  );
}

export default function TestimonialModerator({ testimonials: initial }: Props) {
  const [items, setItems] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const [order, setOrder] = useState<Record<string, string>>(
    Object.fromEntries(initial.map(t => [t.id, String(t.display_order ?? '')]))
  );

  const update = (id: string, patch: Partial<Testimonial>) => {
    startTransition(async () => {
      const supabase = createClient();
      await supabase.from('testimonials').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
      setItems(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
    });
  };

  const toggleDisplay = (t: Testimonial) => {
    const newOrder = t.display_order !== null ? null : (Math.max(0, ...items.map(i => i.display_order ?? 0)) + 1);
    update(t.id, { display_order: newOrder });
    setOrder(prev => ({ ...prev, [t.id]: newOrder !== null ? String(newOrder) : '' }));
  };

  const saveOrder = (t: Testimonial) => {
    const val = parseInt(order[t.id]);
    if (!isNaN(val)) update(t.id, { display_order: val });
  };

  const approved = items.filter(t => t.status === 'approved');
  const pending  = items.filter(t => t.status === 'pending');
  const rejected = items.filter(t => t.status === 'rejected');

  const Card = ({ t }: { t: Testimonial }) => (
    <div className={`bg-white border rounded-2xl p-5 space-y-3 ${t.status === 'approved' ? 'border-teal-200' : t.status === 'rejected' ? 'border-gray-100 opacity-60' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {t.member?.photo_url
            ? <img src={t.member.photo_url} className="w-9 h-9 rounded-full object-cover" alt="" />
            : <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-bold shrink-0">
                {t.member?.full_name?.[0] ?? '?'}
              </div>
          }
          <div>
            <p className="font-semibold text-gray-900 text-sm">{t.member?.full_name ?? 'Member'}</p>
            <p className="text-gray-400 text-xs">{new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
        <Stars n={t.rating} />
      </div>

      <p className="text-gray-700 text-sm leading-relaxed">"{t.body}"</p>

      <div className="flex items-center gap-2 flex-wrap pt-1">
        {t.status !== 'approved' && (
          <button onClick={() => update(t.id, { status: 'approved' })}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-xs font-semibold hover:bg-teal-100 transition-colors">
            <Check size={13}/> Approve
          </button>
        )}
        {t.status !== 'rejected' && (
          <button onClick={() => update(t.id, { status: 'rejected' })}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors">
            <X size={13}/> Reject
          </button>
        )}
        {t.status === 'approved' && (
          <>
            <button
              onClick={() => toggleDisplay(t)}
              disabled={isPending}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                t.display_order !== null
                  ? 'bg-saffron-50 text-saffron-700 hover:bg-saffron-100'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t.display_order !== null ? <><Eye size={13}/> On landing page</> : <><EyeOff size={13}/> Hidden</>}
            </button>
            {t.display_order !== null && (
              <div className="flex items-center gap-1.5">
                <GripVertical size={13} className="text-gray-300" />
                <span className="text-xs text-gray-400">Order:</span>
                <input
                  type="number"
                  min={1}
                  value={order[t.id]}
                  onChange={e => setOrder(prev => ({ ...prev, [t.id]: e.target.value }))}
                  onBlur={() => saveOrder(t)}
                  onKeyDown={e => e.key === 'Enter' && saveOrder(t)}
                  className="w-14 border border-gray-200 rounded-lg px-2 py-0.5 text-xs text-center font-semibold focus:outline-none focus:border-teal-400"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Landing page display summary */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl px-5 py-4">
        <p className="text-sm font-semibold text-teal-900">
          {approved.filter(t => t.display_order !== null).length} testimonial{approved.filter(t => t.display_order !== null).length !== 1 ? 's' : ''} showing on landing page
          {' '}· {approved.length} approved total
        </p>
        <p className="text-xs text-teal-600 mt-0.5">Approve a testimonial, then toggle "On landing page" and set its display order.</p>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-3">Pending Review ({pending.length})</h3>
          <div className="space-y-3">{pending.map(t => <Card key={t.id} t={t} />)}</div>
        </div>
      )}

      {/* Approved */}
      {approved.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-teal-700 uppercase tracking-wide mb-3">Approved ({approved.length})</h3>
          <div className="space-y-3">{approved.map(t => <Card key={t.id} t={t} />)}</div>
        </div>
      )}

      {/* Rejected */}
      {rejected.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Not Selected ({rejected.length})</h3>
          <div className="space-y-3">{rejected.map(t => <Card key={t.id} t={t} />)}</div>
        </div>
      )}

      {items.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-12">No testimonials yet. Members can submit from their profile page.</p>
      )}
    </div>
  );
}
