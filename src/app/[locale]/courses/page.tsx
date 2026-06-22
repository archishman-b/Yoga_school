import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { healthTargetLabels, type HealthTarget } from '@/lib/data/asanas';
import { practiceTypeCounts } from '@/lib/data/practices';
import ProgrammeCardsClient from '@/components/library/ProgrammeCardsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Courses & Programmes — Nibedita Yoga Training Centre',
  description:
    'Eight therapeutic yoga programmes including Naval Correction, Weight Management, Anti-Ageing, Digestive Health, and more. Plus a complete asana library with 50 postures.',
};

type Props = { searchParams: Record<string, string> };

export default async function CoursesPage({ searchParams: _searchParams }: Props) {
  const locale = await getLocale();
  const t = await getTranslations('courses');
  const tp = await getTranslations('programmes');

  const PROGRAMMES = [
    {
      id: 'naval-correction', emoji: '🫀',
      name: tp('navalName'), subtitle: tp('navalSubtitle'),
      tags: ['therapeutic', 'digestion'] as HealthTarget[],
      tagLabels: [tp('tagTherapeutic'), tp('tagDigestion')],
      colour: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-800',
      highlight: true, enquiry: 'Naval Correction Programme',
    },
    {
      id: 'growth-development', emoji: '🌱',
      name: tp('growthName'), subtitle: tp('growthSubtitle'),
      tags: ['growth', 'strength'] as HealthTarget[],
      tagLabels: [tp('tagGrowth'), tp('tagStrength')],
      colour: 'bg-green-50 border-green-200', badge: 'bg-green-100 text-green-800',
      enquiry: 'Growth & Development Programme',
    },
    {
      id: 'height-enhancement', emoji: '📏',
      name: tp('heightName'), subtitle: tp('heightSubtitle'),
      tags: ['growth', 'flexibility'] as HealthTarget[],
      tagLabels: [tp('tagGrowth'), tp('tagFlexibility')],
      colour: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-800',
      enquiry: 'Height Enhancement Programme',
    },
    {
      id: 'anti-ageing', emoji: '✨',
      name: tp('antiAgeingName'), subtitle: tp('antiAgeingSubtitle'),
      tags: ['anti_ageing', 'energy'] as HealthTarget[],
      tagLabels: [tp('tagAntiAgeing'), tp('tagVitality')],
      colour: 'bg-purple-50 border-purple-200', badge: 'bg-purple-100 text-purple-800',
      enquiry: 'Anti-Ageing & Vitality Programme',
    },
    {
      id: 'weight-management', emoji: '⚖️',
      name: tp('weightName'), subtitle: tp('weightSubtitle'),
      tags: ['weight_loss', 'digestion'] as HealthTarget[],
      tagLabels: [tp('tagWeightLoss'), tp('tagMetabolism')],
      colour: 'bg-orange-50 border-orange-200', badge: 'bg-orange-100 text-orange-800',
      enquiry: 'Weight Management Programme',
    },
    {
      id: 'healthy-ageing', emoji: '🌸',
      name: tp('healthyAgeingName'), subtitle: tp('healthyAgeingSubtitle'),
      tags: ['senior_wellness', 'strength'] as HealthTarget[],
      tagLabels: [tp('tagSeniorWellness'), tp('tagBalance')],
      colour: 'bg-rose-50 border-rose-200', badge: 'bg-rose-100 text-rose-800',
      enquiry: 'Healthy Ageing Programme',
    },
    {
      id: 'busy-lifestyle', emoji: '⚡',
      name: tp('busyName'), subtitle: tp('busySubtitle'),
      tags: ['stress_anxiety', 'energy'] as HealthTarget[],
      tagLabels: [tp('tagStressRelief'), tp('tagEnergy')],
      colour: 'bg-sky-50 border-sky-200', badge: 'bg-sky-100 text-sky-800',
      enquiry: 'Yoga for Busy Lifestyles',
    },
    {
      id: 'digestive-health', emoji: '🍃',
      name: tp('digestiveName'), subtitle: tp('digestiveSubtitle'),
      tags: ['digestion', 'therapeutic'] as HealthTarget[],
      tagLabels: [tp('tagDigestiveHealth'), tp('tagTherapeutic')],
      colour: 'bg-teal-50 border-teal-200', badge: 'bg-teal-100 text-teal-800',
      enquiry: 'Digestive Health Programme',
    },
  ] as const;

  const PRANAYAMS = [
    { name: 'Sahaj Pranayam No. 1', targets: ['respiratory', 'stress_anxiety'] },
    { name: 'Sahaj Pranayam No. 2', targets: ['respiratory', 'stress_anxiety'] },
    { name: 'Sahaj Pranayam No. 3', targets: ['respiratory', 'energy'] },
    { name: 'Anulom Vilom',         targets: ['stress_anxiety', 'hypertension', 'respiratory'] },
    { name: 'Sitali Pranayam',      targets: ['hypertension', 'stress_anxiety'] },
    { name: 'Suriyaved Pranayam',   targets: ['energy', 'circulation'] },
    { name: 'Bhraman Pranayam',     targets: ['stress_anxiety', 'mental_clarity'] },
    { name: 'Kapal Bhati',          targets: ['weight_loss', 'digestion'] },
    { name: 'Vastrika',             targets: ['energy', 'weight_loss'] },
    { name: 'Sahaj Pranayam No. 6', targets: ['respiratory', 'stress_anxiety'] },
  ];

  const PILLARS = [
    { no: '01', name: t('pillar1Name'), subtitle: t('pillar1Subtitle'), desc: t('pillar1Desc'), count: t('pillar1Count'), colour: 'from-saffron-500 to-orange-500' },
    { no: '02', name: t('pillar2Name'), subtitle: t('pillar2Subtitle'), desc: t('pillar2Desc'), count: t('pillar2Count'), colour: 'from-teal-500 to-cyan-600' },
    { no: '03', name: t('pillar3Name'), subtitle: t('pillar3Subtitle'), desc: t('pillar3Desc'), count: t('pillar3Count'), colour: 'from-purple-500 to-indigo-600' },
  ];

  const STAGES = [
    { stage: t('stage1Label'), label: t('stage1Name'), desc: t('stage1Desc'), colour: 'bg-green-100 text-green-800 border-green-200' },
    { stage: t('stage2Label'), label: t('stage2Name'), desc: t('stage2Desc'), colour: 'bg-saffron-100 text-saffron-800 border-saffron-200' },
    { stage: t('stage3Label'), label: t('stage3Name'), desc: t('stage3Desc'), colour: 'bg-purple-100 text-purple-800 border-purple-200' },
  ];

  const getTargetLabel = (target: string) => {
    try { return t(`healthTargets.${target}` as any) || healthTargetLabels[target as HealthTarget] || target; }
    catch { return healthTargetLabels[target as HealthTarget] || target; }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-gradient-to-br from-saffron-500 to-saffron-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-saffron-200 font-semibold text-sm uppercase tracking-widest mb-3">{t('heroEyebrow')}</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t('heroHeading')}</h1>
          <p className="text-saffron-100 text-lg max-w-2xl mx-auto">{t('heroSubheading')}</p>
          <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm">
            <a href="#programmes" className="px-4 py-2 bg-cream/20 hover:bg-cream/30 rounded-full transition-colors">{t('navProgrammes')}</a>
            <a href="#naval" className="px-4 py-2 bg-cream/20 hover:bg-cream/30 rounded-full transition-colors">{t('navNaval')}</a>
            <a href="#curriculum" className="px-4 py-2 bg-cream/20 hover:bg-cream/30 rounded-full transition-colors">{t('navCurriculum')}</a>
            <Link href={`/${locale}/library`} className="px-4 py-2 bg-cream/30 hover:bg-cream/40 rounded-full transition-colors font-semibold">{t('navLibrary')}</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <section id="programmes" className="py-16">
          <div className="mb-10">
            <p className="text-saffron-600 font-semibold text-sm uppercase tracking-widest mb-2">{t('programmesEyebrow')}</p>
            <h2 className="text-3xl font-bold text-ink">{t('programmesHeading')}</h2>
            <p className="text-ink/55 mt-2 max-w-2xl">{t('programmesSubheading')}</p>
          </div>
          <ProgrammeCardsClient programmes={[...PROGRAMMES]} locale={locale} />
          <div className="mt-6 text-sm text-ink/55 bg-cream-dark/50 rounded-xl p-4 flex gap-3">
            <span className="text-lg">ℹ️</span>
            <span>{t('programmeNote')}</span>
          </div>
        </section>

        <section id="naval" className="py-12 border-t border-teal-600/10">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-card2 p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">{t('navalEyebrow')}</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-4">{t('navalHeading')}</h2>
                <div className="text-ink/80 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: t.raw('navalDesc1') }} />
                <p className="text-ink/80 leading-relaxed mb-4">{t('navalDesc2')}</p>
                <div className="flex flex-col gap-3">
                  {[{ q: t('navalQ1'), a: t('navalA1') }, { q: t('navalQ2'), a: t('navalA2') }, { q: t('navalQ3'), a: t('navalA3') }].map(({ q, a }) => (
                    <div key={q} className="bg-cream rounded-xl p-4 border border-amber-100">
                      <p className="font-semibold text-ink text-sm mb-1">{q}</p>
                      <p className="text-sm text-ink/70">{a}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="w-40 h-40 bg-amber-100 rounded-full flex items-center justify-center text-7xl mx-auto mb-6">🫀</div>
                <h3 className="font-bold text-ink text-lg mb-2">{t('navalBadge')}</h3>
                <p className="text-ink/70 text-sm leading-relaxed mb-4">{t('navalBadgeDesc')}</p>
                <span className="inline-block px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-full uppercase tracking-wide">{t('navalSignature')}</span>
              </div>
            </div>
          </div>
        </section>

        <section id="curriculum" className="py-12 border-t border-teal-600/10">
          <div className="text-center mb-10">
            <p className="text-saffron-600 font-semibold text-sm uppercase tracking-widest mb-3">{t('curriculumEyebrow')}</p>
            <h2 className="text-3xl font-bold text-ink">{t('curriculumHeading')}</h2>
            <p className="text-ink/55 mt-2 max-w-xl mx-auto">{t('curriculumSubheading')}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {PILLARS.map((p) => (
              <div key={p.no} className="rounded-card overflow-hidden border border-teal-600/10 shadow-card">
                <div className={`bg-gradient-to-r ${p.colour} p-6 text-white`}>
                  <p className="font-mono text-5xl font-bold opacity-20 leading-none">{p.no}</p>
                  <h3 className="font-bold text-xl mt-2">{p.name}</h3>
                  <p className="text-white/80 text-sm">{p.subtitle}</p>
                </div>
                <div className="p-5 bg-cream">
                  <p className="text-ink/70 text-sm leading-relaxed mb-3">{p.desc}</p>
                  <span className="text-xs font-semibold text-ink/40 uppercase tracking-wide">{p.count}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-cream-dark/50 rounded-card p-6 border border-teal-600/15">
            <h3 className="font-semibold text-ink mb-5 text-center">{t('stageProgressionHeading')}</h3>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              {STAGES.map((s, i) => (
                <div key={s.stage} className="flex items-center gap-4">
                  <div className={`text-center border-2 rounded-card px-6 py-4 min-w-[160px] ${s.colour}`}>
                    <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{s.stage}</p>
                    <p className="font-bold text-lg mt-1">{s.label}</p>
                    <p className="text-xs mt-1 opacity-80 leading-snug">{s.desc}</p>
                  </div>
                  {i < 2 && <span className="opacity-40 text-ink/30 text-2xl hidden sm:block">→</span>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 border-t border-teal-600/10">
          <div className="mb-8">
            <p className="text-saffron-600 font-semibold text-sm uppercase tracking-widest mb-2">{t('pranayamaEyebrow')}</p>
            <h2 className="text-2xl font-bold text-ink">{t('pranayamaHeading')}</h2>
            <p className="text-ink/55 mt-1 text-sm">{t('pranayamaSubheading')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {PRANAYAMS.map((p) => (
              <div key={p.name} className="bg-gradient-to-br from-saffron-50 to-orange-50 border border-saffron-100 rounded-xl p-4">
                <p className="font-semibold text-ink text-sm mb-2">{p.name}</p>
                <div className="flex flex-wrap gap-1">
                  {p.targets.map((tgt) => (
                    <span key={tgt} className="text-xs bg-saffron-100 text-saffron-800 px-1.5 py-0.5 rounded-full">
                      {getTargetLabel(tgt)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-8 border-t border-teal-600/10">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-card p-6 lg:p-8 flex flex-col sm:flex-row gap-6 items-start">
            <div className="text-4xl">🔱</div>
            <div>
              <h3 className="font-bold text-lg mb-2">{t('kriyaHeading')}</h3>
              <div className="text-ink/55 text-sm leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: t.raw('kriyaDesc') }} />
              <a href={`/${locale}#contact`} className="inline-block text-sm font-semibold px-4 py-2 bg-cream/10 hover:bg-cream/20 border border-white/20 rounded-xl transition-colors">
                {t('kriyaEnquire')}
              </a>
            </div>
          </div>
        </section>

        <section id="library" className="py-12 border-t border-teal-600/10">
          <div className="rounded-card2 overflow-hidden border-2 border-teal-100 bg-gradient-to-br from-teal-50 via-white to-saffron-50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-3">{t('libraryEyebrow')}</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-4 leading-snug">{t('libraryHeading')}</h2>
                <p className="text-ink/70 leading-relaxed mb-6">{t('libraryDesc')}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {[
                    { count: practiceTypeCounts.pranayama, label: t('pillar1Name'), colour: 'bg-sky-50 border-sky-100 text-sky-800' },
                    { count: practiceTypeCounts.exercise,  label: t('pillar2Name'), colour: 'bg-teal-50 border-teal-100 text-teal-800' },
                    { count: practiceTypeCounts.asana,     label: t('pillar3Name'), colour: 'bg-saffron-50 border-saffron-100 text-saffron-800' },
                    { count: practiceTypeCounts.kriya,     label: 'Kriyas',         colour: 'bg-purple-50 border-purple-100 text-purple-800' },
                  ].map(({ count, label, colour }) => (
                    <div key={label} className={`text-center border rounded-xl py-3 px-2 ${colour}`}>
                      <p className="text-2xl font-bold leading-none">{count}</p>
                      <p className="text-xs font-semibold mt-1 opacity-80">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href={`/${locale}/library`} className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-full transition-colors text-sm">{t('browsePracticeLibrary')}</Link>
                  <a href={`/${locale}#contact`} className="px-6 py-3 bg-cream border-2 border-teal-600/15 hover:border-teal-400 text-ink/80 hover:text-teal-700 font-semibold rounded-full transition-colors text-sm">{t('enquireToJoin')}</a>
                </div>
              </div>
              <div className="bg-cream/60 p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-teal-100 flex flex-col justify-center gap-4">
                {[
                  { icon: '🔍', title: t('libraryBullet1Title'), desc: t('libraryBullet1Desc') },
                  { icon: '📖', title: t('libraryBullet2Title'), desc: t('libraryBullet2Desc') },
                  { icon: '🗂️', title: t('libraryBullet3Title'), desc: t('libraryBullet3Desc') },
                  { icon: '🔗', title: t('libraryBullet4Title'), desc: t('libraryBullet4Desc') },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <span className="text-2xl shrink-0 mt-0.5">{icon}</span>
                    <div>
                      <p className="font-semibold text-ink text-sm mb-0.5">{title}</p>
                      <p className="text-sm text-ink/55 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
