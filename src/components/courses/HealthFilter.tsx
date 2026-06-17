'use client';

import { useRouter } from 'next/navigation';
import type { HealthTarget } from '@/lib/data/asanas';
import { cn } from '@/lib/utils';

type Props = {
  targets: HealthTarget[];
  labels: Record<HealthTarget, string>;
  activeTarget?: HealthTarget;
  allLabel: string;
  locale: string;
};

export default function HealthFilter({ targets, labels, activeTarget, allLabel, locale }: Props) {
  const router = useRouter();

  const select = (target?: HealthTarget) => {
    const url = target
      ? `/${locale}/courses?target=${target}`
      : `/${locale}/courses`;
    router.push(url);
  };

  return (
    <div className="flex gap-2 flex-nowrap min-w-max pb-1">
      <button
        onClick={() => select()}
        className={cn(
          'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
          !activeTarget
            ? 'bg-saffron-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-saffron-50 hover:text-saffron-700',
        )}
      >
        {allLabel}
      </button>
      {targets.map((target) => (
        <button
          key={target}
          onClick={() => select(target)}
          className={cn(
            'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
            activeTarget === target
              ? 'bg-saffron-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-saffron-50 hover:text-saffron-700',
          )}
        >
          {labels[target]}
        </button>
      ))}
    </div>
  );
}
