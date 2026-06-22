'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, Phone, Shield } from 'lucide-react';

type Props = { locale: string };
type Tab = 'phone' | 'email' | 'magic';
type PhoneStep = 'input' | 'otp';

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

export default function LoginForm({ locale }: Props) {
  const t = useTranslations('login');
  const router = useRouter();
  const [tab,       setTab]       = useState<Tab>('phone');
  const [phone,     setPhone]     = useState('');
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('input');
  const [otp,       setOtp]       = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [showPw,    setShowPw]    = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [loading,   setLoading]   = useState<string | null>(null);
  const [error,     setError]     = useState('');

  const e164 = () => {
    const d = phone.replace(/\D/g, '');
    return d.startsWith('91') ? `+${d}` : `+91${d}`;
  };

  const handleGoogle = async () => {
    setLoading('google'); setError('');
    const { error: err } = await createClient().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/auth/callback` },
    });
    if (err) { setError(err.message); setLoading(null); }
  };

  const sendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g,'').length < 10) { setError('Enter a valid 10-digit mobile number'); return; }
    setLoading('phone-send'); setError('');
    const { error: err } = await createClient().auth.signInWithOtp({
      phone: e164(),
      options: { channel: 'sms' },
    });
    setLoading(null);
    if (err) { setError(err.message); return; }
    setPhoneStep('otp');
  };

  const verifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { setError('Enter the 6-digit OTP'); return; }
    setLoading('phone-verify'); setError('');
    const { error: err } = await createClient().auth.verifyOtp({
      phone: e164(),
      token: otp,
      type: 'sms',
    });
    setLoading(null);
    if (err) { setError(err.message); return; }
    router.push(`/${locale}/members`);
    router.refresh();
  };

  const handleEmailPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('email'); setError('');
    const { error: err } = await createClient().auth.signInWithPassword({ email, password });
    setLoading(null);
    if (err) { setError(err.message); return; }
    router.push(`/${locale}/members`);
    router.refresh();
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('magic'); setError('');
    const { error: err } = await createClient().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/auth/callback` },
    });
    setLoading(null);
    if (err) { setError(err.message); return; }
    setMagicSent(true);
  };

  const switchTab = (newTab: Tab) => { setTab(newTab); setError(''); setPhoneStep('input'); setOtp(''); setMagicSent(false); };

  const TABS: [Tab, string][] = [
    ['phone', t('tabPhone')],
    ['email', t('tabEmail')],
    ['magic', t('tabMagic')],
  ];

  return (
    <div className="bg-white/10 backdrop-blur rounded-2xl p-8 space-y-5">

      {/* Google */}
      <button type="button" onClick={handleGoogle} disabled={!!loading}
        className="w-full flex items-center justify-center gap-3 py-3 bg-white hover:bg-gray-50 disabled:opacity-60 text-gray-800 font-semibold rounded-xl transition-colors shadow-sm">
        <GoogleIcon />
        {loading === 'google' ? t('redirecting') : t('continueGoogle')}
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/20" />
        <span className="text-xs text-gray-400">{t('or')}</span>
        <div className="flex-1 h-px bg-white/20" />
      </div>

      {/* Tab switcher */}
      <div className="grid grid-cols-3 rounded-xl overflow-hidden border border-white/20 text-xs font-medium">
        {TABS.map(([tabKey, label]) => (
          <button key={tabKey} onClick={() => switchTab(tabKey)}
            className={`py-2.5 transition-colors ${tab === tabKey ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Phone OTP ── */}
      {tab === 'phone' && phoneStep === 'input' && (
        <form onSubmit={sendPhoneOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">{t('mobileLabel')}</label>
            <div className="flex rounded-xl overflow-hidden border border-white/20 focus-within:border-teal-400 transition-colors">
              <span className="flex items-center gap-1.5 px-3 bg-white/10 text-gray-300 text-sm border-r border-white/20 shrink-0">
                <Phone size={14} /> +91
              </span>
              <input type="tel" required value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                placeholder={t('mobilePlaceholder')}
                className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none" />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={!!loading || phone.replace(/\D/g,'').length < 10}
            className="w-full flex items-center justify-center gap-2 py-3 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-40 text-white font-semibold rounded-xl transition-colors">
            {loading === 'phone-send' ? t('sendingOtp') : <><ArrowRight size={18}/> {t('sendOtp')}</>}
          </button>
          <p className="text-xs text-gray-500 text-center">{t('mobileHint')}</p>
        </form>
      )}

      {tab === 'phone' && phoneStep === 'otp' && (
        <form onSubmit={verifyPhoneOtp} className="space-y-4">
          <div className="text-center">
            <Shield size={32} className="text-teal-400 mx-auto mb-2" />
            <p className="text-white text-sm font-semibold">{t('otpSentTo')} {phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 text-center">{t('enterOtp')}</label>
            <input type="tel" required maxLength={6} value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
              placeholder="• • • • • •"
              className="w-full text-center text-2xl tracking-[0.5em] py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 transition-colors" />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button type="submit" disabled={!!loading || otp.length !== 6}
            className="w-full flex items-center justify-center gap-2 py-3 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-40 text-white font-semibold rounded-xl transition-colors">
            {loading === 'phone-verify' ? t('verifying') : <><CheckCircle2 size={18}/> {t('verifySignIn')}</>}
          </button>
          <button type="button" onClick={() => { setPhoneStep('input'); setOtp(''); setError(''); }}
            className="w-full text-center text-xs text-gray-400 hover:text-gray-200 transition-colors">
            {t('changeResend')}
          </button>
        </form>
      )}

      {/* ── Email + Password ── */}
      {tab === 'email' && (
        <form onSubmit={handleEmailPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">{t('emailLabel')}</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">{t('passwordLabel')}</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                placeholder={t('passwordPlaceholder')}
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
            {loading === 'email' ? t('signingIn') : <><ArrowRight size={18}/> {t('signIn')}</>}
          </button>
        </form>
      )}

      {/* ── Magic Link ── */}
      {tab === 'magic' && !magicSent && (
        <form onSubmit={handleMagicLink} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">{t('emailLabel')}</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition-colors" />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={!!loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors">
            {loading === 'magic' ? t('sending') : <><ArrowRight size={18}/> {t('sendMagicLink')}</>}
          </button>
          <p className="text-xs text-gray-500 text-center">{t('magicLinkHint')}</p>
        </form>
      )}

      {tab === 'magic' && magicSent && (
        <div className="text-center space-y-3">
          <CheckCircle2 size={40} className="text-teal-400 mx-auto" />
          <p className="text-white font-semibold">{t('checkInbox')}</p>
          <p className="text-gray-300 text-sm">{t('magicSentTo')} <span className="text-white">{email}</span>. {t('magicExpiry')}</p>
          <button onClick={() => setMagicSent(false)} className="text-teal-400 text-sm hover:text-teal-300 underline">
            {t('tryAgain')}
          </button>
        </div>
      )}

      {/* Sign up link */}
      <p className="text-center text-xs text-gray-400 pt-1 border-t border-white/10">
        {t('newHere')}{' '}
        <Link href={`/${locale}/members/signup`} className="text-teal-400 hover:text-teal-300 underline font-medium">
          {t('createAccount')}
        </Link>
      </p>
    </div>
  );
}
