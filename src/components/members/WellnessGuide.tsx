import { getTranslations } from 'next-intl/server';

export default async function WellnessGuide() {
  const t = await getTranslations('wellness');

  const WATER_SCHEDULE = [
    { time: t('waterTime1'), amount: t('water1Glass'), icon: '🌅' },
    { time: t('waterTime2'), amount: t('water1Glass'), icon: '☀️' },
    { time: t('waterTime3'), amount: t('water1Glass'), icon: '🥣' },
    { time: t('waterTime4'), amount: t('water1Glass'), icon: '🌞' },
    { time: t('waterTime5'), amount: t('water1Glass'), icon: '🍱' },
    { time: t('waterTime6'), amount: t('water1Glass'), icon: '🌆' },
    { time: t('waterTime7'), amount: t('water1Glass'), icon: '🌙' },
  ];

  const FOOD_TIMING = [
    { meal: t('mealBreakfast'),    time: t('mealBreakfastTime'),    icon: '🥣' },
    { meal: t('mealLunch'),        time: t('mealLunchTime'),        icon: '🍱' },
    { meal: t('mealRefreshment'),  time: t('mealRefreshmentTime'),  icon: '🫖' },
    { meal: t('mealDinner'),       time: t('mealDinnerTime'),       icon: '🍽️' },
  ];

  const PRACTICE_RULES = [
    t('practiceRule1'),  t('practiceRule2'),  t('practiceRule3'),
    t('practiceRule4'),  t('practiceRule5'),  t('practiceRule6'),
    t('practiceRule7'),  t('practiceRule8'),  t('practiceRule9'),
    t('practiceRule10'), t('practiceRule11'), t('practiceRule12'),
    t('practiceRule13'), t('practiceRule14'), t('practiceRule15'),
  ];

  const FOOD_TYPES = [
    {
      type: t('dietSattvicType'), subtitle: t('dietSattvicSubtitle'),
      desc: t('dietSattvicDesc'), examples: t('dietSattvicExamples'),
      ratio: t('dietSattvicRatio'),
      colour: 'bg-green-50 border-green-200', badge: 'bg-green-100 text-green-800', icon: '🌿',
    },
    {
      type: t('dietRajasicType'), subtitle: t('dietRajasicSubtitle'),
      desc: t('dietRajasicDesc'), examples: t('dietRajasicExamples'),
      ratio: t('dietRajasicRatio'),
      colour: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-800', icon: '🌶️',
    },
    {
      type: t('dietTamasicType'), subtitle: t('dietTamasicSubtitle'),
      desc: t('dietTamasicDesc'), examples: t('dietTamasicExamples'),
      ratio: t('dietTamasicRatio'),
      colour: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-800', icon: '⚠️',
    },
  ];

  return (
    <div className="space-y-10">

      {/* ── Section intro ── */}
      <div>
        <h1 className="text-2xl font-bold text-ink">{t('heading')}</h1>
        <p className="text-ink/55 text-sm mt-1">{t('subheading')}</p>
      </div>

      {/* ── Siva Samhita quote ── */}
      <div className="relative bg-gradient-to-br from-teal-900 to-teal-800 rounded-card p-8 text-white text-center overflow-hidden">
        <div className="absolute top-4 left-6 text-teal-600 text-8xl font-serif leading-none opacity-30 select-none">"</div>
        <div className="relative z-10">
          <p className="text-xl sm:text-2xl font-light italic leading-relaxed mb-4">
            {t('sivaQuote')}
          </p>
          <p className="text-teal-300 font-semibold text-sm">{t('sivaAttrib')}</p>
        </div>
      </div>

      {/* ── Water Drinking Protocol ── */}
      <div className="bg-cream rounded-card border border-teal-600/10 shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-teal-600/10 bg-blue-50">
          <h2 className="font-semibold text-ink flex items-center gap-2">
            <span className="text-xl">💧</span>
            {t('waterHeading')}
          </h2>
          <p className="text-xs text-ink/55 mt-0.5">{t('waterSubheading')}</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
            {WATER_SCHEDULE.map((w, i) => (
              <div key={i} className="relative">
                {i < WATER_SCHEDULE.length - 1 && (
                  <div className="hidden sm:block absolute right-0 top-6 w-full border-t-2 border-dashed border-blue-200 z-0" />
                )}
                <div className="relative z-10 flex flex-col items-center text-center bg-cream">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl mb-2">
                    {w.icon}
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 rounded-full px-2 py-0.5 mb-1.5">
                    {w.amount}
                  </span>
                  <p className="text-xs text-ink/55 leading-tight">{w.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Food Timing ── */}
      <div className="bg-cream rounded-card border border-teal-600/10 shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-teal-600/10 bg-orange-50">
          <h2 className="font-semibold text-ink flex items-center gap-2">
            <span className="text-xl">🕐</span>
            {t('foodTimingHeading')}
          </h2>
          <p className="text-xs text-ink/55 mt-0.5">{t('foodTimingSubheading')}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100">
          {FOOD_TIMING.map(f => (
            <div key={f.meal} className="px-5 py-6 text-center">
              <div className="text-3xl mb-2">{f.icon}</div>
              <p className="font-semibold text-ink text-sm">{f.meal}</p>
              <p className="text-xs text-saffron-600 font-medium mt-1">{f.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Yogic Diet ── */}
      <div>
        <h2 className="font-semibold text-ink text-lg mb-1">{t('dietHeading')}</h2>
        <p className="text-sm text-ink/55 mb-5">{t('dietSubheading')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {FOOD_TYPES.map(f => (
            <div key={f.type} className={`border-2 rounded-card p-5 space-y-3 ${f.colour}`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{f.icon}</span>
                <div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${f.badge}`}>{f.ratio}</span>
                  <h3 className="font-bold text-ink mt-1">{f.type}</h3>
                  <p className="text-xs text-ink/70">{f.subtitle}</p>
                </div>
              </div>
              <p className="text-sm text-ink/80 leading-relaxed">{f.desc}</p>
              <div className="bg-cream/60 rounded-xl px-3 py-2">
                <p className="text-xs font-semibold text-ink/55 uppercase tracking-wide mb-1">Examples</p>
                <p className="text-xs text-ink/70 leading-relaxed">{f.examples}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Practice Rules ── */}
      <div className="bg-cream rounded-card border border-teal-600/10 shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-teal-600/10">
          <h2 className="font-semibold text-ink flex items-center gap-2">
            <span className="text-xl">📋</span>
            {t('practiceRulesHeading')}
          </h2>
          <p className="text-xs text-ink/55 mt-0.5">{t('practiceRulesSubheading')}</p>
        </div>
        <ul className="divide-y divide-gray-50">
          {PRACTICE_RULES.map((rule, i) => (
            <li key={i} className="px-6 py-4 flex items-start gap-4">
              <span className="shrink-0 w-6 h-6 bg-teal-100 text-teal-700 text-xs font-bold rounded-full flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-ink/80 leading-relaxed">{rule}</p>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
