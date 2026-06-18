'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

// ── Lotus SVG icon — matches design prototype exactly ──────────────────────
function LotusIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <g fill="currentColor">
        <path d="M32 52 C28 36 32 18 32 18 C32 18 36 36 32 52 Z" />
        <path d="M32 52 C28 36 32 18 32 18 C32 18 36 36 32 52 Z" transform="rotate(-38 32 52)" />
        <path d="M32 52 C28 36 32 18 32 18 C32 18 36 36 32 52 Z" transform="rotate(38 32 52)" />
        <path d="M32 52 C28 36 32 18 32 18 C32 18 36 36 32 52 Z" transform="rotate(-19 32 52)" />
        <path d="M32 52 C28 36 32 18 32 18 C32 18 36 36 32 52 Z" transform="rotate(19 32 52)" />
      </g>
    </svg>
  );
}

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हि' },
  { code: 'bn', label: 'বাং' },
];

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const lastScrollY = useRef(0);

  // Nav hide-on-scroll-down / show-on-scroll-up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastScrollY.current + 4 && y > 80 && !mobileOpen) {
        setHidden(true);
      } else if (y < lastScrollY.current - 4) {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileOpen]);

  useEffect(() => {
    const supabase = createClient();
    const loadUser = async (uid: string | undefined) => {
      if (!uid) { setIsAdmin(false); return; }
      const { data } = await supabase.from('profiles').select('role').eq('id', uid).single();
      setIsAdmin(data?.role === 'admin');
    };
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); loadUser(data.user?.id); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      loadUser(session?.user?.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  const navLinks = [
    { href: `/${locale}`,         label: t('home') },
    { href: `/${locale}/yoga`,    label: t('yoga') },
    { href: `/${locale}/courses`, label: t('courses') },
    { href: `/${locale}/library`, label: t('library') },
    { href: `/${locale}/events`,  label: t('events') },
    { href: `/${locale}/members`, label: t('members') },
  ];

  function switchLocale() {
    const currentIndex = LOCALES.findIndex((l) => l.code === locale);
    const nextLocale = LOCALES[(currentIndex + 1) % LOCALES.length].code;
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    router.push(segments.join('/'));
  }

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? '';
  const initials = displayName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const nextLang = LOCALES[(LOCALES.findIndex((l) => l.code === locale) + 1) % LOCALES.length];

  const AuthButton = () =>
    user ? (
      <div className="flex items-center gap-2">
        {isAdmin && (
          <Link
            href={`/${locale}/admin`}
            className="px-3 py-1.5 rounded-pill bg-saffron-50 text-saffron-600 border border-saffron-200 text-xs font-semibold hover:bg-saffron-100 transition-colors"
          >
            Admin
          </Link>
        )}
        <Link
          href={`/${locale}/members`}
          className="flex items-center gap-2 px-3 py-1.5 rounded-pill bg-teal-600/10 border border-teal-600/20 text-teal-600 text-sm font-semibold hover:bg-teal-600/20 transition-colors"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
              {initials || <LayoutDashboard size={12} />}
            </div>
          )}
          <span>My Portal</span>
        </Link>
      </div>
    ) : (
      <Link
        href={`/${locale}/members`}
        className="px-5 py-2 rounded-pill bg-saffron-500 hover:bg-saffron-600 text-white text-sm font-bold transition-colors"
        style={{ boxShadow: '0 6px 16px -6px rgba(232,116,12,0.7)' }}
      >
        {t('login')}
      </Link>
    );

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-transform duration-250 ease-out',
        hidden ? '-translate-y-full' : 'translate-y-0',
      )}
    >
      {/* Main nav bar */}
      <div
        className="flex items-center justify-between px-[clamp(18px,4vw,56px)] py-3.5 border-b border-ink/[0.07]"
        style={{
          background: 'rgba(250,247,242,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-3 text-ink no-underline flex-none">
          {/* Lotus badge */}
          <span
            className="w-[42px] h-[42px] rounded-full flex-none grid place-items-center text-[#fff5e8]"
            style={{
              background: 'radial-gradient(circle at 50% 40%, #F4A04A, #E8740C 60%, #C95E08)',
              boxShadow: '0 4px 14px -4px rgba(232,116,12,0.6)',
            }}
          >
            <LotusIcon size={24} />
          </span>
          {/* Brand name */}
          <span className="hidden sm:block leading-[1.05]">
            <span className="block font-rozha text-[18px] tracking-[0.2px] text-ink">Nibedita Yoga</span>
            <span className="block text-[10.5px] tracking-[2.5px] uppercase text-teal-600 font-semibold">Training Centre</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-[30px]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-[15px] font-medium transition-colors no-underline',
                pathname === link.href
                  ? 'text-saffron-500'
                  : 'text-ink hover:text-saffron-500',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: lang toggle + auth */}
        <div className="flex items-center gap-3 flex-none">
          {/* Lang pill switcher */}
          <div className="flex bg-teal-600/[0.08] rounded-pill p-[3px] gap-[2px]">
            {LOCALES.map((loc) => {
              const active = loc.code === locale;
              return (
                <button
                  key={loc.code}
                  onClick={() => {
                    if (!active) {
                      const segments = pathname.split('/');
                      segments[1] = loc.code;
                      router.push(segments.join('/'));
                    }
                  }}
                  className={cn(
                    'border-none cursor-pointer font-sans font-semibold text-[12px] px-[11px] py-[6px] rounded-pill transition-colors',
                    active
                      ? 'bg-saffron-500 text-white'
                      : 'bg-transparent text-teal-600 hover:bg-teal-600/10',
                  )}
                >
                  {loc.label}
                </button>
              );
            })}
          </div>

          {/* Auth — desktop only */}
          <div className="hidden md:block">
            <AuthButton />
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden p-1.5 text-ink"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[99] flex flex-col"
          style={{ background: 'rgba(28,28,26,0.5)', backdropFilter: 'blur(6px)' }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute top-[72px] left-3.5 right-3.5 rounded-[20px] p-3.5 flex flex-col gap-0.5 border border-teal-600/[0.12]"
            style={{ background: '#FAF7F2', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.4)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'no-underline font-bold text-[17px] px-4 py-3.5 rounded-xl block transition-colors',
                  pathname === link.href
                    ? 'text-saffron-500 bg-saffron-50'
                    : 'text-ink hover:bg-cream-dark/50',
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-1.5">
              <Link
                href={`/${locale}/members`}
                onClick={() => setMobileOpen(false)}
                className="block text-center no-underline text-white bg-saffron-500 font-bold text-[16px] py-3.5 px-4 rounded-xl"
              >
                {t('login')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
