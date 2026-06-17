import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ArrowRight, Star } from 'lucide-react';

export default function HeroSection() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-saffron-50 via-white to-teal-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-saffron-100/60 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-teal-100/60 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div>
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-saffron-50 border border-saffron-200 rounded-full px-4 py-1.5 text-sm text-saffron-700 font-medium mb-6">
              <Star size={14} fill="currentColor" />
              <span>Trusted by 500+ students across all ages</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {t('tagline')}
            </h1>
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

          {/* Hero image / visual */}
          <div className="relative flex justify-center">
            <div className="relative w-80 h-80 lg:w-96 lg:h-96">
              {/* Placeholder for a hero image — replace with <Image> when you have the photo */}
              <div className="w-full h-full rounded-3xl bg-gradient-to-br from-saffron-200 to-teal-200 flex items-center justify-center shadow-2xl">
                <span className="text-8xl">🧘</span>
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
