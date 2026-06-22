'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle2, User, Mail, Lock } from 'lucide-react';

type Props = { locale: string };

export default function SignupForm({ locale }: Props) {
  const t = useTranslations('signup');
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [error,    setError]    = useState('');

  const RULES = [
    { label: t('ruleLength'),   test: (p: string) => p.length >= 8 },
    { label: t('ruleUppercase'), test: (p: string) => /[A-Z]/.test(p) },
    { label: t('ruleNumber'),   test: (p: string) => /[0-9]/.test(p) },
    { label: t('ruleSpecial'),  test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ];

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
        <h2 className="text-xl font-bold">{t('checkEmail')}</h2>
        <p className="text-gray-300 text-sm">
          {t('confirmationSent')} <span className="text-white font-medium">{email}</span>.<br />
          {t('clickLink')}
        </p>
        <Link href={`/${locale}/members/login`}
          className="inline-block mt-2 text-teal-400 hover:text-teal-300 underline text-sm">
          {t('backToLogin')}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur rounded-2xl p-8 space-y-5">
      {/* Full name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t('fullNameLabel')}</label>
        <div className="relative">
          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" required value={name} onChange={e => setName(e.target.value)}
            placeholder={t('fullNamePlaceholder')}
            className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition-colors"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t('emailLabel')}</label>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
            className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition-colors"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t('passwordLabel')}</label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPw ? 'text' : 'password'} required value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full pl-9 pr-10 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition-colors"
          />
          <button type="button" onClick={() => setShowPw(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
            {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
          </button>
        </div>
        {/* Password rules */}
        {password.length > 0 && (
          <ul className="mt-2 space-y-1">
            {RULES.map(r => (
              <li key={r.label} className={`flex items-center gap-1.5 text-xs ${r.test(password) ? 'text-teal-400' : 'text-gray-500'}`}>
                <span>{r.test(password) ? '✓' : '○'}</span>
                {r.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Confirm password */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t('confirmPasswordLabel')}</label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPw ? 'text' : 'password'} required value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder={t('confirmPasswordPlaceholder')}
            className={`w-full pl-9 pr-4 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-500 focus:outline-none transition-colors ${
              confirm.length > 0
                ? passwordsMatch
                  ? 'border-teal-400'
                  : 'border-red-400'
                : 'border-white/20'
            }`}
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={!canSubmit || loading}
        className="w-full py-3 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-40 text-white font-semibold rounded-xl transition-colors"
      >
        {loading ? t('creating') : t('createAccountBtn')}
      </button>

      <p className="text-center text-xs text-gray-400">
        {t('alreadyHaveAccount')}{' '}
        <Link href={`/${locale}/members/login`} className="text-teal-400 hover:text-teal-300 underline">
          {t('signInLink')}
        </Link>
      </p>
    </form>
  );
}
