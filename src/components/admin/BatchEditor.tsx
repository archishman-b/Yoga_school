'use client';

import { useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Save, ChevronDown, ChevronUp } from 'lucide-react';

type Batch = {
  id: string;
  batch_code: string;
  timing: string;
  days: string;
  fee_monthly: number;
  display_fill_pct: number;
  capacity: number;
  mode: string;
  status: string;
  name_en: string;
};

type Props = { batch: Batch };

function trackColor(pct: number) {
  if (pct <= 25) return '#16a34a';
  if (pct <= 55) return '#0d9488';
  if (pct <= 80) return '#d97706';
  return '#dc2626';
}

function fillLabel(pct: number) {
  if (pct <= 25) return 'Open';
  if (pct <= 55) return 'Filling Up';
  if (pct <= 80) return 'Almost Full';
  return 'Full';
}

export default function BatchEditor({ batch }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    timing:           batch.timing       ?? '',
    days:             batch.days         ?? '',
    fee_monthly:      batch.fee_monthly  ?? 200,
    display_fill_pct: batch.display_fill_pct ?? 40,
    capacity:         batch.capacity     ?? 30,
    status:           batch.status       ?? 'active',
  });
  const [saved, setSaved] = useState(true);
  const [isPending, start] = useTransition();

  const change = (k: keyof typeof form, v: any) => {
    setForm(prev => ({ ...prev, [k]: v }));
    setSaved(false);
  };

  const save = () => {
    start(async () => {
      const supabase = createClient();
      await supabase.from('batches').update(form).eq('id', batch.id);
      setSaved(true);
    });
  };

  const modeIcon = batch.mode === 'online' ? '📡' : '🏛️';
  const statusColor = form.status === 'active' ? 'text-teal-600' : form.status === 'paused' ? 'text-amber-600' : 'text-gray-400';

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${open ? 'border-teal-200 shadow-sm' : 'border-gray-100'}`}>
      {/* Header row — always visible */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-gray-50/50 transition-colors"
      >
        <span className="text-base">{modeIcon}</span>
        <span className="font-mono font-bold text-teal-700 text-sm w-24 shrink-0">{batch.batch_code}</span>
        <span className="text-sm text-gray-700 flex-1">{form.timing}</span>
        <span className={`text-xs font-semibold capitalize ${statusColor}`}>{form.status}</span>
        <span className="text-xs text-gray-400 hidden sm:block">₹{form.fee_monthly}/mo</span>
        <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden hidden sm:block">
          <div className="h-full rounded-full transition-all" style={{ width: `${form.display_fill_pct}%`, backgroundColor: trackColor(form.display_fill_pct) }} />
        </div>
        <span className="text-xs text-gray-400">{fillLabel(form.display_fill_pct)}</span>
        {open ? <ChevronUp size={15} className="text-gray-400 shrink-0" /> : <ChevronDown size={15} className="text-gray-400 shrink-0" />}
      </button>

      {/* Expanded editor */}
      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-gray-100 space-y-4 bg-gray-50/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-3">
            {/* Timing */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Timing</label>
              <input
                value={form.timing}
                onChange={e => change('timing', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-teal-400 bg-white"
                placeholder="e.g. 6:15 AM – 7:15 AM"
              />
            </div>

            {/* Days */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Days</label>
              <input
                value={form.days}
                onChange={e => change('days', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-teal-400 bg-white"
                placeholder="e.g. Mon – Sat"
              />
            </div>

            {/* Fee */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Monthly Fee (₹)</label>
              <input
                type="number"
                value={form.fee_monthly}
                onChange={e => change('fee_monthly', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-teal-400 bg-white"
              />
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Capacity</label>
              <input
                type="number"
                value={form.capacity}
                onChange={e => change('capacity', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-teal-400 bg-white"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => change('status', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-teal-400 bg-white"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="ended">Ended</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Fill slider */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Member-Visible Availability — <span style={{ color: trackColor(form.display_fill_pct) }}>{fillLabel(form.display_fill_pct)}</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range" min={0} max={100} step={5}
                value={form.display_fill_pct}
                onChange={e => change('display_fill_pct', Number(e.target.value))}
                className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, ${trackColor(form.display_fill_pct)} ${form.display_fill_pct}%, #e5e7eb ${form.display_fill_pct}%)` }}
              />
              <span className="text-sm font-semibold text-gray-600 w-8">{form.display_fill_pct}%</span>
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={save}
              disabled={isPending || saved}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Save size={14} />
              {isPending ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
            </button>
            <p className="text-xs text-gray-400">
              Batch code <span className="font-mono font-bold text-gray-600">{batch.batch_code}</span> never changes — safe to update timing above.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
