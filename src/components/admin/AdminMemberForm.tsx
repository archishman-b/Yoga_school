'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, Copy, Check } from 'lucide-react';

// ── Field definitions ────────────────────────────────────────────────────────
const GENDER_OPTIONS   = ['', 'female', 'male', 'other', 'prefer_not_to_say'] as const;
const MARITAL_OPTIONS  = ['', 'married', 'single', 'widowed', 'divorced', 'other'] as const;
const DIET_OPTIONS     = ['', 'vegetarian', 'non-vegetarian', 'vegan', 'other'] as const;
const LANG_OPTIONS     = [['en', 'English'], ['hi', 'Hindi'], ['bn', 'Bengali']] as const;
const NAVAL_OPTIONS    = ['', 'normal', 'displaced'] as const;

export type MemberFormData = {
  full_name:                string;
  phone:                    string;
  gender:                   string;
  date_of_birth:            string;
  guardian_name:            string;
  address:                  string;
  occupation:               string;
  marital_status:           string;
  mother_tongue:            string;
  education:                string;
  height_cm:                string;
  weight_kg:                string;
  diet_preference:          string;
  emergency_contact:        string;
  preferred_language:       string;
  joined_date:              string;
  course_interest:          string;
  medical_conditions:       string;
  cardiovascular_conditions: string;
  previous_yoga:            boolean;
  doctor_referral:          boolean;
  ailments:                 string;
  naval_assessment_result:  string;
};

export const EMPTY_FORM: MemberFormData = {
  full_name: '', phone: '', gender: '', date_of_birth: '', guardian_name: '',
  address: '', occupation: '', marital_status: '', mother_tongue: '', education: '',
  height_cm: '', weight_kg: '', diet_preference: '', emergency_contact: '',
  preferred_language: 'en', joined_date: '', course_interest: '',
  medical_conditions: '', cardiovascular_conditions: '',
  previous_yoga: false, doctor_referral: false,
  ailments: '', naval_assessment_result: '',
};

type Credentials = { member_id: string; password: string };

type Props = {
  mode:          'add' | 'edit';
  memberId?:     string;   // user UUID (for edit mode)
  initial?:      Partial<MemberFormData>;
  onSuccess?:    () => void;
  onClose:       () => void;
};

