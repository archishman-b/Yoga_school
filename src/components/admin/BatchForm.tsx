'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const DAYS_OPTIONS = [
  'Mon–Fri', 'Mon/Wed/Fri', 'Tue/Thu/Sat', 'Sat/Sun',
  'Mon–Sat', 'Daily',
];

export default function BatchForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name_en: '', name_hi: '', name_bn: '',
    timing: '', days: '', level: 'Beginner',
    capacity: 20, fee_monthly: 1500,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === 'capacity' || name === 'fee_monthly' ? +value : value }));
  };

  const handleSave = async () => {
    if (!form.name_en || !form.timing) { setError('Name and timing are required.'); return; }
    setSaving(true);
    setError('');
    const supabase = createClient();
    const { error: err } = await supabase.from('batches').insert({
      ...form,
      status: 'active',
      enrolled: 0,
    });
    setSaving(false);
    if (err) { setError(err.message); return; }
    setOpen(false);
    setForm({ name_en: '', name_hi: '', name_bn: '', timing: '', days: '', level: 'Beginner', capacity: 20, fee_monthly: 1500 });
    router.refresh();
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-secondary">
        <Plus size={16} /> Add Batch
      </button>
    );
  }

  return (
    <div className="card p-5 space-y-4">
      <h2 className="font-semibold text-gray-900">New Batch</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="label">Name (English) *</label>
            <input name="name_en" value={form.name_en} onChange={handleChange} className="input" placeholder="Morning Beginner Yoga" />
          </div>
          <div>
            <label className="label">Name (Hindi)</label>
            <input name="name_hi" value={form.name_hi} onChange={handleChange} className="input" placeholder="सुबह की योग कक्षा" />
          </div>
          <div>
            <label className="label">Name (Bengali)</label>
            <input name="name_bn" value={form.name_bn} onChange={handleChange} className="input" placeholder="সকালের যোগ ক্লাস" />
          </div>
        </div>

        <div>
          <label className="label">Timing *</label>
          <input name="timing" value={form.timing} onChange={handleChange} className="input" placeholder="6:00–7:00 AM" />
        </div>
        <div>
          <label className="label">Days</label>
          <select name="days" value={form.days} onChange={handleChange} className="input">
            <option value="">—</option>
            {DAYS_OPTIONS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Level</label>
          <select name="level" value={form.level} onChange={handleChange} className="input">
            {LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Capacity</label>
          <input name="capacity" type="number" min={1} value={form.capacity} onChange={handleChange} className="input" />
        </div>
        <div>
          <label className="label">Monthly Fee (₹)</label>
          <input name="fee_monthly" type="number" min={0} value={form.fee_monthly} onChange={handleChange} className="input" />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Batch'}
        </button>
        <button onClick={() => setOpen(false)} className="btn-secondary">Cancel</button>
      </div>
    </div>
  );
}
