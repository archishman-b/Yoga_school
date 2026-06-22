import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

function LotusIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
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

export default async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: '#141413' }}
    >
      {/* Dot-grid texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(13,107,110,0.12) 1.3px, transparent 1.3px)',
          backgroundSize: '26px 26px',
          opacity: 0.8,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-[clamp(18px,5vw,56px)] py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Brand ────────────────────────────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span
                className="w-10 h-10 rounded-full flex-none grid place-items-center text-white"
                style={{
                  background: 'radial-gradient(circle at 50% 40%, #F4A04A, #E8740C 60%, #C95E08)',
                }}
              >
                <LotusIcon size={20} />
              </span>
              <div>
                <p className="font-rozha text-white text-[17px] leading-tight">Nibedita Yoga</p>
                <p className="text-[10.5px] tracking-[2.5px] uppercase text-teal-600 font-semibold">Training Centre</p>
              </div>
            </div>

            <p className="font-bengali text-teal-600 text-sm mb-3">
              নিবেদিতা যোগ প্রশিক্ষণ কেন্দ্র
            </p>
            <p className="text-xs leading-relaxed italic" style={{ color: 'rgba(250,247,242,0.4)' }}>
              &ldquo;{t('tagline')}&rdquo;
            </p>
          </div>

          {/* ── Quick links ──────────────────────────────────────────────────── */}
          <div>
            <h3
              className="text-[11px] font-semibold tracking-[2.5px] uppercase mb-4"
              style={{ color: 'rgba(250,247,242,0.45)' }}
            >
              {t('quickLinksHeading')}
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: `/${locale}`,         label: t('linkHome') },
                { href: `/${locale}/courses`, label: t('linkCourses') },
                { href: `/${locale}/library`, label: t('linkLibrary') },
                { href: `/${locale}/yoga`,    label: t('linkYoga') },
                { href: `/${locale}/events`,  label: t('linkEvents') },
                { href: `/${locale}/members`, label: t('linkMembers') },
              ].map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm no-underline transition-colors"
                    style={{ color: 'rgba(250,247,242,0.55)' }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ──────────────────────────────────────────────────────── */}
          <div>
            <h3
              className="text-[11px] font-semibold tracking-[2.5px] uppercase mb-4"
              style={{ color: 'rgba(250,247,242,0.45)' }}
            >
              {t('contactHeading')}
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-saffron-400 mt-0.5 shrink-0" />
                <span className="leading-relaxed" style={{ color: 'rgba(250,247,242,0.55)' }}>
                  {t('address')}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-saffron-400 shrink-0" />
                <div className="space-y-1" style={{ color: 'rgba(250,247,242,0.55)' }}>
                  <a href="tel:03326943100" className="block hover:text-white transition-colors no-underline">{t('phone1')}</a>
                  <a href="tel:+918017112877" className="block hover:text-white transition-colors no-underline">{t('phone2')}</a>
                  <a href="tel:+919123991667" className="block hover:text-white transition-colors no-underline">{t('phone3')}</a>
                </div>
              </li>
              <li className="flex items-center gap-2.5 opacity-40">
                <Mail size={14} className="text-saffron-400 shrink-0" />
                <span className="text-xs italic" style={{ color: 'rgba(250,247,242,0.55)' }}>
                  {t('emailComingSoon')}
                </span>
              </li>
            </ul>
          </div>

          {/* ── Hours + WhatsApp ─────────────────────────────────────────────── */}
          <div>
            <h3
              className="text-[11px] font-semibold tracking-[2.5px] uppercase mb-4"
              style={{ color: 'rgba(250,247,242,0.45)' }}
            >
              {t('hoursHeading')}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Clock size={14} className="text-saffron-400 mt-0.5 shrink-0" />
                <div>
                  <p style={{ color: 'rgba(250,247,242,0.75)' }} className="font-medium">{t('weekdayLabel')}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(250,247,242,0.4)' }}>{t('weekdayHours')}</p>
                </div>
              </li>
              <li className="text-xs pl-6" style={{ color: 'rgba(250,247,242,0.35)' }}>
                {t('closedNote')}
              </li>
              <li className="text-xs pl-6 text-teal-600">
                {t('orientationNote')}
              </li>
            </ul>

            {/* WhatsApp CTA */}
            <div className="mt-6">
              <a
                href="https://wa.me/918017112877?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20yoga%20classes%20at%20Nibedita%20Yoga%20Training%20Centre."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-pill bg-[#25D366] hover:bg-[#1ebe57] text-white text-xs font-bold transition-colors no-underline"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {t('whatsappCta')}
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────────────────────────────── */}
        <div
          className="mt-12 pt-6 text-center text-xs"
          style={{
            borderTop: '1px solid rgba(250,247,242,0.08)',
            color: 'rgba(250,247,242,0.25)',
          }}
        >
          {t('rights', { year })}
        </div>
      </div>
    </footer>
  );
}
