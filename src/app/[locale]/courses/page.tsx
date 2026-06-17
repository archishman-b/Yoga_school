import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { asanas, allHealthTargets, healthTargetLabels, type HealthTarget } from '@/lib/data/asanas';
import AsanaCard from '@/components/courses/AsanaCard';
import HealthFilter from '@/components/courses/HealthFilter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Asana Guide & Self-Help Library',
  description:
    'Find the right yoga practice for your health goal. Filter by weight loss, diabetes, back pain, stress, hypertension, and more.',
};

type Props = { searchParams: { target?: string } };

export default function CoursesPage({ searchParams }: Props) {
  const t = useTranslations('courses');
  const locale = useLocale();
  const activeTarget = searchParams.target as HealthTarget | undefined;

  const filtered = activeTarget
    ? asanas.filter((a) => a.health_targets.includes(activeTarget))
    : asanas;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-saffron-600 to-orange-700 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-saffron-200 font-semibold text-sm uppercase tracking-widest mb-3">
            Self-Help Guide
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t('heading')}</h1>
          <p className="text-saffron-100 text-lg max-w-2xl mx-auto">{t('subheading')}</p>
        </div>
      </div>

      {/* Health-target filter */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 overflow-x-auto">
          <HealthFilter
            targets={allHealthTargets}
            labels={Object.fromEntries(
              allHealthTargets.map((k) => [k, t(`healthTargets.${k}`)])
            ) as Record<HealthTarget, string>}
            activeTarget={activeTarget}
            allLabel={t('allTargets')}
            locale={locale}
          />
        </div>
      </div>

      {/* Asana grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-sm text-gray-500 mb-6">
          Showing <span className="font-semibold text-gray-900">{filtered.length}</span> practices
          {activeTarget && (
            <span> for <span className="text-saffron-600 font-medium">{t(`healthTargets.${activeTarget}`)}</span></span>
          )}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((asana) => (
            <AsanaCard key={asana.slug} asana={asana} locale={locale} />
          ))}
        </div>
      </div>
    </div>
  );
}
