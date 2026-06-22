'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const ProgrammeModal = dynamic(() => import('@/components/library/ProgrammeModal'), { ssr: false });

function LotusIcon({ size = 22, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={`lotus-icon ${className}`}
      aria-hidden="true"
    >
      <g fill="currentColor">
        <path d="M32 52 C28 36 32 18 32 18 C32 18 36 36 32 52 Z" />
        <path d="M32 52 C28 36 32 18 32 18 C32 18 36 36 32 52 Z" transform="rotate(-38 32 52)" />
        <path d="M32 52 C28 36 32 18 32 18 C32 18 36 36 32 52 Z" transform="rotate(38 32 52)" />
        <path d="M32 52 C28 36 32 18 32 18 C32 18 36 36 32 52 Z" transform="rotate(-19 32 52)" />
        <path d="M32 52 C28 36 32 18 32 18 C32 18 36 36 32 52 Z" transform="rotate(19 32 52)" />
      </g>
    </svg>
  );
}

type Programme = {
  id: string;
  emoji: string;
  name: string;
  subtitle: string;
  tagLabels: readonly string[];
  colour: string;
  badge: string;
  highlight?: boolean;
  enquiry: string;
};

type Props = {
  programmes: Programme[];
  locale: string;
};

export default function ProgrammeCardsClient({ programmes, locale }: Props) {
  const t = useTranslations('programmeModal');
  const tCourses = useTranslations('courses');
  const [activeProgramme, setActiveProgramme] = useState<Programme | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {programmes.map((p) => (
          <div
            key={p.id}
            className="course-card relative card flex flex-col gap-3 p-5"
          >
            {/* Highlight badge */}
            {p.highlight && (
              <span className="absolute -top-2.5 left-4 text-xs font-bold bg-saffron-500 text-white px-2.5 py-0.5 rounded-full">
                {tCourses('signatureBadge')}
              </span>
            )}

            {/* Emoji + lotus icon row */}
            <div className="flex items-center justify-between">
              <span className="text-3xl">{p.emoji}</span>
              <span className="text-saffron-400/60">
                <LotusIcon size={18} />
              </span>
            </div>

            <div className="flex-1">
              <h3 className="font-rozha font-normal text-ink text-lg leading-snug mb-1.5">
                {p.name}
              </h3>
              <p className="text-sm text-ink/60 leading-relaxed">{p.subtitle}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {p.tagLabels.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-600/10 text-teal-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA button */}
            <button
              onClick={() => setActiveProgramme(p)}
              className="mt-1 w-full text-center text-xs font-bold py-2.5 px-3 rounded-pill bg-saffron-500/10 text-saffron-600 hover:bg-saffron-500 hover:text-white transition-colors border border-saffron-500/20"
            >
              {tCourses('enquireLearnMore')}
            </button>
          </div>
        ))}
      </div>

      {activeProgramme && (
        <ProgrammeModal
          programme={activeProgramme}
          locale={locale}
          onClose={() => setActiveProgramme(null)}
        />
      )}
    </>
  );
}
