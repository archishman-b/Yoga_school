'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

type Props = {
  tags: string[];
  activeTag?: string;
  allLabel: string;
  locale: string;
};

export default function TagFilter({ tags, activeTag, allLabel, locale }: Props) {
  const router = useRouter();

  const select = (tag?: string) => {
    const url = tag ? `/${locale}/yoga?tag=${encodeURIComponent(tag)}` : `/${locale}/yoga`;
    router.push(url);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => select()}
        className={cn(
          'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
          !activeTag
            ? 'bg-teal-600 text-white'
            : 'bg-cream-dark text-ink/70 hover:bg-teal-50 hover:text-teal-700',
        )}
      >
        {allLabel}
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => select(tag)}
          className={cn(
            'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
            activeTag === tag
              ? 'bg-teal-600 text-white'
              : 'bg-cream-dark text-ink/70 hover:bg-teal-50 hover:text-teal-700',
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
