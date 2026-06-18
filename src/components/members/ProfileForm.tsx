'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/supabase/types';
import { Camera, CheckCircle2, Save, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = { profile: Profile; locale: string };

const LOCALES = ['en', 'hi', 'bn'] as const;
const LOCALE_LABELS = { en: 'English', hi: 'हिन्दी', bn: 'বাংলা' };

function calcAge(dob: string | null) {
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {label}
        {hint && <span className="font-normal normal-case tracking-normal text-gray-400 ml-1">({hint})</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-teal-400 bg-white';

export default function ProfileForm({ profile: p, locale }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    // ── Basic ─────────────────────────────────────────────
    full_name:          (p as any).full_name          ?? '',
    phone:              (p as any).phone              ?? '',
    address:            (p as any).address            ?? '',
    preferred_language: (p as any).preferred_language ?? 'en',
    gender:             (p as any).gender             ?? '',
    date_of_birth:      (p as any).date_of_birth      ?? '',
    // ── Admission form fields ─────────────────────────────
    guardian_name:      (p as any).guardian_name      ?? '',
    height_cm:          (p as any).height_cm          ?? '',
    weight_kg:          (p as any).weight_kg          ?? '',
    occupation:         (p as any).occupation         ?? '',
    marital_status:     (p as any).marital_status     ?? '',
    diet_preference:    (p as any).diet_preference    ?? '',
    mother_tongue:      (p as any).mother_tongue      ?? '',
    education:          (p as any).education          ?? '',
    emergency_contact:  (p as any).emergency_contact  ?? '',
    // ── Health information ────────────────────────────────
    medical_conditions:           (p as any).medical_conditions           ?? '',
    cardiovascular_conditions:    (p as any).cardiovascular_conditions    ?? '',
    previous_yoga:                (p as any).previous_yoga                ?? false,
    doctor_referral:              (p as any).doctor_referral              ?? false,
    ailments:                     (p as any).ailments                     ?? '',
    // ── Course interest ───────────────────────────────────
    course_interest:              (p as any).course_interest              ?? '',
  });

  const [status, setStatus]             = useState<'idle'|'saving'|'saved'|'error'>('idle');
  const [photoPreview, setPhotoPreview] = useState<string|null>((p as any).photo_url);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (name: string, value: any) =>
    setForm(prev => ({ ...prev, [name]: value }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    set(e.target.name, e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const path = `${p.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from('profile-photos').upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from('profile-photos').getPublicUrl(path);
      await supabase.from('profiles').update({ photo_url: data.publicUrl }).eq('id', p.id);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    const supabase = createClient();
    // Coerce empty strings → null for numeric / boolean fields
    const payload: any = { ...form };
    if (!payload.gender)             payload.gender = null;
    if (!payload.date_of_birth)      payload.date_of_birth = null;
    if (!payload.marital_status)     payload.marital_status = null;
    if (!payload.diet_preference)    payload.diet_preference = null;
    if (payload.height_cm === '')    payload.height_cm = null;
    if (payload.weight_kg === '')    payload.weight_kg = null;
    const { error } = await supabase.from('profiles').update(payload).eq('id', p.id);
    if (error) { setStatus('error'); }
    else { setStatus('saved'); router.refresh(); setTimeout(() => setStatus('idle'), 2500); }
  };

  const age = calcAge(form.date_of_birth);
  const isTherapeutic = form.course_interest === 'therapeutic';

  return (
    <form onSubmit={handleSave} className="space-y-6">

      {/* ── Photo + meta ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Profile Photo</h2>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-200 to-teal-400 flex items-center justify-center text-3xl overflow-hidden">
              {photoPreview
                ? <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                : '🧘'}
            </div>
            <button type="button" onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-teal-600 text-white rounded-full flex items-center justify-center shadow">
              <Camera size={14} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{(p as any).full_name ?? 'Your Name'}</p>
            <p className="text-gray-500 text-xs">{(p as any).email}</p>
            <p className="text-gray-400 text-xs mt-0.5">
              Member since {(p as any).joined_date
                ? new Date((p as any).joined_date).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })
                : 'recently'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Personal Details ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 text-base">Personal Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name">
            <input name="full_name" value={form.full_name} onChange={handleChange} className={inputCls} placeholder="Your full name (block letters)" />
          </Field>
          <Field label="Father's / Guardian's Name">
            <input name="guardian_name" value={form.guardian_name} onChange={handleChange} className={inputCls} placeholder="Father's or guardian's full name" />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Gender">
            <select name="gender" value={form.gender} onChange={handleChange} className={inputCls}>
              <option value="">—</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="prefer_not">Prefer not to say</option>
            </select>
          </Field>
          <Field label="Date of Birth">
            <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} className={inputCls} />
          </Field>
          <Field label="Age">
            <div className={`${inputCls} bg-gray-50 text-gray-500 cursor-default`}>
              {age !== null ? `${age} years` : '—'}
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Height" hint="cm">
            <input name="height_cm" type="number" min="50" max="250" value={form.height_cm} onChange={handleChange} className={inputCls} placeholder="e.g. 165" />
          </Field>
          <Field label="Weight" hint="kg">
            <input name="weight_kg" type="number" min="20" max="300" value={form.weight_kg} onChange={handleChange} className={inputCls} placeholder="e.g. 60" />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Occupation">
            <input name="occupation" value={form.occupation} onChange={handleChange} className={inputCls} placeholder="e.g. Teacher, Engineer, Homemaker…" />
          </Field>
          <Field label="Marital Status">
            <select name="marital_status" value={form.marital_status} onChange={handleChange} className={inputCls}>
              <option value="">—</option>
              <option value="unmarried">Unmarried</option>
              <option value="married">Married</option>
              <option value="widowed">Widowed</option>
              <option value="other">Other</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Usual Diet">
            <select name="diet_preference" value={form.diet_preference} onChange={handleChange} className={inputCls}>
              <option value="">—</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="non_vegetarian">Non-Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="eggetarian">Eggetarian</option>
            </select>
          </Field>
          <Field label="Mother Tongue">
            <input name="mother_tongue" value={form.mother_tongue} onChange={handleChange} className={inputCls} placeholder="e.g. Bengali, Hindi…" />
          </Field>
        </div>

        <Field label="Educational Qualification">
          <input name="education" value={form.education} onChange={handleChange} className={inputCls} placeholder="e.g. Graduate, Post-Graduate, School…" />
        </Field>

        <Field label="Full Address">
          <textarea name="address" value={form.address} onChange={handleChange} rows={2} className={`${inputCls} resize-none`} placeholder="Your home address" />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone Number">
            <input name="phone" value={form.phone} onChange={handleChange} className={inputCls} placeholder="+91 XXXXX XXXXX" />
          </Field>
          <Field label="Emergency Contact">
            <input name="emergency_contact" value={form.emergency_contact} onChange={handleChange} className={inputCls} placeholder="Name and phone number" />
          </Field>
        </div>

        <Field label="Preferred Language">
          <select name="preferred_language" value={form.preferred_language} onChange={handleChange} className={inputCls}>
            {LOCALES.map(l => <option key={l} value={l}>{LOCALE_LABELS[l]}</option>)}
          </select>
        </Field>
      </div>

      {/* ── Health Information ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-start gap-2">
          <Info size={16} className="text-teal-500 mt-0.5 shrink-0" />
          <div>
            <h2 className="font-semibold text-gray-900 text-base">Health Information</h2>
            <p className="text-xs text-gray-400 mt-0.5">Shared only with your instructor. Helps us adapt your practice safely and effectively.</p>
          </div>
        </div>

        {/* Course interest — drives conditional fields */}
        <Field label="Programme of Interest">
          <select name="course_interest" value={form.course_interest} onChange={handleChange} className={inputCls}>
            <option value="">— General / To be recommended by instructor —</option>
            <option value="naval-correction">Naval Correction Programme</option>
            <option value="growth-development">Growth & Development Programme</option>
            <option value="height-enhancement">Height Enhancement Programme</option>
            <option value="anti-ageing">Anti-Ageing & Vitality Programme</option>
            <option value="weight-management">Weight Management Programme</option>
            <option value="healthy-ageing">Healthy Ageing Programme</option>
            <option value="busy-lifestyle">Yoga for Busy Lifestyles</option>
            <option value="therapeutic">Digestive Health / Therapeutic Programme</option>
          </select>
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
            <input
              type="checkbox" id="previous_yoga" name="previous_yoga"
              checked={form.previous_yoga} onChange={handleChange}
              className="w-4 h-4 accent-teal-600 cursor-pointer"
            />
            <label htmlFor="previous_yoga" className="text-sm font-medium text-gray-700 cursor-pointer leading-snug">
              I have practised yoga before
            </label>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
            <input
              type="checkbox" id="doctor_referral" name="doctor_referral"
              checked={form.doctor_referral} onChange={handleChange}
              className="w-4 h-4 accent-teal-600 cursor-pointer"
            />
            <label htmlFor="doctor_referral" className="text-sm font-medium text-gray-700 cursor-pointer leading-snug">
              I was referred to yoga by a healthcare professional
            </label>
          </div>
        </div>

        <Field label="Do you have any cardiovascular conditions?" hint="heart or blood pressure">
          <select name="cardiovascular_conditions" value={form.cardiovascular_conditions} onChange={handleChange} className={inputCls}>
            <option value="">Normal — no known conditions</option>
            <option value="hypertension">High blood pressure (Hypertension)</option>
            <option value="hypotension">Low blood pressure (Hypotension)</option>
            <option value="heart_condition">Other heart condition — provide details below</option>
          </select>
        </Field>

        <Field label="Any health conditions we should know about?" hint="injuries, chronic conditions, recent surgeries">
          <textarea
            name="medical_conditions"
            value={form.medical_conditions}
            onChange={handleChange}
            rows={3}
            className={`${inputCls} resize-none`}
            placeholder="e.g. Lower back pain, knee surgery, thyroid condition… Leave blank if none."
          />
        </Field>

        {/* Conditional: show only for therapeutic/remedial track */}
        {(isTherapeutic || form.ailments) && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
              Therapeutic Programme — Additional Details
            </p>
            <Field label="Name of ailments with duration">
              <textarea
                name="ailments"
                value={form.ailments}
                onChange={handleChange}
                rows={3}
                className={`${inputCls} resize-none`}
                placeholder="e.g. Acidity for 2 years, constipation for 6 months, IBS…"
              />
            </Field>
          </div>
        )}
      </div>

      {/* ── Save ── */}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={status === 'saving'}
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors">
          <Save size={16} />
          {status === 'saving' ? 'Saving…' : 'Save Profile'}
        </button>
        {status === 'saved' && (
          <span className="flex items-center gap-1.5 text-teal-600 text-sm font-medium">
            <CheckCircle2 size={16} /> Saved!
          </span>
        )}
        {status === 'error' && <span className="text-red-500 text-sm">Could not save. Try again.</span>}
      </div>

      <p className="text-xs text-gray-400">
        After your free trial class, our instructor will review your health profile and recommend the
        most suitable programme and stage for you.
      </p>
    </form>
  );
}
