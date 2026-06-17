import Link from 'next/link';
import type { Asana } from '@/lib/data/asanas';
import { cn } from '@/lib/utils';

type Locale = 'en' | 'hi' | 'bn';

type Props = {
  asana: Asana;
  locale: string;
};

const difficultyColour = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700',
};

export default function AsanaCard({ asana, locale }: Props) {
  const l = locale as Locale;
  const name = asana[`name_${l}`] || asana.name_en;
  const nameNative = l === 'en' ? asana.name_hi : asana[`name_${l}`];
  const description = asana[`description_${l}`] || asana.description_en;

  return (
    <Link
      href={`/${locale}/courses/${asana.slug}`}
      className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:border-saffron-200 transition-all"
    >
      {/* Image placeholder */}
      <div className="h-40 bg-gradient-to-br from-saffron-50 to-orange-50 flex items-center justify-center text-5xl">
        🧘
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span
            className={cn(
              'px-2.5 py-0.5 rounded-full text-xs font-medium',
              difficultyColour[asana.difficulty],
            )}
          >
            {asana.difficulty}
          </span>
          <span className="text-gray-400 text-xs">{nameNative}</span>
        </div>

        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-saffron-600 transition-colors">
          {name}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">{description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {asana.health_targets.slice(0, 3).map((target) => (
            <span
              key={target}
              className="px-2 py-0.5 rounded bg-gray-50 text-gray-500 text-xs border border-gray-100"
            >
              {target.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
