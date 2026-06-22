'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, Copy, Check } from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────
// Values MUST match DB CHECK constraints exactly
const GENDER_OPTIONS   = ['', 'female', 'male', 'other', 'prefer_not_to_say'] as const;
const MARITAL_OPTIONS  = ['', 'unmarried', 'married', 'widowed', 'other'] as const;  // DB: unmarried not single
const DIET_OPTIONS     = ['', 'vegetarian', 'non_vegetarian', 'vegan', 'eggetarian', 'other'] as const;
const DIET_LABELS: Record<string, string> = {
  '': '— select —', vegetarian: 'Vegetarian', non_vegetarian: 'Non-Vegetarian',
  vegan: 'Vegan', eggetarian: 'Eggetarian', other: 'Other',
};
const LANG_OPTIONS     = [['en', 'English'], ['hi', 'Hindi'], ['bn', 'Bengali']] as const;
const NAVAL_OPTIONS    = ['', 'normal', 'displaced', 'pending'] as const;

const EDUCATION_OPTIONS = [
  '', 'Below Class X', 'Upto Class X', 'Upto Class XII',
  'Diploma', 'Graduate', 'Post Graduate', 'Doctorate',
] as const;

const MOTHER_TONGUE_OPTIONS = ['', 'Bengali', 'Hindi', 'Other'] as const;

const PROGRAMME_OPTIONS = [
  ['', '— select —'],
  ['weight-management',  'Weight Management'],
  ['anti-ageing',        'Anti-Ageing'],
  ['healthy-ageing',     'Healthy Ageing'],
  ['naval-correction',   'Naval Correction'],
  ['growth-development', 'Growth & Development'],
  ['height-enhancement', 'Height Enhancement'],
  ['digestive-health',   'Digestive Health'],
  ['busy-lifestyle',     'Busy Lifestyle'],
] as const;

const MEDICAL_CONDITION_OPTIONS = [
  'Diabetes', 'Hypertension', 'Heart Disease', 'Thyroid Disorder',
  'Asthma / Respiratory Issues', 'Arthritis', 'Osteoporosis', 'Kidney Disease',
];

const AILMENT_OPTIONS = [
  'Lower Back Pain', 'Neck / Cervical Pain', 'Knee Pain', 'Shoulder Pain',
  'Sciatica', 'Migraine / Headaches', 'Anxiety / Stress', 'Digestive Issues',
  'Insomnia', 'Naval Displacement',
];

// ── Types ─────────────────────────────────────────────────────────────────────
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
  // Height stored as feet + inches in form; converted to cm on submit
  height_ft:                string;
  height_in:                string;
  weight_kg:                string;
  diet_preference:          string;
  // Medical conditions: checkboxes + other
  medical_conditions_list:  string[];
  medical_conditions_other: string;
  cardiovascular_conditions: string;
  // Ailments: checkboxes + other
  ailments_list:            string[];
  ailments_other:           string;
  previous_yoga:            boolean;
  doctor_referral:          boolean;
  naval_assessment_result:  string;
  course_interest:          string;
  emergency_contact:        string;
  preferred_language:       string;
  joined_date:              string;
};

export const EMPTY_FORM: MemberFormData = {
  full_name: '', phone: '', gender: '', date_of_birth: '', guardian_name: '',
  address: '', occupation: '', marital_status: '', mother_tongue: '', education: '',
  height_ft: '', height_in: '', weight_kg: '', diet_preference: '',
  medical_conditions_list: [], medical_conditions_other: '',
  cardiovascular_conditions: '',
  ailments_list: [], ailments_other: '',
  previous_yoga: false, doctor_referral: false,
  naval_assessment_result: '', course_interest: '',
  emergency_contact: '', preferred_language: 'en', joined_date: '',
};

// Convert height_cm (from DB) → { feet, inches }
export function cmToFeetInches(cm: number | null | undefined): { ft: string; in: string } {
  if (!cm) return { ft: '', in: '' };
  const totalInches = cm / 2.54;
  const ft = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { ft: String(ft), in: String(inches) };
}

// Convert feet+inches → cm
function feetInchesToCm(ft: string, inStr: string): number | null {
  const feet = parseFloat(ft);
  const inches = parseFloat(inStr) || 0;
  if (isNaN(feet)) return null;
  return parseFloat(((feet * 12 + inches) * 2.54).toFixed(1));
}

type Credentials = { member_id: string; password: string };

type Props = {
  mode:       'add' | 'edit';
  memberId?:  string;
  initial?:   Partial<MemberFormData>;
  onSuccess?: () => void;
  onClose:    () => void;
};

