'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Pin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EventPostForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title_en: '', title_hi: '', title_bn: '',
    body_en: '', body_hi: '', body_bn: '',
    media_url: '', event_date: '', pinned: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.title_en) { setError('English title is required.'); return; }
    setSaving(true);
    setError('');
    const supabase = createClient();
    const { error: err } = await supabase.from('events').insert({
      ...form,
      event_date: form.event_date || null,
    });
    setSaving(false);
    if (err) { setError(err.message); return; }
    setOpen(false);
    setForm({ title_en:'', title_hi:'', title_bn:'', body_en:'', body_hi:'', body_bn:'', media_url:'', event_date:'', pinned:false });
    router.refresh();
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-primary">
        <Plus size={16} /> New Post
      </button>
    );
  }

  return (
    <div className="card p-5 space-y-5">
      <h2 className="font-semibold text-gray-900">New Event / Announcement</h2>

      {/* Titles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(['en','hi','bn'] as const).map((l) => (
          <div key={l}>
            <label className="label">Title ({l === 'en' ? 'English *' : l === 'hi' ? 'Hindi' : 'Bengali'})</label>
            <input name={`title_${l}`} value={(form as any)[`title_${l}`]} onChange={set} className="input" />
          </div>
        ))}
      </div>

      {/* Bodies */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(['en','hi','bn'] as const).map((l) => (
          <div key={l}>
            <label className="label">Body ({l === 'en' ? 'English' : l === 'hi' ? 'Hindi' : 'Bengali'})</label>
            <textarea name={`body_${l}`} value={(form as any)[`body_${l}`]} onChange={set} rows={4} className="input resize-none" />
          </div>
        ))}
      </div>

      {/* Media & date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Media URL (YouTube / Google Drive / image)</label>
          <input name="media_url" value={form.media_url} onChange={set} className="input" placeholder="https://youtu.be/..." />
        </div>
        <div>
          <label className="label">Event Date (optional)</label>
          <input name="event_date" type="date" value={form.event_date} onChange={set} className="input" />
        </div>
      </div>

      {/* Pin toggle */}
      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={form.pinned}
          onChange={(e) => setForm((p) => ({ ...p, pinned: e.target.checked }))}
          className="w-4 h-4 rounded border-gray-300 text-saffron-500 focus:ring-saffron-400"
        />
        <Pin size={14} className="text-saffron-500" />
        <span className="text-sm font-medium text-gray-700">Pin this post to top</span>
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? 'Posting...' : 'Post'}
        </button>
        <button onClick={() => setOpen(false)} className="btn-secondary">Cancel</button>
      </div>
    </div>
  );
}
