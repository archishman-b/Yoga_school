import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🪷</span>
              <span className="text-white font-semibold text-lg">Ananda Yoga Kendra</span>
            </div>
            <p className="text-sm text-gray-400 italic">{t('tagline')}</p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: `/${locale}`, label: 'Home' },
                { href: `/${locale}/yoga`, label: 'Yoga Articles' },
                { href: `/${locale}/courses`, label: 'Asana Guide' },
                { href: `/${locale}/events`, label: 'Events' },
                { href: `/${locale}/members`, label: 'Member Portal' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-saffron-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-saffron-400 mt-0.5 shrink-0" />
                <span>{t('address')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-saffron-400 shrink-0" />
                <a href={`tel:${t('phone')}`} className="hover:text-white transition-colors">
                  {t('phone')}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-saffron-400 shrink-0" />
                <a href={`mailto:${t('email')}`} className="hover:text-white transition-colors">
                  {t('email')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
          {t('rights').replace('{year}', String(year))}
        </div>
      </div>
    </footer>
  );
}
