import Link from 'next/link';
import type { Practice, PracticeType } from '@/lib/data/practices';
import { cn } from '@/lib/utils';

type Props = {
  practice: Practice;
  locale: string;
  compact?: boolean;
};

const typeConfig: Record<PracticeType, { label: string; colour: string; emoji: string }> = {
  pranayama: { label: 'Pranayama',   colour: 'bg-sky-100 text-sky-700',       emoji: '🌬️' },
  exercise:  { label: 'Exercise',    colour: 'bg-green-100 text-green-700',   emoji: '🤸' },
  asana:     { label: 'Asana',       colour: 'bg-saffron-100 text-saffron-700', emoji: '🧘' },
  kriya:     { label: 'Kriya',       colour: 'bg-purple-100 text-purple-700', emoji: '✨' },
};

const difficultyColour = {
  Beginner:     'bg-green-50 text-green-700',
  Intermediate: 'bg-amber-50 text-amber-700',
  Advanced:     'bg-red-50 text-red-700',
};

const gradientByType: Record<PracticeType, string> = {
  pranayama: 'from-sky-50 to-blue-100',
  exercise:  'from-green-50 to-teal-100',
  asana:     'from-saffron-50 to-orange-100',
  kriya:     'from-purple-50 to-indigo-100',
};

export default function PracticeCard({ practice, locale, compact = false }: Props) {
  const tc = typeConfig[practice.type];

  return (
    <Link
      href={`/${locale}/library/${practice.slug}`}
      className={cn(
        'group flex flex-col bg-cream border border-teal-600/10 rounded-card overflow-hidden',
        'hover:shadow-card-hover hover:border-saffron-200 transition-all',
      )}
    >
      {/* Image / placeholder */}
      {!compact && (
        <div className={cn(
          'h-36 bg-gradient-to-br flex items-center justify-center text-4xl',
          gradientByType[practice.type],
        )}>
          {practice.image_path
            ? <img src={practice.image_path} alt={practice.name_en} className="h-full w-full object-cover" />
            : <span>{tc.emoji}</span>
          }
        </div>
      )}

      <div className={cn('p-4 flex-1 flex flex-col', compact && 'p-3')}>
        {/* Type + difficulty badges */}
        <div className="flex items-center justify-between mb-2 gap-2">
          <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', tc.colour)}>
            {tc.label}
          </span>
          <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', difficultyColour[practice.difficulty])}>
            {practice.difficulty}
          </span>
        </div>

        {/* Name */}
        <h3 className={cn(
          'font-bold text-ink group-hover:text-saffron-600 transition-colors leading-snug',
          compact ? 'text-sm mb-1' : 'text-base mb-1.5',
        )}>
          {practice.name_en}
        </h3>

        {/* Native script name */}
        {practice.name_hi && (
          <p className="text-ink/40 text-xs mb-2">{practice.name_hi}</p>
        )}

        {/* Description */}
        {!compact && (
          <p className="text-ink/55 text-sm leading-relaxed line-clamp-2 flex-1">
            {practice.description_en}
          </p>
        )}

        {/* Supervision badge for kriyas */}
        {practice.supervision_required && (
          <span className="mt-2 inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 w-fit">
            ⚠️ Supervision required
          </span>
        )}

        {/* Health target chips */}
        <div className={cn('flex flex-wrap gap-1', compact ? 'mt-2' : 'mt-3')}>
          {practice.health_targets.slice(0, compact ? 2 : 3).map((target) => (
            <span
              key={target}
              className="px-1.5 py-0.5 rounded bg-cream-dark/50 text-ink/40 text-xs border border-teal-600/10"
            >
              {target.replace(/_/g, ' ')}
            </span>
          ))}
          {practice.health_targets.length > (compact ? 2 : 3) && (
            <span className="px-1.5 py-0.5 text-ink/40 text-xs">
              +{practice.health_targets.length - (compact ? 2 : 3)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
