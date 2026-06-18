import { useLocale } from 'next-intl';
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

// ── 8 specialisation programmes ──────────────────────────────────────────────
const PROGRAMMES = [
  {
    id: 'naval-correction',
    emoji: '🫀',
    name: 'Naval Correction Programme',
    subtitle: 'Yogic assessment & targeted asanas to correct displaced navel (Nabhi Correction)',
    tags: ['therapeutic', 'digestion'] as HealthTarget[],
    tagLabels: ['Therapeutic', 'Digestive Health'],
    colour: 'bg-amber-50 border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
    highlight: true,
    enquiry: 'Naval Correction Programme',
  },
  {
    id: 'growth-development',
    emoji: '🌱',
    name: 'Growth & Development Programme',
    subtitle: 'Yoga for physical development, especially for children and adolescents',
    tags: ['growth', 'strength'] as HealthTarget[],
    tagLabels: ['Growth', 'Strength'],
    colour: 'bg-green-50 border-green-200',
    badge: 'bg-green-100 text-green-800',
    enquiry: 'Growth & Development Programme',
  },
  {
    id: 'height-enhancement',
    emoji: '📏',
    name: 'Height Enhancement Programme',
    subtitle: 'Specific asanas known to support spinal elongation and healthy posture',
    tags: ['growth', 'flexibility'] as HealthTarget[],
    tagLabels: ['Growth', 'Flexibility'],
    colour: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
    enquiry: 'Height Enhancement Programme',
  },
  {
    id: 'anti-ageing',
    emoji: '✨',
    name: 'Anti-Ageing & Vitality Programme',
    subtitle: 'Practices to maintain youthfulness, energy, and slow the ageing process',
    tags: ['anti_ageing', 'energy'] as HealthTarget[],
    tagLabels: ['Anti-Ageing', 'Vitality'],
    colour: 'bg-purple-50 border-purple-200',
    badge: 'bg-purple-100 text-purple-800',
    enquiry: 'Anti-Ageing & Vitality Programme',
  },
  {
    id: 'weight-management',
    emoji: '⚖️',
    name: 'Weight Management Programme',
    subtitle: 'Targeted asana and pranayama sequences for healthy, sustainable weight loss',
    tags: ['weight_loss', 'digestion'] as HealthTarget[],
    tagLabels: ['Weight Loss', 'Metabolism'],
    colour: 'bg-orange-50 border-orange-200',
    badge: 'bg-orange-100 text-orange-800',
    enquiry: 'Weight Management Programme',
  },
  {
    id: 'healthy-ageing',
    emoji: '🌸',
    name: 'Healthy Ageing Programme',
    subtitle: 'Gentle, adapted practices for strength, balance, and well-being in later life',
    tags: ['senior_wellness', 'strength'] as HealthTarget[],
    tagLabels: ['Senior Wellness', 'Balance'],
    colour: 'bg-rose-50 border-rose-200',
    badge: 'bg-rose-100 text-rose-800',
    enquiry: 'Healthy Ageing Programme',
  },
  {
    id: 'busy-lifestyle',
    emoji: '⚡',
    name: 'Yoga for Busy Lifestyles',
    subtitle: 'Short, high-impact daily routines for people with demanding schedules',
    tags: ['stress_anxiety', 'energy'] as HealthTarget[],
    tagLabels: ['Stress Relief', 'Energy'],
    colour: 'bg-sky-50 border-sky-200',
    badge: 'bg-sky-100 text-sky-800',
    enquiry: 'Yoga for Busy Lifestyles',
  },
  {
    id: 'digestive-health',
    emoji: '🍃',
    name: 'Digestive Health Programme',
    subtitle: 'Specific asanas and breathing practices for acidity, indigestion, and constipation',
    tags: ['digestion', 'therapeutic'] as HealthTarget[],
    tagLabels: ['Digestive Health', 'Therapeutic'],
    colour: 'bg-teal-50 border-teal-200',
    badge: 'bg-teal-100 text-teal-800',
    enquiry: 'Digestive Health Programme',
  },
] as const;

