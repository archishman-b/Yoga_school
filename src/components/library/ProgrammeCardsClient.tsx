'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { HealthTarget } from '@/lib/data/asanas';

const ProgrammeModal = dynamic(() => import('@/components/library/ProgrammeModal'), { ssr: false });

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
  const [activeProgramme, setActiveProgramme] = useState<Programme | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {programmes.map((p) => (
          <div
            key={p.id}
            className={`relative border-2 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow ${p.colour}`}
          >
            {p.highlight && (
              <span className="absolute -top-2.5 left-4 text-xs font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full">
                Signature
              </span>
            )}
            <div className="text-3xl">{p.emoji}</div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 leading-snug mb-1.5">{p.name}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{p.subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {p.tagLabels.map((tag) => (
                <span key={tag} className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.badge}`}>
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => setActiveProgramme(p)}
              className="mt-1 text-center text-xs font-semibold py-2 px-3 bg-white border border-gray-200 hover:border-teal-400 hover:text-teal-700 rounded-xl transition-colors"
            >
              Enquire / Learn More
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
