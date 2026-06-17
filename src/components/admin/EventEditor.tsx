'use client';

import { useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Pin, Trash2, ChevronDown, ChevronUp, Youtube, Image, Link2 } from 'lucide-react';

type Event = {
  id: string;
  title_en: string; title_hi: string | null; title_bn: string | null;
  body_en: string | null;
  media_url: string | null;
  media_type: 'youtube' | 'image' | 'drive' | null;
  tags: string[] | null;
  event_date: string | null;
  pinned: boolean;
  created_at: string;
};

const blank = (): Partial<Event> => ({
  title_en: '', title_hi: '', title_bn: '',
  body_en: '', media_url: '', media_type: null,
  tags: [], event_date: '', pinned: false,
});

export default function EventEditor({ events: initial }: { events: Event[] }) {
  const [events, setEvents] = useState(initial);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState(blank());
  const [tagInput, setTagInput] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const create = () => {
    startTransition(async () => {
      const supabase = createClient();
      const payload = {
        ...form,
        tags: form.tags?.filter(Boolean),
        media_type: form.media_url ? (form.media_type ?? 'image') : null,
        event_date: form.event_date || null,
      };
      const { data } = await supabase.from('events').insert(payload).select().single();
      if (data) { setEvents(prev => [data, ...prev]); setShowNew(false); setForm(blank()); setTagInput(''); }
    });
  };

  const togglePin = (id: string, pinned: boolean) => {
    startTransition(async () => {
      const supabase = createClient();
      await supabase.from('events').update({ pinned: !pinned }).eq('id', id);
      setEvents(prev => prev.map(e => e.id === id ? { ...e, pinned: !pinned } : e));
    });
  };

  const remove = (id: string) => {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    startTransition(async () => {
      const supabase = createClient();
      await supabase.from('events').delete().eq('id', id);
      setEvents(prev => prev.filter(e => e.id !== id));
    });
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !(form.tags ?? []).includes(t)) {
      setForm(f => ({ ...f, tags: [...(f.tags ?? []), t] }));
      setTagInput('');
    }
  };

  return (
    <div className="space-y-4">
      {/* New event form */}
      {!showNew ? (
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors">
          <Plus size={16} /> New Event
        </button>
      ) : (
        <div className="bg-white rounded-2xl border border-teal-200 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">New Event / Post</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input placeholder="Title (English) *" value={form.title_en ?? ''} onChange={e => setForm(f => ({ ...f, title_en: e.target.value }))}
              className="col-span-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-teal-400" />
            <input placeholder="Title (Hindi)" value={form.title_hi ?? ''} onChange={e => setForm(f => ({ ...f, title_hi: e.target.value }))}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-teal-400" />
            <input placeholder="Title (Bengali)" value={form.title_bn ?? ''} onChange={e => setForm(f => ({ ...f, title_bn: e.target.value }))}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-teal-400" />
          </div>

          <textarea placeholder="Content / Description" value={form.body_en ?? ''} rows={4}
            onChange={e => setForm(f => ({ ...f, body_en: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:border-teal-400" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input placeholder="Media URL (YouTube / Drive / Image)" value={form.media_url ?? ''} onChange={e => setForm(f => ({ ...f, media_url: e.target.value }))}
              className="col-span-2 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-teal-400" />
            <select value={form.media_type ?? ''} onChange={e => setForm(f => ({ ...f, media_type: (e.target.value || null) as any }))}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-teal-400 text-gray-600">
              <option value="">Media type</option>
              <option value="youtube">YouTube</option>
              <option value="drive">Google Drive</option>
              <option value="image">Image URL</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input type="date" value={form.event_date ?? ''} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-teal-400" />
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input type="checkbox" checked={form.pinned ?? false} onChange={e => setForm(f => ({ ...f, pinned: e.target.checked }))}
                className="rounded" />
              Pin to top
            </label>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input placeholder="Add tag…" value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm flex-1 focus:outline-none focus:border-teal-400" />
              <button type="button" onClick={addTag} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-sm hover:bg-gray-200">Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(form.tags ?? []).map(t => (
                <span key={t} className="bg-teal-50 text-teal-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  {t}
                  <button onClick={() => setForm(f => ({ ...f, tags: (f.tags ?? []).filter(x => x !== t) }))} className="hover:text-red-500">×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={create} disabled={isPending || !form.title_en?.trim()}
              className="px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-40 transition-colors">
              {isPending ? 'Publishing…' : 'Publish'}
            </button>
            <button onClick={() => { setShowNew(false); setForm(blank()); setTagInput(''); }}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Event list */}
      {events.map(event => (
        <div key={event.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 text-gray-300">
                {event.media_type === 'youtube' ? <Youtube size={16} /> : event.media_type === 'image' ? <Image size={16} /> : event.media_type === 'drive' ? <Link2 size={16} /> : <span className="w-4 h-4 block" />}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{event.title_en}</p>
                <p className="text-xs text-gray-400">
                  {new Date(event.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                  {event.pinned && <span className="ml-2 text-saffron-600 font-semibold">📌 Pinned</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => togglePin(event.id, event.pinned)} disabled={isPending}
                className={`p-1.5 rounded-lg transition-colors ${event.pinned ? 'text-saffron-600 bg-saffron-50' : 'text-gray-400 hover:bg-gray-50'}`}
                title={event.pinned ? 'Unpin' : 'Pin to top'}>
                <Pin size={14} />
              </button>
              <button onClick={() => remove(event.id)} disabled={isPending}
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors" title="Delete">
                <Trash2 size={14} />
              </button>
              <button onClick={() => setExpanded(expanded === event.id ? null : event.id)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors">
                {expanded === event.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>
          {expanded === event.id && event.body_en && (
            <div className="px-5 pb-4 text-sm text-gray-600 border-t border-gray-50 pt-3 leading-relaxed">
              {event.body_en}
            </div>
          )}
        </div>
      ))}

      {events.length === 0 && !showNew && (
        <p className="text-gray-400 text-sm text-center py-12">No events yet — click "New Event" to create one.</p>
      )}
    </div>
  );
}
