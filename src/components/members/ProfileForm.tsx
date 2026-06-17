'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/supabase/types';
import { Camera, CheckCircle2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = { profile: Profile; locale: string };

const LOCALES = ['en', 'hi', 'bn'] as const;
const LOCALE_LABELS = { en: 'English', hi: 'हिन्दी', bn: 'বাংলা' };

export default function ProfileForm({ profile, locale }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: profile.full_name ?? '',
    phone: profile.phone ?? '',
    address: profile.address ?? '',
    emergency_contact: profile.emergency_contact ?? '',
    preferred_language: profile.preferred_language ?? 'en',
  });
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [photoPreview, setPhotoPreview] = useState<string | null>(profile.photo_url);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload to Supabase Storage
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const path = `${profile.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(path, file, { upsert: true });

    if (!uploadError) {
      const { data } = supabase.storage.from('profile-photos').getPublicUrl(path);
      await supabase.from('profiles').update({ photo_url: data.publicUrl }).eq('id', profile.id);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    const supabase = createClient();
    const { error } = await supabase.from('profiles').update(form).eq('id', profile.id);
    if (error) {
      setStatus('error');
    } else {
      setStatus('saved');
      router.refresh();
      setTimeout(() => setStatus('idle'), 2500);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Photo */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Profile Photo</h2>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-200 to-teal-400 flex items-center justify-center text-3xl overflow-hidden">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                '🧘'
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-teal-600 text-white rounded-full flex items-center justify-center shadow"
            >
              <Camera size={14} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{profile.full_name ?? 'Your Name'}</p>
            <p className="text-gray-500 text-xs">{profile.email}</p>
            <p className="text-gray-400 text-xs mt-0.5">Member since {profile.joined_date ?? 'recently'}</p>
          </div>
        </div>
      </div>

      {/* Personal details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Personal Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name</label>
            <input name="full_name" value={form.full_name} onChange={handleChange} className="input" placeholder="Your full name" />
          </div>
          <div>
            <label className="label">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="input" placeholder="+91 XXXXX XXXXX" />
          </div>
        </div>

        <div>
          <label className="label">Address</label>
          <textarea name="address" value={form.address} onChange={handleChange} rows={2} className="input resize-none" placeholder="Your home address" />
        </div>

        <div>
          <label className="label">Emergency Contact</label>
          <input name="emergency_contact" value={form.emergency_contact} onChange={handleChange} className="input" placeholder="Name and phone of someone to contact in an emergency" />
        </div>

        <div>
          <label className="label">Preferred Language</label>
          <select name="preferred_language" value={form.preferred_language} onChange={handleChange} className="input">
            {LOCALES.map((l) => (
              <option key={l} value={l}>{LOCALE_LABELS[l]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === 'saving'}
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
        >
          <Save size={16} />
          {status === 'saving' ? 'Saving...' : 'Save Changes'}
        </button>
        {status === 'saved' && (
          <span className="flex items-center gap-1.5 text-teal-600 text-sm font-medium">
            <CheckCircle2 size={16} /> Saved!
          </span>
        )}
        {status === 'error' && <span className="text-red-500 text-sm">Could not save. Try again.</span>}
      </div>
    </form>
  );
}
