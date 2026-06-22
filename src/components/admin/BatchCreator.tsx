'use client';

import { useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';

const blank = () => ({
  batch_code:       '',
  timing:           '',
  days:             'Mon–Sat',
  mode:             'offline' as 'online' | 'offline',
  fee_monthly:      0,
  display_fill_pct: 40,
  capacity:         30,
  status:           'active',
});

export default function BatchCreator() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank());
  const [error, setError] = useState('');
  const [isPending, start] = useTransition();

  const set = (k: keyof ReturnType<typeof blank>, v: any) =>
    setForm(f => ({ ...f, [k]: v }));

  const create = () => {
    if (!form.batch_code.trim() || !form.timing.trim()) {
      setError('Batch code and timing are required.'); return;
    }
    setError('');
    start(async () => {
      const supabase = createClient();
      const name_en = `${form.timing} (${form.mode === 'online' ? 'Online' : 'Classroom'})`;
      const { error: err } = await supabase.from('batches').insert({
        ...form,
        batch_code: form.batch_code.toUpperCase().trim(),
        name_en,
        name_hi: null, name_bn: null,
      });
      if (err) { setError(err.message); return; }
      setOpen(false);
      setForm(blank());
      router.refresh();
    });
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors"
      >
        <Plus size={16} /> Add New Batch
      </button>
    );
  }

  return (
    <div className="bg-white border-2 border-teal-200 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">New Batch</h3>
        <button onClick={() => { setOpen(false); setForm(blank()); setError(''); }}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Batch code */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Batch Code <span className="text-red-400">*</span>
          </label>
          <input
            value={form.batch_code}
            onChange={e => set('batch_code', e.target.value.toUpperCase())}
            placeholder="e.g. M5-CR"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-mono font-bold focus:outline-none focus:border-teal-400"
          />
          <p className="text-xs text-gray-400 mt-1">M/N/E + number + -OL or -CR</p>
        </div>

        {/* Timing */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Timing <span className="text-red-400">*</span>
          </label>
          <input
            value={form.timing}
            onChange={e => set('timing', e.target.value)}
            placeholder="e.g. 9:15 AM – 10:15 AM"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-teal-400"
          />
        </div>

        {/* Days */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Days</label>
          <input
            value={form.days}
            onChange={e => set('days', e.target.value)}
            placeholder="e.g. Mon–Sat"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-teal-400"
          />
        </div>

        {/* Mode */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Mode</label>
          <select value={form.mode} onChange={e => set('mode', e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-teal-400">
            <option value="offline">Classroom (CR)</option>
            <option value="online">Online (OL)</option>
          </select>
        </div>

        {/* Fee */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Monthly Fee (₹)</label>
          <input type="number" value={form.fee_monthly} onChange={e => set('fee_monthly', Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-teal-400" />
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Capacity</label>
          <input type="number" value={form.capacity} onChange={e => set('capacity', Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-teal-400" />
        </div>
      </div>

      {/* Fill rate preview */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Initial Availability Display ({form.display_fill_pct}%)
        </label>
        <input type="range" min={0} max={100} step={5} value={form.display_fill_pct}
          onChange={e => set('display_fill_pct', Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-teal-600" />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button onClick={create} disabled={isPending}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors">
          <Plus size={15} />
          {isPending ? 'Creating…' : 'Create Batch'}
        </button>
        <button onClick={() => { setOpen(false); setForm(blank()); setError(''); }}
          className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}
