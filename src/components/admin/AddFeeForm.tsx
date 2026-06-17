'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Member = { id: string; full_name: string | null; email: string };
type Props = { members: Member[] };

export default function AddFeeForm({ members }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [form, setForm] = useState({
    member_id: '', month: currentMonth, amount: 1500,
    due_date: `${currentMonth}-07`, status: 'pending',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === 'amount' ? +value : value }));
  };

  const handleSave = async () => {
    if (!form.member_id) { setError('Please select a member.'); return; }
    setSaving(true);
    setError('');
    const supabase = createClient();
    const { error: err } = await supabase.from('fee_records').insert(form);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setOpen(false);
    router.refresh();
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-secondary">
        <Plus size={16} /> Add Fee Record
      </button>
    );
  }

  return (
    <div className="card p-5 space-y-4">
      <h2 className="font-semibold text-gray-900">New Fee Record</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label">Member *</label>
          <select name="member_id" value={form.member_id} onChange={handleChange} className="input">
            <option value="">— Select member —</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.full_name ?? m.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Month *</label>
          <input name="month" type="month" value={form.month} onChange={handleChange} className="input" />
        </div>
        <div>
          <label className="label">Amount (₹) *</label>
          <input name="amount" type="number" min={0} value={form.amount} onChange={handleChange} className="input" />
        </div>
        <div>
          <label className="label">Due Date</label>
          <input name="due_date" type="date" value={form.due_date} onChange={handleChange} className="input" />
        </div>
        <div>
          <label className="label">Initial Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="input">
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed (already paid)</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button onClick={() => setOpen(false)} className="btn-secondary">Cancel</button>
      </div>
    </div>
  );
}
