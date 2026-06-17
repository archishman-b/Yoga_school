'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    // Replace locale prefix in pathname
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    router.push(segments.join('/'));
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Nibedita Yoga Training Centre"
              width={44}
              height={44}
              className="rounded-full object-cover"
            />
            <span className="font-semibold text-saffron-600 text-base leading-tight hidden sm:block">
              Nibedita Yoga Training Centre
            </span>
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

          {/* Right side: lang toggle + login */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={switchLocale}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border border-teal-600 text-teal-700 hover:bg-teal-50 transition-colors"
            >
              {LOCALES[(LOCALES.findIndex((l) => l.code === locale) + 1) % LOCALES.length].label}
            </button>
            <Link
              href={`/${locale}/members`}
              className="px-4 py-2 rounded-lg bg-saffron-500 text-white text-sm font-medium hover:bg-saffron-600 transition-colors"
            >
              {t('login')}
            </Link>
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
              <Link
                href={`/${locale}/members`}
                className="px-4 py-2 rounded-lg bg-saffron-500 text-white text-sm font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {t('login')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
