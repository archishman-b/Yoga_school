'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';

type Props = { locale: string };

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.5 18.9 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.6-3.1-11.3-7.5l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.6l6.2 5.2C36.9 36.9 44 31 44 24c0-1.3-.1-2.7-.4-3.9z"/>
    </svg>
  );
}

type Mode = 'password' | 'magic';

export default function LoginForm({ locale }: Props) {
  const router = useRouter();
  const [mode,     setMode]     = useState<Mode>('password');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState<string | null>(null);
  const [sent,     setSent]     = useState(false);
  const [error,    setError]    = useState('');

  const handleGoogle = async () => {
    setLoading('google'); setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) { setError(error.message); setLoading(null); }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('password'); setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(null);
    if (error) { setError(error.message); return; }
    router.push(`/${locale}/members`);
    router.refresh();
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('magic'); setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(null);
    if (error) { setError(error.message); return; }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center text-white space-y-4">
        <CheckCircle2 size={48} className="text-teal-400 mx-auto" />
        <h2 className="text-xl font-bold">Check your email</h2>
        <p className="text-gray-300 text-sm">
          Magic link sent to <span className="text-white font-medium">{email}</span>.<br/>
          Click it to sign in — expires in 1 hour.
        </p>
        <button onClick={() => setSent(false)} className="text-teal-400 text-sm hover:text-teal-300 underline">
          Try a different method
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur rounded-2xl p-8 space-y-5">

      {/* Google */}
      <button type="button" onClick={handleGoogle} disabled={!!loading}
        className="w-full flex items-center justify-center gap-3 py-3 bg-white hover:bg-gray-50 disabled:opacity-60 text-gray-800 font-semibold rounded-xl transition-colors shadow-sm">
        <GoogleIcon />
        {loading === 'google' ? 'Redirecting…' : 'Continue with Google'}
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/20" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-white/20" />
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-xl overflow-hidden border border-white/20 text-sm font-medium">
        <button onClick={() => setMode('password')}
          className={`flex-1 py-2 transition-colors ${mode === 'password' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-gray-200'}`}>
          Email & Password
        </button>
        <button onClick={() => setMode('magic')}
          className={`flex-1 py-2 transition-colors ${mode === 'magic' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-gray-200'}`}>
          Magic Link
        </button>
      </div>

      {/* Email + Password */}
      {mode === 'password' && (
        <form onSubmit={handlePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full pl-9 pr-10 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition-colors" />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={!!loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors">
            {loading === 'password' ? 'Signing in…' : <><ArrowRight size={18}/> Sign In</>}
          </button>
        </form>
      )}

      {/* Magic Link */}
      {mode === 'magic' && (
        <form onSubmit={handleMagicLink} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition-colors" />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={!!loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors">
            {loading === 'magic' ? 'Sending…' : <><ArrowRight size={18}/> Send Magic Link</>}
          </button>
          <p className="text-xs text-gray-500 text-center">No password needed — we email you a secure one-time link.</p>
        </form>
      )}

      {/* Sign up link */}
      <p className="text-center text-xs text-gray-400 pt-1">
        New here?{' '}
        <Link href={`/${locale}/members/signup`} className="text-teal-400 hover:text-teal-300 underline font-medium">
          Create an account
        </Link>
      </p>
    </div>
  );
}