// ── Pranayams list from curriculum ────────────────────────────────────────────
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

// ── Curriculum pillars ────────────────────────────────────────────────────────
const PILLARS = [
  {
    no: '01',
    name: 'Pranayams',
    subtitle: 'Breathing Practices',
    desc: 'Pranayama works directly on the respiratory and nervous systems. Ten techniques taught across three stages — from simple breath awareness to advanced retention.',
    colour: 'from-saffron-500 to-orange-500',
    count: '10 techniques',
  },
  {
    no: '02',
    name: 'Preparatory Movement',
    subtitle: '& Conditioning',
    desc: '26 exercises targeting specific body parts and energy centres — joints, spine, abdominal organs, and chakra points — preparing the body for asana practice.',
    colour: 'from-teal-500 to-cyan-600',
    count: '26 exercises',
  },
  {
    no: '03',
    name: 'Yogic Asanas',
    subtitle: 'Postures',
    desc: 'Fifty postures from Tadasana to Surya Namaskar, Halasana to Sarvangasana. Each asana is practised in progression across three stages: Foundation, Intermediate, and Advanced.',
    colour: 'from-purple-500 to-indigo-600',
    count: '50 postures',
  },
];

export default function CoursesPage({ searchParams: _searchParams }: Props) {
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-saffron-600 to-orange-700 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-saffron-200 font-semibold text-sm uppercase tracking-widest mb-3">
            Programmes & Self-Help Library
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Courses & Programmes</h1>
          <p className="text-saffron-100 text-lg max-w-2xl mx-auto">
            Eight therapeutic programmes. Fifty asanas. Guided by the oldest system of personal
            development the world has ever known.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm">
            <a href="#programmes" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
              Programmes ↓
            </a>
            <a href="#naval" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
              Naval Assessment ↓
            </a>
            <a href="#curriculum" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
              Curriculum ↓
            </a>
            <Link href={`/${locale}/library`} className="px-4 py-2 bg-white/30 hover:bg-white/40 rounded-full transition-colors font-semibold">
              Practice Library →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── 8 Specialisation Programmes ── */}
        <section id="programmes" className="py-16">
          <div className="mb-10">
            <p className="text-saffron-600 font-semibold text-sm uppercase tracking-widest mb-2">
              Therapeutic Specialisations
            </p>
            <h2 className="text-3xl font-bold text-gray-900">Eight programmes for specific needs</h2>
            <p className="text-gray-500 mt-2 max-w-2xl">
              Nibedita Yoga Training Centre offers targeted programmes for specific health goals and
              conditions — not one-size-fits-all classes. Each batch is limited to 30 students for
              personalised attention.
            </p>
          </div>

          <ProgrammeCardsClient programmes={[...PROGRAMMES]} locale={locale} />

          <div className="mt-6 text-sm text-gray-500 bg-gray-50 rounded-xl p-4 flex gap-3">
            <span className="text-lg">ℹ️</span>
            <span>
              After your free trial class, our instructor will recommend the most suitable programme
              and stage for you — based on your health profile and goals.
            </span>
          </div>
        </section>

        {/* ── Naval Examination Explainer ── */}
        <section id="naval" className="py-12 border-t border-gray-100">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
                  Our Signature Assessment
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  What is the Initial Health & Fitness Assessment?
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Every new student begins with a comprehensive assessment conducted by our lead
                  instructor. The most distinctive element is the <strong>Nabhi (navel) examination</strong>
                  — a traditional yogic diagnostic technique used to identify displacement of the
                  navel centre, which is associated with a range of digestive and systemic complaints.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Based on this assessment and your personal health profile, our instructor assigns
                  you to the most appropriate programme and stage — ensuring your practice is safe,
                  effective, and personalised from day one.
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    { q: 'Is the assessment mandatory?', a: 'Yes — it helps us assign the right programme. It is gentle and non-invasive.' },
                    { q: 'What happens if navel displacement is found?', a: 'You are enrolled in the Naval Correction Programme with targeted corrective asanas under direct supervision.' },
                    { q: 'Who conducts the assessment?', a: 'Rekha Nath, Lead Instructor and Founder of the school.' },
                  ].map(({ q, a }) => (
                    <div key={q} className="bg-white rounded-xl p-4 border border-amber-100">
                      <p className="font-semibold text-gray-900 text-sm mb-1">{q}</p>
                      <p className="text-sm text-gray-600">{a}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="w-40 h-40 bg-amber-100 rounded-full flex items-center justify-center text-7xl mx-auto mb-6">
                  🫀
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Naval Correction Programme</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  The school's most distinctive offering — yogic assessment and targeted asanas to
                  correct Nabhi (navel) displacement, addressing root causes of digestive and
                  systemic complaints.
                </p>
                <span className="inline-block px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                  Signature Programme
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Three-Pillar Curriculum ── */}
        <section id="curriculum" className="py-12 border-t border-gray-100">
          <div className="text-center mb-10">
            <p className="text-saffron-600 font-semibold text-sm uppercase tracking-widest mb-3">
              Your Learning Journey
            </p>
            <h2 className="text-3xl font-bold text-gray-900">Three Pillars · Three Stages</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Our curriculum is organised across three pillars, each progressing through three stages
              — Foundation, Intermediate, and Advanced Practice.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {PILLARS.map((p) => (
              <div key={p.no} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className={`bg-gradient-to-r ${p.colour} p-6 text-white`}>
                  <p className="font-mono text-5xl font-bold opacity-20 leading-none">{p.no}</p>
                  <h3 className="font-bold text-xl mt-2">{p.name}</h3>
                  <p className="text-white/80 text-sm">{p.subtitle}</p>
                </div>
                <div className="p-5 bg-white">
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{p.desc}</p>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{p.count}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Stage progression */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-5 text-center">Stage Progression</h3>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              {[
                { stage: '1st Stage', label: 'Foundation', desc: 'Beginner · New students, health-condition specific', colour: 'bg-green-100 text-green-800 border-green-200' },
                { stage: '2nd Stage', label: 'Intermediate', desc: 'For those who completed Foundation or have prior experience', colour: 'bg-saffron-100 text-saffron-800 border-saffron-200' },
                { stage: 'Final Stage', label: 'Advanced Practice', desc: 'Committed long-term practitioners', colour: 'bg-purple-100 text-purple-800 border-purple-200' },
              ].map((s, i) => (
                <div key={s.stage} className="flex items-center gap-4">
                  <div className={`text-center border-2 rounded-2xl px-6 py-4 min-w-[160px] ${s.colour}`}>
                    <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{s.stage}</p>
                    <p className="font-bold text-lg mt-1">{s.label}</p>
                    <p className="text-xs mt-1 opacity-80 leading-snug">{s.desc}</p>
                  </div>
                  {i < 2 && <span className="text-gray-300 text-2xl hidden sm:block">→</span>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pranayams ── */}
        <section className="py-12 border-t border-gray-100">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
            <div>
              <p className="text-saffron-600 font-semibold text-sm uppercase tracking-widest mb-2">
                Pillar 1
              </p>
              <h2 className="text-2xl font-bold text-gray-900">Pranayams — Breathing Practices</h2>
              <p className="text-gray-500 mt-1 text-sm">
                Ten pranayama techniques taught at Nibedita Yoga Training Centre
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {PRANAYAMS.map((p) => (
              <div key={p.name} className="bg-gradient-to-br from-saffron-50 to-orange-50 border border-saffron-100 rounded-xl p-4">
                <p className="font-semibold text-gray-900 text-sm mb-2">{p.name}</p>
                <div className="flex flex-wrap gap-1">
                  {p.targets.map((t) => (
                    <span key={t} className="text-xs bg-saffron-100 text-saffron-800 px-1.5 py-0.5 rounded-full">
                      {healthTargetLabels[t as HealthTarget] ?? t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Dhoti Kriyas ── */}
        <section className="py-8 border-t border-gray-100">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-6 lg:p-8 flex flex-col sm:flex-row gap-6 items-start">
            <div className="text-4xl">🔱</div>
            <div>
              <h3 className="font-bold text-lg mb-2">Yogic Dhoti Kriyas — Cleansing Processes</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Five advanced internal cleansing practices: Yogic Kunjal (stomach wash), Sanka
                Prassalam (bowel cleansing), Sahaj Bostikriya, Neti Kriya (nasal cleansing), and
                Baghi (Tiger Exercise). These are taught <strong className="text-white">under direct
                supervision only</strong> — not for independent practice.
              </p>
              <a
                href={`/${locale}#contact`}
                className="inline-block text-sm font-semibold px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors"
              >
                Enquire for details →
              </a>
            </div>
          </div>
        </section>

        {/* ── Practice Library CTA ── */}
        <section id="library" className="py-12 border-t border-gray-100">
          <div className="rounded-3xl overflow-hidden border-2 border-teal-100 bg-gradient-to-br from-teal-50 via-white to-saffron-50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left: text + stats */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-3">
                  Complete Reference Guide
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-snug">
                  Yogic Practice Library
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Every pranayama, preparatory exercise, asana, and kriya taught at Nibedita Yoga Training Centre —
                  with step-by-step instructions, benefits, and health-goal filters. Use it as a reference guide
                  between classes, or explore before you join.
                </p>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {[
                    { count: practiceTypeCounts.pranayama, label: 'Pranayamas', colour: 'bg-sky-50 border-sky-100 text-sky-800' },
                    { count: practiceTypeCounts.exercise,  label: 'Exercises',  colour: 'bg-teal-50 border-teal-100 text-teal-800' },
                    { count: practiceTypeCounts.asana,     label: 'Asanas',     colour: 'bg-saffron-50 border-saffron-100 text-saffron-800' },
                    { count: practiceTypeCounts.kriya,     label: 'Kriyas',     colour: 'bg-purple-50 border-purple-100 text-purple-800' },
                  ].map(({ count, label, colour }) => (
                    <div key={label} className={`text-center border rounded-xl py-3 px-2 ${colour}`}>
                      <p className="text-2xl font-bold leading-none">{count}</p>
                      <p className="text-xs font-semibold mt-1 opacity-80">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/${locale}/library`}
                    className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-full transition-colors text-sm"
                  >
                    Browse Practice Library →
                  </Link>
                  <a
                    href={`/${locale}#contact`}
                    className="px-6 py-3 bg-white border-2 border-gray-200 hover:border-teal-400 text-gray-700 hover:text-teal-700 font-semibold rounded-full transition-colors text-sm"
                  >
                    Enquire to Join
                  </a>
                </div>
              </div>

              {/* Right: feature bullets */}
              <div className="bg-white/60 p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-teal-100 flex flex-col justify-center gap-4">
                {[
                  { icon: '🔍', title: 'Filter by health goal', desc: 'Find practices for your specific condition — weight, digestion, stress, flexibility, and more.' },
                  { icon: '📖', title: 'Step-by-step guides', desc: 'Full instructions, contraindications, and duration for every practice.' },
                  { icon: '🗂️', title: 'Organised by type', desc: 'Pranayamas, preparatory exercises, asanas, and kriyas — all in one place.' },
                  { icon: '🔗', title: 'Linked to your programme', desc: 'Click "Learn More" on any programme card above to see which practices it covers.' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <span className="text-2xl shrink-0 mt-0.5">{icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-0.5">{title}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
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
