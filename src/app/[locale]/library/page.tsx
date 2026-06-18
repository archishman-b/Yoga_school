import { useLocale } from 'next-intl';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  practices,
  practicesByType,
  practiceTypeCounts,
  type PracticeType,
} from '@/lib/data/practices';
import { allHealthTargets, healthTargetLabels, type HealthTarget } from '@/lib/data/asanas';
import PracticeCard from '@/components/library/PracticeCard';

export const metadata: Metadata = {
  title: 'Yogic Practice Library — Nibedita Yoga Training Centre',
  description:
    '91 practices: 10 pranayamas, 26 preparatory exercises, 50 asanas, and 5 kriyas. Complete self-practice reference with health-goal filters.',
};

type Props = { searchParams: { type?: string; target?: string } };

const ALL_TYPES: PracticeType[] = ['pranayama', 'exercise', 'asana', 'kriya'];

const typeLabels: Record<PracticeType, string> = {
  pranayama: 'Pranayamas',
  exercise:  'Exercises',
  asana:     'Asanas',
  kriya:     'Kriyas',
};

const typeColours: Record<PracticeType, { active: string; inactive: string }> = {
  pranayama: { active: 'bg-sky-600 text-white',     inactive: 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200' },
  exercise:  { active: 'bg-teal-600 text-white',    inactive: 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200' },
  asana:     { active: 'bg-saffron-500 text-white', inactive: 'bg-saffron-50 text-saffron-700 hover:bg-saffron-100 border border-saffron-200' },
  kriya:     { active: 'bg-purple-600 text-white',  inactive: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200' },
};

export default function LibraryPage({ searchParams }: Props) {
  const locale = useLocale();
  const activeType  = searchParams.type as PracticeType | undefined;
  const activeTarget = searchParams.target as HealthTarget | undefined;

  // Filter
  let filtered = practices;
  if (activeType)   filtered = filtered.filter((p) => p.type === activeType);
  if (activeTarget) filtered = filtered.filter((p) => p.health_targets.includes(activeTarget));

  function buildHref(overrides: { type?: string | null; target?: string | null }) {
    const params = new URLSearchParams();
    const t   = 'type'   in overrides ? overrides.type   : activeType;
    const tgt = 'target' in overrides ? overrides.target : activeTarget;
    if (t)   params.set('type', t);
    if (tgt) params.set('target', tgt);
    const qs = params.toString();
    return `/${locale}/library${qs ? `?${qs}` : ''}`;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-teal-700 to-teal-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-teal-300 font-semibold text-sm uppercase tracking-widest mb-3">
            Complete Self-Practice Reference
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Yogic Practice Library</h1>
          <p className="text-teal-100 text-lg max-w-2xl mb-6">
            Your complete reference for pranayamas, preparatory exercises, asanas, and kriyas —
            as taught at Nibedita Yoga Training Centre. Filter by health goal to find what your body needs.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4">
            {ALL_TYPES.map((type) => (
              <div key={type} className="bg-white/10 rounded-xl px-4 py-2 text-center min-w-[90px]">
                <p className="text-2xl font-bold">{practiceTypeCounts[type]}</p>
                <p className="text-teal-200 text-xs">{typeLabels[type]}</p>
              </div>
            ))}
            <div className="bg-white/10 rounded-xl px-4 py-2 text-center min-w-[90px]">
              <p className="text-2xl font-bold">{practices.length}</p>
              <p className="text-teal-200 text-xs">Total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* ── Type filter tabs ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-3">Practice Type</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildHref({ type: null })}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                !activeType
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({practices.length})
            </Link>
            {ALL_TYPES.map((type) => {
              const isActive = activeType === type;
              return (
                <Link
                  key={type}
                  href={buildHref({ type: isActive ? null : type })}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    isActive ? typeColours[type].active : typeColours[type].inactive
                  }`}
                >
                  {typeLabels[type]} ({practiceTypeCounts[type]})
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Health target filter ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-3">Filter by Health Goal</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildHref({ target: null })}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                !activeTarget
                  ? 'bg-saffron-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              All Goals
            </Link>
            {allHealthTargets.map((target) => (
              <Link
                key={target}
                href={buildHref({ target: activeTarget === target ? null : target })}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  activeTarget === target
                    ? 'bg-saffron-500 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {healthTargetLabels[target]}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Results ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {filtered.length} practice{filtered.length !== 1 ? 's' : ''}
              {activeType && ` · ${typeLabels[activeType]}`}
              {activeTarget && ` · ${healthTargetLabels[activeTarget]}`}
            </p>
            {(activeType || activeTarget) && (
              <Link href={`/${locale}/library`} className="text-xs text-saffron-600 hover:underline">
                Clear filters
              </Link>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-medium text-gray-600">No practices match this filter combination.</p>
              <Link href={`/${locale}/library`} className="mt-3 inline-block text-saffron-600 hover:underline text-sm">
                Clear filters
              </Link>
            </div>
          ) : (
            <>
              {/* Kriyas: always in a distinct supervised section */}
              {(!activeType || activeType === 'kriya') && filtered.some((p) => p.type === 'kriya') && (
                <div className="mb-8">
                  {!activeType && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-px flex-1 bg-gray-200" />
                      <span className="text-xs font-bold text-purple-700 uppercase tracking-wider px-2">
                        ✨ Kriyas — Supervision Required
                      </span>
                      <div className="h-px flex-1 bg-gray-200" />
                    </div>
                  )}
                  <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 mb-4 text-sm text-purple-800">
                    <strong>Note:</strong> Kriyas (internal cleansing practices) marked ⚠️ must only be
                    performed under the direct supervision of a trained teacher.
                    Contact us to arrange a supervised session.
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.filter((p) => p.type === 'kriya').map((p) => (
                      <PracticeCard key={p.slug} practice={p} locale={locale} />
                    ))}
                  </div>
                </div>
              )}

              {/* All other types */}
              {(['pranayama', 'exercise', 'asana'] as PracticeType[]).map((type) => {
                const group = filtered.filter((p) => p.type === type);
                if (group.length === 0) return null;
                return (
                  <div key={type} className="mb-8">
                    {!activeType && (
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">
                          {typeLabels[type]} ({group.length})
                        </span>
                        <div className="h-px flex-1 bg-gray-200" />
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {group.map((p) => (
                        <PracticeCard key={p.slug} practice={p} locale={locale} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* ── Back to courses ── */}
        <div className="border-t border-gray-200 pt-6 flex items-center justify-between text-sm">
          <Link href={`/${locale}/courses`} className="text-teal-600 hover:underline">
            ← Back to Programmes
          </Link>
          <Link
            href={`https://wa.me/918017112877?text=I'd+like+to+enquire+about+joining+Nibedita+Yoga+Training+Centre`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors"
          >
            Enquire About Joining
          </Link>
        </div>
      </div>
    </div>
  );
}