function Field({ label, children, half }: { label: string; children: React.ReactNode; half?: boolean }) {
  return (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-teal-500 transition-colors bg-white';
const selectCls = inputCls;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button" onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="ml-2 text-gray-400 hover:text-teal-600 transition-colors inline-flex items-center">
      {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
    </button>
  );
}

export default function AdminMemberForm({ mode, memberId, initial = {}, onSuccess, onClose }: Props) {
  const [form,    setForm]    = useState<MemberFormData>({ ...EMPTY_FORM, ...initial });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [creds,   setCreds]   = useState<Credentials | null>(null);

  const set = (field: keyof MemberFormData, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim()) { setError('Full name is required.'); return; }
    setLoading(true); setError('');

    const payload: Record<string, unknown> = {
      ...form,
      height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
      weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
    };
    // Remove empty strings
    Object.keys(payload).forEach(k => { if (payload[k] === '') payload[k] = null; });

    const url    = mode === 'add' ? '/api/admin/create-member' : '/api/admin/update-member';
    const method = mode === 'add' ? 'POST' : 'PATCH';
    if (mode === 'edit') payload.id = memberId;

    const res  = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return; }

    if (mode === 'add' && data.member_id) {
      setCreds({ member_id: data.member_id, password: data.password });
    } else {
      onSuccess?.();
      onClose();
    }
  };

  // ── Success state after Add: show credentials ───────────────────────────
  if (creds) {
    return (
      <div className="flex flex-col items-center gap-5 py-4 text-center">
        <CheckCircle2 size={48} className="text-teal-500" />
        <div>
          <p className="font-bold text-gray-900 text-lg">Account Created!</p>
          <p className="text-sm text-gray-500 mt-1">Share these credentials with the member over WhatsApp.</p>
        </div>
        <div className="bg-teal-50 border border-teal-200 rounded-xl px-6 py-4 w-full text-left space-y-3">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-0.5">Member ID</p>
            <p className="font-mono text-xl font-bold text-teal-700">{creds.member_id}<CopyButton text={creds.member_id} /></p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-0.5">Temporary Password</p>
            <p className="font-mono text-xl font-bold text-gray-800">{creds.password}<CopyButton text={creds.password} /></p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-0.5">Login URL</p>
            <p className="text-xs text-teal-600 break-all">{typeof window !== 'undefined' ? window.location.origin : ''}/members/login</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 max-w-xs">
          The member can update their password after first login from the Profile page.
        </p>
        <div className="flex gap-3">
          <button type="button" onClick={() => { setCreds(null); setForm({ ...EMPTY_FORM }); }}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors">
            Add Another Member
          </button>
          <button type="button" onClick={() => { onSuccess?.(); onClose(); }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors">
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Basic info ── */}
      <section>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Basic Information</h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Full Name *" >
            <input className={inputCls} required value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Sunita Sharma" />
          </Field>
          <Field label="Phone" half>
            <input className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="98765 43210" />
          </Field>
          <Field label="Gender" half>
            <select className={selectCls} value={form.gender} onChange={e => set('gender', e.target.value)}>
              {GENDER_OPTIONS.map(o => <option key={o} value={o}>{o || '— select —'}</option>)}
            </select>
          </Field>
          <Field label="Date of Birth" half>
            <input className={inputCls} type="date" value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} />
          </Field>
          <Field label="Guardian / Spouse Name" half>
            <input className={inputCls} value={form.guardian_name} onChange={e => set('guardian_name', e.target.value)} placeholder="Ramesh Sharma" />
          </Field>
          <Field label="Address">
            <textarea className={inputCls} rows={2} value={form.address} onChange={e => set('address', e.target.value)} placeholder="12 Park Street, Kolkata 700016" />
          </Field>
          <Field label="Emergency Contact" half>
            <input className={inputCls} value={form.emergency_contact} onChange={e => set('emergency_contact', e.target.value)} placeholder="Phone number" />
          </Field>
          <Field label="Joined Date" half>
            <input className={inputCls} type="date" value={form.joined_date} onChange={e => set('joined_date', e.target.value)} />
          </Field>
        </div>
      </section>

      {/* ── Demographics ── */}
      <section>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Demographics</h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Occupation" half>
            <input className={inputCls} value={form.occupation} onChange={e => set('occupation', e.target.value)} placeholder="Homemaker / Teacher…" />
          </Field>
          <Field label="Marital Status" half>
            <select className={selectCls} value={form.marital_status} onChange={e => set('marital_status', e.target.value)}>
              {MARITAL_OPTIONS.map(o => <option key={o} value={o}>{o || '— select —'}</option>)}
            </select>
          </Field>
          <Field label="Mother Tongue" half>
            <input className={inputCls} value={form.mother_tongue} onChange={e => set('mother_tongue', e.target.value)} placeholder="Bengali" />
          </Field>
          <Field label="Education" half>
            <input className={inputCls} value={form.education} onChange={e => set('education', e.target.value)} placeholder="Graduate / Post Graduate…" />
          </Field>
          <Field label="Portal Language" half>
            <select className={selectCls} value={form.preferred_language} onChange={e => set('preferred_language', e.target.value)}>
              {LANG_OPTIONS.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
            </select>
          </Field>
        </div>
      </section>

      {/* ── Physical ── */}
      <section>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Physical</h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Height (cm)" half>
            <input className={inputCls} type="number" step="0.1" value={form.height_cm} onChange={e => set('height_cm', e.target.value)} placeholder="158" />
          </Field>
          <Field label="Weight (kg)" half>
            <input className={inputCls} type="number" step="0.1" value={form.weight_kg} onChange={e => set('weight_kg', e.target.value)} placeholder="62" />
          </Field>
          <Field label="Diet Preference" half>
            <select className={selectCls} value={form.diet_preference} onChange={e => set('diet_preference', e.target.value)}>
              {DIET_OPTIONS.map(o => <option key={o} value={o}>{o || '— select —'}</option>)}
            </select>
          </Field>
        </div>
      </section>

      {/* ── Health ── */}
      <section>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Health & Medical</h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Medical Conditions">
            <textarea className={inputCls} rows={2} value={form.medical_conditions} onChange={e => set('medical_conditions', e.target.value)} placeholder="Diabetes, Hypertension…" />
          </Field>
          <Field label="Cardiovascular Conditions">
            <textarea className={inputCls} rows={2} value={form.cardiovascular_conditions} onChange={e => set('cardiovascular_conditions', e.target.value)} placeholder="None / Arrhythmia…" />
          </Field>
          <Field label="Therapeutic Ailments">
            <textarea className={inputCls} rows={2} value={form.ailments} onChange={e => set('ailments', e.target.value)} placeholder="Lower back pain, knee stiffness…" />
          </Field>
          <div className="col-span-2 grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500" checked={form.previous_yoga} onChange={e => set('previous_yoga', e.target.checked)} />
              Previous yoga experience
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500" checked={form.doctor_referral} onChange={e => set('doctor_referral', e.target.checked)} />
              Doctor referral
            </label>
          </div>
          <Field label="Naval Assessment Result" half>
            <select className={selectCls} value={form.naval_assessment_result} onChange={e => set('naval_assessment_result', e.target.value)}>
              {NAVAL_OPTIONS.map(o => <option key={o} value={o}>{o || '— pending —'}</option>)}
            </select>
          </Field>
        </div>
      </section>

      {/* ── Course interest ── */}
      <section>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Programme Interest</h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Course / Programme Interest">
            <input className={inputCls} value={form.course_interest} onChange={e => set('course_interest', e.target.value)} placeholder="weight-management, anti-ageing…" />
          </Field>
        </div>
      </section>

      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      {/* ── Actions ── */}
      <div className="flex gap-3 pt-2 border-t border-gray-100">
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors">
          {loading ? <Loader2 size={15} className="animate-spin" /> : null}
          {mode === 'add' ? 'Create Member Account' : 'Save Changes'}
        </button>
        <button type="button" onClick={onClose}
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
