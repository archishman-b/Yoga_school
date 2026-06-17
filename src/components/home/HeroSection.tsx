import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { ArrowRight, MapPin } from 'lucide-react';

export default function HeroSection() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-saffron-50 via-white to-teal-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-saffron-100/60 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-teal-100/60 rounded-full blur-3xl" />
        {/* Mandala-inspired rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-saffron-100 rounded-full opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[820px] h-[820px] border border-teal-50 rounded-full opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div>
            {/* School name — Indic display font (Rozha One) */}
            <div className="mb-8">
              <h1 className="font-rozha text-5xl sm:text-6xl lg:text-7xl text-gray-900 leading-[1.1] tracking-wide">
                Nibedita Yoga
              </h1>
              <h1 className="font-rozha text-4xl sm:text-5xl lg:text-6xl text-saffron-600 leading-[1.1] tracking-wide">
                Training Centre
              </h1>
              {/* Bengali name — local identity */}
              <p className="font-bengali text-xl sm:text-2xl text-teal-700 mt-2 opacity-85 tracking-wide">
                নিবেদিতা যোগ প্রশিক্ষণ কেন্দ্র
              </p>
              <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-500">
                <MapPin size={13} className="text-saffron-400" />
                <span>Hindmotor, Hooghly, West Bengal</span>
              </div>
            </div>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
              {t('subtagline')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${locale}#contact`}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-saffron-500 hover:bg-saffron-600 text-white font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg"
              >
                {t('cta')}
                <ArrowRight size={18} />
              </Link>
              <Link
                href={`/${locale}/yoga`}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-teal-400 hover:text-teal-700 transition-colors"
              >
                {t('learnMore')}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-100">
              {[
                { value: '15+', label: 'Years Teaching' },
                { value: '500+', label: 'Happy Students' },
                { value: '3', label: 'Batch Levels' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-saffron-600">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative flex justify-center">
            <div className="relative w-80 h-80 lg:w-96 lg:h-96">
              {/* Logo in a circular frame — overflow-hidden clips transparent PNG corners */}
              <div className="w-full h-full rounded-full bg-gradient-to-br from-saffron-50 via-white to-teal-50 flex items-center justify-center shadow-2xl border border-saffron-100">
                <div className="w-56 h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden bg-white shadow-lg">
                  <Image
                    src="/logo.png"
                    alt="Nibedita Yoga Training Centre"
                    width={256}
                    height={256}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-lg">
                  🌿
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Classes Daily</p>
                  <p className="text-xs text-gray-500">6 AM · 7:30 AM · 6 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
