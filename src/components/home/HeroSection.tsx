import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from 'next-intl';

// ── Lotus SVG icon ────────────────────────────────────────────────────────────
function LotusIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
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

export default function HeroSection() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center overflow-hidden pt-[120px] pb-[80px] px-[clamp(18px,5vw,80px)]"
      style={{
        background: 'radial-gradient(120% 90% at 50% 30%, #FFFDF9 0%, #FAF7F2 42%, #F1E9DC 100%)',
      }}
    >
      {/* ── Mandala watermark ─────────────────────────────────────────────── */}
      {/* Outer: only handles centering — no animation */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 pointer-events-none"
        style={{
          width: 'min(92vw, 920px)',
          aspectRatio: '1',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Inner: only handles rotation — inherits 100% size */}
        <div
          className="w-full h-full animate-nyc-spin"
          style={{
            opacity: 0.16,
            background: `
              repeating-conic-gradient(from 0deg at 50% 50%, #0D6B6E 0deg 0.6deg, transparent 0.6deg 9deg),
              repeating-radial-gradient(circle at 50% 50%, transparent 0 34px, #E8740C 34px 35px, transparent 35px 64px)
            `,
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, #000 18%, rgba(0,0,0,.35) 52%, transparent 74%)',
            maskImage: 'radial-gradient(circle at 50% 50%, #000 18%, rgba(0,0,0,.35) 52%, transparent 74%)',
          }}
        />
      </div>
      {/* Inner mandala ring */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 pointer-events-none"
        style={{
          width: 'min(54vw, 420px)',
          aspectRatio: '1',
          transform: 'translate(-50%, -50%)',
          opacity: 0.16,
          borderRadius: '50%',
          border: '1px solid rgba(13,107,110,0.35)',
          boxShadow: '0 0 0 14px rgba(232,116,12,.05), 0 0 0 15px rgba(232,116,12,.18), 0 0 0 44px rgba(13,107,110,.04)',
        }}
      />

      {/* ── Hero content ──────────────────────────────────────────────────── */}
      <div className="relative z-[2] max-w-[880px] mx-auto text-center flex flex-col items-center gap-[22px]">

        {/* Location pill */}
        <span
          className="inline-flex items-center gap-[9px] text-[12.5px] tracking-[2.5px] uppercase font-semibold text-teal-600 bg-teal-600/[0.08] px-4 py-2 rounded-pill animate-nyc-fadein"
          style={{ animationDelay: '1.2s' }}
        >
          <span className="w-[5px] h-[5px] rounded-full bg-saffron-500 inline-block" />
          Hindmotor · Hooghly · West Bengal
        </span>

        {/* H1 — display font, two lines */}
        <h1
          className="m-0 font-rozha font-normal leading-[1.02] tracking-[-0.5px]"
          style={{ fontSize: 'clamp(46px, 8.5vw, 108px)' }}
        >
          <span
            className="block text-ink animate-nyc-fadein"
            style={{ animationDelay: '0.4s' }}
          >
            {t('tagline').split(' ').slice(0, 2).join(' ') || 'Nibedita Yoga'}
          </span>
          <span
            className="block text-gradient-saffron animate-nyc-fadein"
            style={{ animationDelay: '0.8s' }}
          >
            Training Centre
          </span>
        </h1>

        {/* Bengali subtitle */}
        <p
          className="m-0 font-bengali text-teal-600 font-medium animate-nyc-fade60"
          style={{ fontSize: 'clamp(18px, 2.6vw, 26px)', animationDelay: '0s' }}
        >
          নিবেদিতা যোগ প্রশিক্ষণ কেন্দ্র
        </p>

        {/* Sub-tagline */}
        <p
          className="m-0 mx-auto max-w-[560px] leading-[1.6] text-ink/[0.72] animate-nyc-fadein"
          style={{ fontSize: 'clamp(15px, 2vw, 18px)', animationDelay: '1.6s' }}
        >
          {t('subtagline')}
        </p>

        {/* CTAs */}
        <div
          className="flex flex-wrap gap-3.5 justify-center mt-2 animate-nyc-fadein"
          style={{ animationDelay: '2s' }}
        >
          <Link
            href={`/${locale}#contact`}
            className="no-underline text-white font-bold text-[16px] px-[30px] py-[16px] rounded-pill animate-nyc-pulse"
            style={{ background: '#E8740C' }}
          >
            {t('cta')}
          </Link>
          <Link
            href={`/${locale}/yoga`}
            className="no-underline text-teal-600 font-semibold text-[16px] px-[30px] py-[15px] rounded-pill border-[1.5px] border-teal-600/[0.45] hover:border-teal-600 transition-colors"
            style={{ background: 'transparent' }}
          >
            {t('learnMore')} →
          </Link>
        </div>
      </div>

      {/* ── Floating batch-timings card ───────────────────────────────────── */}
      <div
        className="absolute z-[3] animate-nyc-rise"
        style={{
          left: 'clamp(18px, 5vw, 64px)',
          bottom: 'clamp(24px, 5vh, 52px)',
          animationDelay: '0.3s',
        }}
      >
        <div
          className="rounded-[18px] p-[18px_22px] max-w-[260px]"
          style={{
            background: 'rgba(255,253,249,0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(13,107,110,0.14)',
            boxShadow: '0 18px 40px -22px rgba(28,28,26,0.4)',
          }}
        >
          <div className="flex items-center gap-2 text-[11px] tracking-[2px] uppercase font-semibold text-teal-600 mb-2.5">
            <LotusIcon size={18} className="text-saffron-500" />
            Classes Daily
          </div>
          <div className="flex items-baseline gap-2.5 font-rozha text-ink">
            <span className="text-[22px]">6 AM</span>
            <span className="opacity-30">·</span>
            <span className="text-[22px]">7:30 AM</span>
            <span className="opacity-30">·</span>
            <span className="text-[22px]">6 PM</span>
          </div>
        </div>
      </div>
    </section>
  );
}
