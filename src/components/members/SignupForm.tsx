'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle2, User, Mail, Lock } from 'lucide-react';

type Props = { locale: string };

type Rule = { label: string; test: (p: string) => boolean };
const RULES: Rule[] = [
  { label: 'At least 8 characters',       test: p => p.length >= 8 },
  { label: 'One uppercase letter (A–Z)',   test: p => /[A-Z]/.test(p) },
  { label: 'One number (0–9)',             test: p => /[0-9]/.test(p) },
  { label: 'One special character (!@#…)', test: p => /[^A-Za-z0-9]/.test(p) },
];

export default function SignupForm({ locale }: Props) {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [error,    setError]    = useState('');

  const allRulesPassed = RULES.every(r => r.test(password));
  const passwordsMatch = password === confirm && confirm.length > 0;
  const canSubmit = name.trim() && email && allRulesPassed && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (signUpError) { setError(signUpError.message); return; }
    setDone(true);
  };

  if (done) {
    return (
      <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center text-white space-y-4">
        <CheckCircle2 size={52} className="text-teal-400 mx-auto" />
        <h2 className="text-xl font-bold">Check your email!</h2>
        <p className="text-gray-300 text-sm">
          We've sent a confirmation link to <span className="text-white font-medium">{email}</span>.<br />
          Click the link to activate your account, then log in.
        </p>
        <Link href={`/${locale}/members/login`}
          className="inline-block mt-2 text-teal-400 hover:text-teal-300 underline text-sm">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur rounded-2xl p-8 space-y-5">
      {/* Full name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Full name</label>
        <div className="relative">
          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" required value={name} onChange={e => setName(e.target.value)}
            placeholder="Priya Sharma"
            className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition-colors"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition-colors"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPw ? 'text' : 'password'} required value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Create a strong password"
            className="w-full pl-9 pr-10 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition-colors"
          />
          <button type="button" onClick={() => setShowPw(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Password strength rules */}
        {password.length > 0 && (
          <ul className="mt-2.5 space-y-1">
            {RULES.map(rule => {
              const ok = rule.test(password);
              return (
                <li key={rule.label} className={`flex items-center gap-2 text-xs transition-colors ${ok ? 'text-teal-400' : 'text-gray-500'}`}>
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${ok ? 'bg-teal-500 border-teal-500' : 'border-gray-500'}`}>
                    {ok && <span className="text-white text-[9px] font-bold">✓</span>}
                  </span>
                  {rule.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Confirm password */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm password</label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPw ? 'text' : 'password'} required value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Re-enter your password"
            className={`w-full pl-9 pr-4 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-500 focus:outline-none transition-colors ${
              confirm.length > 0
                ? passwordsMatch ? 'border-teal-400' : 'border-red-400'
                : 'border-white/20 focus:border-teal-400'
            }`}
          />
        </div>
        {confirm.length > 0 && !passwordsMatch && (
          <p className="text-red-400 text-xs mt-1">Passwords don't match</p>
        )}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit" disabled={!canSubmit || loading}
        className="w-full py-3 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-40 text-white font-semibold rounded-xl transition-colors"
      >
        {loading ? 'Creating account…' : 'Create Account'}
      </button>

      <p className="text-center text-xs text-gray-400">
        Already have an account?{' '}
        <Link href={`/${locale}/members/login`} className="text-teal-400 hover:text-teal-300 underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
