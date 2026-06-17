import { asanas, healthTargetLabels } from '@/lib/data/asanas';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';

type Props = { params: { locale: string; slug: string } };

const difficultyColour = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Advanced: 'bg-red-100 text-red-800',
};

export function generateStaticParams() {
  return asanas.flatMap((a) =>
    ['en', 'hi', 'bn'].map((locale) => ({ locale, slug: a.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const asana = asanas.find((a) => a.slug === params.slug);
  if (!asana) return {};
  const l = params.locale as 'en' | 'hi' | 'bn';
  return {
    title: asana[`name_${l}`] || asana.name_en,
    description: asana[`description_${l}`] || asana.description_en,
  };
}

export default function AsanaDetailPage({ params }: Props) {
  const asana = asanas.find((a) => a.slug === params.slug);
  if (!asana) notFound();

  const l = params.locale as 'en' | 'hi' | 'bn';
  const name = asana[`name_${l}`] || asana.name_en;
  const description = asana[`description_${l}`] || asana.description_en;
  const steps = asana[`steps_${l}`]?.length > 1 ? asana[`steps_${l}`] : asana.steps_en;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-saffron-600 to-orange-700 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/${params.locale}/courses`}
            className="inline-flex items-center gap-2 text-saffron-200 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Asana Guide
          </Link>
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <span
              className={cn(
                'px-3 py-1 rounded-full text-xs font-semibold',
                difficultyColour[asana.difficulty],
              )}
            >
              {asana.difficulty}
            </span>
            <span className="text-saffron-200 text-sm">{asana.name_hi} · {asana.name_bn}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{name}</h1>
          <p className="text-saffron-100 text-lg leading-relaxed max-w-2xl">{description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Steps */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-5">How to Practise</h2>
          <ol className="space-y-4">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-saffron-100 text-saffron-700 rounded-full flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>

          {/* Contraindications */}
          {asana.contraindications && (
            <div className="mt-10 p-5 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={18} className="text-amber-600" />
                <h3 className="font-semibold text-amber-800">Cautions & Contraindications</h3>
              </div>
              <p className="text-amber-700 text-sm leading-relaxed">{asana.contraindications}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Benefits */}
          <div className="bg-teal-50 rounded-2xl p-5 border border-teal-100">
            <h3 className="font-bold text-teal-800 mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-teal-600" />
              Benefits
            </h3>
            <ul className="space-y-2">
              {asana.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-teal-700">
                  <span className="text-teal-400 mt-0.5">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Health targets */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Good for</h3>
            <div className="flex flex-wrap gap-2">
              {asana.health_targets.map((target) => (
                <Link
                  key={target}
                  href={`/${params.locale}/courses?target=${target}`}
                  className="px-3 py-1.5 rounded-lg bg-saffron-50 text-saffron-700 text-xs font-medium border border-saffron-200 hover:bg-saffron-100 transition-colors"
                >
                  {healthTargetLabels[target]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
