'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    // Get current session
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/yoga`, label: t('yoga') },
    { href: `/${locale}/courses`, label: t('courses') },
    { href: `/${locale}/events`, label: t('events') },
    { href: `/${locale}/members`, label: t('members') },
  ];

  function switchLocale() {
    const currentIndex = LOCALES.findIndex((l) => l.code === locale);
    const nextLocale = LOCALES[(currentIndex + 1) % LOCALES.length].code;
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    router.push(segments.join('/'));
  }

  // Avatar initials from Google display name or email
  const displayName = user?.user_metadata?.full_name ?? user?.email ?? '';
  const initials = displayName
    .split(' ')
    .map((w: string) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  const AuthButton = () =>
    user ? (
      <Link
        href={`/${locale}/members`}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-sm font-medium hover:bg-teal-100 transition-colors"
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
    ) : (
      <Link
        href={`/${locale}/members`}
        className="px-4 py-2 rounded-lg bg-saffron-500 text-white text-sm font-medium hover:bg-saffron-600 transition-colors"
      >
        {t('login')}
      </Link>
    );

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-white shrink-0 shadow-sm ring-1 ring-gray-100">
              <Image
                src="/logo.png"
                alt="Nibedita Yoga Training Centre"
                width={44}
                height={44}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-bold text-gray-900 text-sm tracking-tight">
                Nibedita Yoga
              </span>
              <span className="text-xs text-saffron-600 font-medium tracking-wide">
                Training Centre
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-saffron-600',
                  pathname === link.href
                    ? 'text-saffron-600 border-b-2 border-saffron-500 pb-0.5'
                    : 'text-gray-600',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: lang toggle + auth */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={switchLocale}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border border-teal-600 text-teal-700 hover:bg-teal-50 transition-colors"
            >
              {LOCALES[(LOCALES.findIndex((l) => l.code === locale) + 1) % LOCALES.length].label}
            </button>
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-saffron-50 text-saffron-700'
                    : 'text-gray-600 hover:bg-gray-50',
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100 mt-2">
              <button
                onClick={switchLocale}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border border-teal-600 text-teal-700"
              >
                {LOCALES[(LOCALES.findIndex((l) => l.code === locale) + 1) % LOCALES.length].label}
              </button>
              <AuthButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