// ── Sub-components ─────────────────────────────────────────────────────────────
function Field({ label, children, half }: { label: string; children: React.ReactNode; half?: boolean }) {
  return (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls  = 'w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-teal-500 transition-colors bg-white';
const selectCls = inputCls;

function CheckboxGroup({ options, selected, onChange }: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) onChange(selected.filter(s => s !== opt));
    else onChange([...selected, opt]);
  };
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {options.map(opt => (
        <label key={opt} className="flex items-start gap-2 cursor-pointer group">
          <input
            type="checkbox"
            className="mt-0.5 w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500 shrink-0"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
          />
          <span className="text-xs text-gray-700 group-hover:text-gray-900 leading-snug">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button" onClick={async () => {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }} className="ml-2 text-gray-400 hover:text-teal-600 transition-colors inline-flex items-center">
      {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
    </button>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────
export default function AdminMemberForm({ mode, memberId, initial = {}, onSuccess, onClose }: Props) {
  const [form,    setForm]    = useState<MemberFormData>({ ...EMPTY_FORM, ...initial });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [creds,   setCreds]   = useState<Credentials | null>(null);

  const set = (field: keyof MemberFormData, value: string | boolean | string[]) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim()) { setError('Full name is required.'); return; }
    setLoading(true); setError('');

    // Combine checkbox lists with "Other" text
    const medical_conditions = [
      ...form.medical_conditions_list,
      ...(form.medical_conditions_other.trim() ? [form.medical_conditions_other.trim()] : []),
    ].join(', ') || null;

    const ailments = [
      ...form.ailments_list,
      ...(form.ailments_other.trim() ? [form.ailments_other.trim()] : []),
    ].join(', ') || null;

    // Convert height to cm
    const height_cm = feetInchesToCm(form.height_ft, form.height_in);
    const weight_kg = form.weight_kg ? parseFloat(form.weight_kg) : null;

    // Null-safe enum values — empty string → null
    const nullIfEmpty = (v: string) => v.trim() || null;

    const payload: Record<string, unknown> = {
      full_name:                form.full_name.trim(),
      phone:                    nullIfEmpty(form.phone),
      gender:                   nullIfEmpty(form.gender),
      date_of_birth:            nullIfEmpty(form.date_of_birth),
      guardian_name:            nullIfEmpty(form.guardian_name),
      address:                  nullIfEmpty(form.address),
      occupation:               nullIfEmpty(form.occupation),
      marital_status:           nullIfEmpty(form.marital_status),
      mother_tongue:            nullIfEmpty(form.mother_tongue),
      education:                nullIfEmpty(form.education),
      height_cm,
      weight_kg,
      diet_preference:          nullIfEmpty(form.diet_preference),
      medical_conditions,
      cardiovascular_conditions: nullIfEmpty(form.cardiovascular_conditions),
      ailments,
      previous_yoga:            form.previous_yoga,
      doctor_referral:          form.doctor_referral,
      naval_assessment_result:  nullIfEmpty(form.naval_assessment_result),
      course_interest:          nullIfEmpty(form.course_interest),
      emergency_contact:        nullIfEmpty(form.emergency_contact),
      preferred_language:       form.preferred_language || 'en',
      joined_date:              nullIfEmpty(form.joined_date),
    };

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

  // ── Success state ─────────────────────────────────────────────────────────
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
        </div>
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
          <Field label="Full Name *">
            <input className={inputCls} required value={form.full_name}
              onChange={e => set('full_name', e.target.value)} placeholder="Sunita Sharma" />
          </Field>
          <Field label="Phone" half>
            <input className={inputCls} value={form.phone}
              onChange={e => set('phone', e.target.value)} placeholder="98765 43210" />
          </Field>
          <Field label="Gender" half>
            <select className={selectCls} value={form.gender} onChange={e => set('gender', e.target.value)}>
              {GENDER_OPTIONS.map(o => (
                <option key={o} value={o}>
                  {o === '' ? '— select —' : o === 'prefer_not_to_say' ? 'Prefer not to say' : o.charAt(0).toUpperCase() + o.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Date of Birth" half>
            <input className={inputCls} type="date" value={form.date_of_birth}
              onChange={e => set('date_of_birth', e.target.value)} />
          </Field>
          <Field label="Guardian / Spouse Name" half>
            <input className={inputCls} value={form.guardian_name}
              onChange={e => set('guardian_name', e.target.value)} placeholder="Ramesh Sharma" />
          </Field>
          <Field label="Address">
            <textarea className={inputCls} rows={2} value={form.address}
              onChange={e => set('address', e.target.value)} placeholder="12 Park Street, Kolkata 700016" />
          </Field>
          <Field label="Emergency Contact" half>
            <input className={inputCls} value={form.emergency_contact}
              onChange={e => set('emergency_contact', e.target.value)} placeholder="Phone number" />
          </Field>
          <Field label="Joined Date" half>
            <input className={inputCls} type="date" value={form.joined_date}
              onChange={e => set('joined_date', e.target.value)} />
          </Field>
        </div>
      </section>

      {/* ── Demographics ── */}
      <section>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Demographics</h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Occupation" half>
            <input className={inputCls} value={form.occupation}
              onChange={e => set('occupation', e.target.value)} placeholder="Homemaker / Teacher…" />
          </Field>
          <Field label="Marital Status" half>
            <select className={selectCls} value={form.marital_status} onChange={e => set('marital_status', e.target.value)}>
              {MARITAL_OPTIONS.map(o => (
                <option key={o} value={o}>
                  {o === '' ? '— select —' : o.charAt(0).toUpperCase() + o.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Mother Tongue" half>
            <select className={selectCls} value={form.mother_tongue} onChange={e => set('mother_tongue', e.target.value)}>
              {MOTHER_TONGUE_OPTIONS.map(o => (
                <option key={o} value={o}>{o || '— select —'}</option>
              ))}
            </select>
          </Field>
          <Field label="Education" half>
            <select className={selectCls} value={form.education} onChange={e => set('education', e.target.value)}>
              {EDUCATION_OPTIONS.map(o => (
                <option key={o} value={o}>{o || '— select —'}</option>
              ))}
            </select>
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
          <Field label="Height" half>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input className={inputCls} type="number" min="3" max="8" value={form.height_ft}
                  onChange={e => set('height_ft', e.target.value)} placeholder="5" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">ft</span>
              </div>
              <div className="relative flex-1">
                <input className={inputCls} type="number" min="0" max="11" value={form.height_in}
                  onChange={e => set('height_in', e.target.value)} placeholder="4" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">in</span>
              </div>
            </div>
          </Field>
          <Field label="Weight (kg)" half>
            <input className={inputCls} type="number" step="0.1" value={form.weight_kg}
              onChange={e => set('weight_kg', e.target.value)} placeholder="62" />
          </Field>
          <Field label="Diet Preference" half>
            <select className={selectCls} value={form.diet_preference} onChange={e => set('diet_preference', e.target.value)}>
              {DIET_OPTIONS.map(o => <option key={o} value={o}>{DIET_LABELS[o]}</option>)}
            </select>
          </Field>
        </div>
      </section>

      {/* ── Health ── */}
      <section>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Health & Medical</h3>
        <div className="space-y-4">

          {/* Medical conditions */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">Pre-existing Medical Conditions</p>
            <CheckboxGroup
              options={MEDICAL_CONDITION_OPTIONS}
              selected={form.medical_conditions_list}
              onChange={v => set('medical_conditions_list', v)}
            />
            <input className={`${inputCls} mt-2`} value={form.medical_conditions_other}
              onChange={e => set('medical_conditions_other', e.target.value)}
              placeholder="Others (please specify)" />
          </div>

          {/* Cardiovascular */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Cardiovascular Conditions</label>
            <input className={inputCls} value={form.cardiovascular_conditions}
              onChange={e => set('cardiovascular_conditions', e.target.value)}
              placeholder="None / Arrhythmia / Pacemaker…" />
          </div>

          {/* Therapeutic ailments */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">Therapeutic Ailments (for which yoga is sought)</p>
            <CheckboxGroup
              options={AILMENT_OPTIONS}
              selected={form.ailments_list}
              onChange={v => set('ailments_list', v)}
            />
            <input className={`${inputCls} mt-2`} value={form.ailments_other}
              onChange={e => set('ailments_other', e.target.value)}
              placeholder="Others (please specify)" />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                checked={form.previous_yoga} onChange={e => set('previous_yoga', e.target.checked)} />
              Previous yoga experience
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                checked={form.doctor_referral} onChange={e => set('doctor_referral', e.target.checked)} />
              Doctor referral
            </label>
          </div>

          {/* Naval assessment */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Naval Assessment Result</label>
            <select className={`${selectCls} max-w-xs`} value={form.naval_assessment_result}
              onChange={e => set('naval_assessment_result', e.target.value)}>
              {NAVAL_OPTIONS.map(o => (
                <option key={o} value={o}>
                  {o === '' ? '— pending —' : o.charAt(0).toUpperCase() + o.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ── Programme interest ── */}
      <section>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Programme Interest</h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Interested Programme" half>
            <select className={selectCls} value={form.course_interest}
              onChange={e => set('course_interest', e.target.value)}>
              {PROGRAMME_OPTIONS.map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
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
