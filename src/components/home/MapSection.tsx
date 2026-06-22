import { getTranslations } from 'next-intl/server';

const GOOGLE_MAPS_EMBED_URL =
  'https://maps.google.com/maps?q=22.686103,88.347538&z=16&ie=UTF8&iwloc=&output=embed';

export default async function MapSection() {
  const t = await getTranslations('map');

  return (
    <section className="py-24 bg-cream-dark/40">
      <div className="max-w-7xl mx-auto px-[clamp(18px,5vw,56px)]">

        {/* ── Section header ────────────────────────────────────────────────── */}
        <div className="text-center mb-12 reveal">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2
            className="font-rozha font-normal text-ink"
            style={{ fontSize: 'clamp(26px, 3.5vw, 44px)' }}
          >
            {t('heading')}
          </h2>
          <p className="text-ink/60 mt-3 leading-relaxed">
            {t('address')}
          </p>

          {/* Contact pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
            {[
              { href: 'tel:03326943100', label: '(033) 2694 3100' },
              { href: 'tel:+918017112877', label: '+91 80171 12877' },
              { href: 'tel:+919123991667', label: '+91 91239 91667' },
            ].map(c => (
              <a
                key={c.href}
                href={c.href}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-teal-600/10 text-teal-600 text-sm font-semibold hover:bg-teal-600/20 transition-colors no-underline"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 block shrink-0" />
                {c.label}
              </a>
            ))}
          </div>
        </div>

        {/* ── Map embed ────────────────────────────────────────────────────── */}
        <div className="rounded-card2 overflow-hidden shadow-teal border border-teal-600/10 h-80 lg:h-96 reveal">
          <iframe
            src={GOOGLE_MAPS_EMBED_URL}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Nibedita Yoga Training Centre Location"
          />
        </div>
      </div>
    </section>
  );
}
