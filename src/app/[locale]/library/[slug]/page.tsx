import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import type { Metadata } from 'next';
import { practices, practicesBySlug, practiceTypeLabels, type PracticeType } from '@/lib/data/practices';
import { healthTargetLabels } from '@/lib/data/asanas';

type Props = { params: { slug: string; locale: string } };

export async function generateStaticParams() {
  return practices.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const practice = practicesBySlug.get(params.slug);
  if (!practice) return {};
  return {
    title: `${practice.name_en} — Nibedita Yoga Practice Library`,
    description: practice.description_en.slice(0, 160),
  };
}

const typeGradient: Record<PracticeType, string> = {
  pranayama: 'from-sky-600 to-blue-700',
  exercise:  'from-teal-600 to-teal-800',
  asana:     'from-saffron-500 to-orange-600',
  kriya:     'from-purple-600 to-indigo-700',
};

const difficultyColour = {
  Beginner:     'bg-green-100 text-green-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced:     'bg-red-100 text-red-700',
};

export default function PracticeDetailPage({ params }: Props) {
  const practice = practicesBySlug.get(params.slug);
  if (!practice) notFound();

  const locale = useLocale();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className={`bg-gradient-to-br ${typeGradient[practice.type]} text-white py-12 px-4`}>
        <div className="max-w-3xl mx-auto">
          <Link href={`/${locale}/library`} className="text-white/70 hover:text-white text-sm mb-4 inline-block">
            ← Back to Library
          </Link>
          <div className="flex items-start gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold w-fit">
                {practiceTypeLabels[practice.type]}
              </span>
              {practice.supervision_required && (
                <span className="px-3 py-1 bg-amber-400/90 text-amber-900 rounded-full text-xs font-semibold w-fit">
                  ⚠️ Supervision Required
                </span>
              )}
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-1">{practice.name_en}</h1>
          {practice.name_hi && (
            <p className="text-white/70 text-lg mb-3">{practice.name_hi}
              {practice.name_bn && <span className="ml-3">{practice.name_bn}</span>}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white`}>
              {practice.difficulty}
            </span>
            {practice.duration && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white">
                ⏱ {practice.duration}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Image placeholder */}
        <div className={`h-52 rounded-2xl bg-gradient-to-br ${typeGradient[practice.type]} opacity-10 flex items-center justify-center text-6xl`}>
          {practice.image_path
            ? <img src={practice.image_path} alt={practice.name_en} className="h-full w-full object-cover rounded-2xl" />
            : <span className="opacity-60 text-6xl">
                {practice.type === 'pranayama' ? '🌬️' : practice.type === 'exercise' ? '🤸' : practice.type === 'kriya' ? '✨' : '🧘'}
              </span>
          }
        </div>
        {/* TODO: Add actual practice image to /public/practices/{slug}.jpg */}

        {/* Description */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3">About this Practice</h2>
          <p className="text-gray-600 leading-relaxed">{practice.description_en}</p>
        </div>

        {/* Supervision warning */}
        {practice.supervision_required && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
            <span className="text-amber-500 text-xl shrink-0">⚠️</span>
            <div>
              <p className="font-semibold text-amber-800 mb-1">Supervised Practice Only</p>
              <p className="text-amber-700 text-sm leading-relaxed">
                This kriya must only be performed under the direct supervision of a trained and
                experienced teacher. Contact us to arrange a supervised session before attempting.
              </p>
            </div>
          </div>
        )}

        {/* How to practise */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">How to Practise</h2>
          <ol className="space-y-3">
            {practice.steps_en.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-saffron-100 text-saffron-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-gray-600 text-sm leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Benefits</h2>
          <ul className="space-y-2">
            {practice.benefits.map((b, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="text-teal-500 mt-0.5 shrink-0">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Health targets */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3">Health Goals Addressed</h2>
          <div className="flex flex-wrap gap-2">
            {practice.health_targets.map((target) => (
              <Link
                key={target}
                href={`/${locale}/library?target=${target}`}
                className="px-3 py-1.5 rounded-full bg-saffron-50 text-saffron-700 text-sm font-medium border border-saffron-200 hover:bg-saffron-100 transition-colors"
              >
                {healthTargetLabels[target]}
              </Link>
            ))}
          </div>
        </div>

        {/* Contraindications */}
        {practice.contraindications && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <h2 className="font-semibold text-red-800 mb-2">⚠️ Cautions & Contraindications</h2>
            <p className="text-red-700 text-sm leading-relaxed">{practice.contraindications}</p>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-2xl p-6 text-white text-center">
          <p className="font-semibold text-lg mb-1">Want to learn this under guidance?</p>
          <p className="text-teal-200 text-sm mb-4">
            All practices in this library are taught systematically at Nibedita Yoga Training Centre.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={`/${locale}/courses`}
              className="px-5 py-2 bg-white text-teal-700 rounded-full text-sm font-semibold hover:bg-teal-50 transition-colors"
            >
              View Programmes
            </Link>
            <a
              href={`https://wa.me/918017112877?text=I'd+like+to+learn+${encodeURIComponent(practice.name_en)}+at+Nibedita+Yoga`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 bg-green-500 text-white rounded-full text-sm font-semibold hover:bg-green-600 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-2">
          <Link href={`/${locale}/library`} className="text-teal-600 text-sm hover:underline">
            ← Back to Library
          </Link>
        </div>
      </div>
    </div>
  );
}
