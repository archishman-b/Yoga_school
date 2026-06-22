'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { practicesBySlug, DEFAULT_PROGRAMME_MAPPINGS, type Practice } from '@/lib/data/practices';
import PracticeCard from '@/components/library/PracticeCard';

type Programme = {
  id: string;
  name: string;
  subtitle: string;
  colour: string;
  badge: string;
  enquiry: string;
};

type Props = {
  programme: Programme;
  locale: string;
  onClose: () => void;
};

export default function ProgrammeModal({ programme, locale, onClose }: Props) {
  const t = useTranslations('programmeModal');
  const [mappedPractices, setMappedPractices] = useState<Practice[]>([]);

  useEffect(() => {
    const loadMappings = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data, error } = await supabase
          .from('programme_practice_mappings')
          .select('practice_id')
          .eq('programme_id', programme.id);

        if (!error && data && data.length > 0) {
          const practices = data
            .map((row: { practice_id: string }) => practicesBySlug.get(row.practice_id))
            .filter(Boolean) as Practice[];
          setMappedPractices(practices);
          return;
        }
      } catch {
        // fall through
      }

      const slugs = DEFAULT_PROGRAMME_MAPPINGS[programme.id] ?? [];
      const practices = slugs
        .map((s) => practicesBySlug.get(s))
        .filter(Boolean) as Practice[];
      setMappedPractices(practices);
    };

    loadMappings();
  }, [programme.id]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-cream shadow-2xl overflow-y-auto flex flex-col">

        {/* Header */}
        <div className={`${programme.colour} border-b border-teal-600/15 px-6 py-5 flex items-start justify-between gap-4`}>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-ink mb-1">{programme.name}</h2>
            <p className="text-ink/70 text-sm leading-relaxed">{programme.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="mt-0.5 p-2 rounded-full hover:bg-black/10 transition-colors shrink-0"
            aria-label={t('close')}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 px-6 py-6 space-y-6">

          {/* What to expect */}
          <div>
            <h3 className="font-semibold text-ink mb-2 text-sm uppercase tracking-wide">{t('whatToExpect')}</h3>
            <p className="text-ink/70 text-sm leading-relaxed">
              {t('whatToExpectDesc')}
            </p>
          </div>

          {/* Suggested practices */}
          <div>
            <h3 className="font-semibold text-ink mb-3 text-sm uppercase tracking-wide">
              {t('illustrativePractices')}
            </h3>
            {mappedPractices.length === 0 ? (
              <div className="py-8 text-center text-ink/40 text-sm">{t('loadingPractices')}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mappedPractices.map((p) => (
                  <PracticeCard key={p.slug} practice={p} locale={locale} compact />
                ))}
              </div>
            )}
            <Link
              href={`/${locale}/library`}
              className="mt-3 inline-block text-teal-600 hover:underline text-sm"
            >
              {t('browseLibrary')}
            </Link>
          </div>

          {/* Admission info */}
          <div className="bg-saffron-50 border border-saffron-200 rounded-xl p-4 text-sm text-saffron-800"
            dangerouslySetInnerHTML={{ __html: t.raw('admissionNote') }}
          />
        </div>

        {/* Footer CTA */}
        <div className="border-t border-teal-600/10 px-6 py-4 bg-cream-dark/50 flex flex-col sm:flex-row gap-3">
          <a
            href={`https://wa.me/918017112877?text=I'm+interested+in+the+${encodeURIComponent(programme.enquiry)}+at+Nibedita+Yoga`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-4 bg-green-500 text-white rounded-full text-sm font-semibold text-center hover:bg-green-600 transition-colors"
          >
            {t('enquireWhatsapp')}
          </a>
          <Link
            href={`/${locale}/members`}
            className="flex-1 py-2.5 px-4 bg-teal-600 text-white rounded-full text-sm font-semibold text-center hover:bg-teal-700 transition-colors"
          >
            {t('registerOnline')}
          </Link>
        </div>
      </div>
    </>
  );
}
