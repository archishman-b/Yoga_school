'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Send, CheckCircle2 } from 'lucide-react';

export default function EnquiryForm() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const supabase = createClient();
      const { error } = await supabase.from('enquiries').insert([form]);
      if (error) throw error;
      setStatus('success');
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section
      id="contact"
      className="relative py-24 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0D6B6E 0%, #0A4F51 100%)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'radial-gradient(rgba(250,247,242,0.4) 1.3px, transparent 1.3px)',
          backgroundSize: '26px 26px',
        }}
      />

      <div className="relative z-10 max-w-[560px] mx-auto px-[clamp(18px,5vw,56px)]">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <span
            className="inline-block text-xs font-semibold tracking-[3px] uppercase mb-3"
            style={{ color: 'rgba(244,160,74,0.9)' }}
          >
            {t('eyebrow')}
          </span>
          <h2
            className="font-rozha font-normal text-white mb-4"
            style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}
          >
            {t('heading')}
          </h2>
          <p style={{ color: 'rgba(250,247,242,0.6)' }} className="text-sm leading-relaxed">
            {t('subheading')}
          </p>
        </div>

        {/* ── Glassmorphic card ────────────────────────────────────────────── */}
        <div
          className="rounded-card2 p-[clamp(22px,4vw,38px)]"
          style={{
            background: 'rgba(255,253,249,0.07)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: '1px solid rgba(250,247,242,0.12)',
          }}
        >
          {status === 'success' ? (
            <div className="text-center py-10">
              <CheckCircle2 size={52} style={{ color: '#F4A04A' }} className="mx-auto mb-4" />
              <p className="text-xl font-semibold text-white">{t('success')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-wide mb-1.5" style={{ color: 'rgba(250,247,242,0.7)' }}>
                    {t('name')} <span className="text-saffron-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-[14px] text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
                    style={{
                      background: 'rgba(255,253,249,0.08)',
                      border: '1px solid rgba(250,247,242,0.15)',
                    }}
                    placeholder={t('namePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wide mb-1.5" style={{ color: 'rgba(250,247,242,0.7)' }}>
                    {t('phone')} <span className="text-saffron-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-[14px] text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
                    style={{
                      background: 'rgba(255,253,249,0.08)',
                      border: '1px solid rgba(250,247,242,0.15)',
                    }}
                    placeholder={t('phonePlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wide mb-1.5" style={{ color: 'rgba(250,247,242,0.7)' }}>
                  {t('email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-[14px] text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
                  style={{
                    background: 'rgba(255,253,249,0.08)',
                    border: '1px solid rgba(250,247,242,0.15)',
                  }}
                  placeholder={t('emailPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wide mb-1.5" style={{ color: 'rgba(250,247,242,0.7)' }}>
                  {t('message')} <span className="text-saffron-400">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-[14px] text-sm text-white placeholder-white/30 focus:outline-none transition-colors resize-none"
                  style={{
                    background: 'rgba(255,253,249,0.08)',
                    border: '1px solid rgba(250,247,242,0.15)',
                  }}
                  placeholder={t('messagePlaceholder')}
                />
              </div>

              {status === 'error' && (
                <p className="text-red-300 text-sm">{t('error')}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-60 text-white font-bold rounded-pill transition-colors mt-2"
                style={{ boxShadow: '0 8px 24px -8px rgba(232,116,12,0.8)' }}
              >
                {status === 'loading' ? (
                  t('sending')
                ) : (
                  <>
                    <Send size={16} />
                    {t('submit')}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
