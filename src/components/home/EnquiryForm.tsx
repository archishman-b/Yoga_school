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
    <section id="contact" className="py-20 bg-gradient-to-br from-teal-900 to-gray-900 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">
            Book Your Trial
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('heading')}</h2>
          <p className="text-gray-400">{t('subheading')}</p>
        </div>

        {status === 'success' ? (
          <div className="text-center py-12">
            <CheckCircle2 size={56} className="text-teal-400 mx-auto mb-4" />
            <p className="text-xl font-semibold">{t('success')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  {t('name')} <span className="text-saffron-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:bg-white/15 transition-colors"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  {t('phone')} <span className="text-saffron-400">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:bg-white/15 transition-colors"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                {t('email')}
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:bg-white/15 transition-colors"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                {t('message')} <span className="text-saffron-400">*</span>
              </label>
              <textarea
                name="message"
                required
                rows={4}
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:bg-white/15 transition-colors resize-none"
                placeholder="I'd like to book a free trial class..."
              />
            </div>

            {status === 'error' && (
              <p className="text-red-400 text-sm">{t('error')}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors shadow-lg"
            >
              {status === 'loading' ? (
                'Sending...'
              ) : (
                <>
                  <Send size={18} />
                  {t('submit')}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
