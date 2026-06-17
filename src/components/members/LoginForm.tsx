'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

type Props = { locale: string };

export default function LoginForm({ locale }: Props) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'sent' | 'loading'>('email');
  const [error, setError] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/${locale}/members`,
      },
    });

    if (error) {
      setError(error.message);
      setStep('email');
    } else {
      setStep('sent');
    }
  };

  if (step === 'sent') {
    return (
      <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center text-white">
        <CheckCircle2 size={48} className="text-teal-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Check your email</h2>
        <p className="text-gray-300 text-sm">
          We've sent a magic login link to{' '}
          <span className="text-white font-medium">{email}</span>.<br />
          Click the link to sign in — it expires in 1 hour.
        </p>
        <button
          onClick={() => setStep('email')}
          className="mt-6 text-teal-400 text-sm hover:text-teal-300 underline"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSend} className="bg-white/10 backdrop-blur rounded-2xl p-8 space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Email address
        </label>
        <div className="relative">
          <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition-colors"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={step === 'loading'}
        className="w-full flex items-center justify-center gap-2 py-3 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
      >
        {step === 'loading' ? 'Sending...' : (
          <>Send Magic Link <ArrowRight size={18} /></>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        No password needed. We email you a secure one-time link.
      </p>
    </form>
  );
}
