import { Heart, Wind, Brain, Activity, Award, Users, BookOpen } from 'lucide-react';

const BODY_SYSTEMS = [
  { icon: Heart,    label: 'Circulatory System',  desc: 'Strengthens the heart and improves blood circulation' },
  { icon: Wind,     label: 'Respiratory System',  desc: 'Deepens breathing capacity through pranayama' },
  { icon: Activity, label: 'Digestive System',    desc: 'Tones abdominal organs and improves metabolism' },
  { icon: Brain,    label: 'Excretory System',    desc: 'Aids the body\'s natural detoxification processes' },
];

const HEALTH_DIMS = [
  { icon: '🧘', label: 'Mental Well-being',  desc: 'Calm the mind. Build concentration, clarity, and emotional resilience.' },
  { icon: '💪', label: 'Physical Health',    desc: 'Strengthen muscles, joints, and the spine. Improve posture and flexibility.' },
  { icon: '🌿', label: 'Social Well-being',  desc: 'Yoga belongs to everyone — all ages, professions, and backgrounds.' },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        {/* ── Hero intro ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-saffron-600 font-semibold text-sm uppercase tracking-widest mb-3">
              Our Story
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-snug">
              Yoga for everyone.<br />
              <span className="text-saffron-600">No special equipment.</span><br />
              No prior experience.<br />
              Just sincerity.
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-4">
              Nibedita Yoga Training Centre was founded with a single conviction: that yoga belongs to
              everyone — every profession, every age, every background. You need no special clothing,
              no equipment, and no prior experience. Just the willingness to begin.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our practice works on every dimension of health simultaneously. The asanas strengthen
              muscles and joints, tone the spine, and keep the skeletal system supple — while working
              on the internal organs, glands, and nervous system to keep every system of the body
              functioning at its full strength.
            </p>
          </div>

          {/* 3 health dimensions */}
          <div className="space-y-4">
            {HEALTH_DIMS.map(d => (
              <div key={d.label} className="flex gap-4 p-5 bg-gradient-to-r from-saffron-50 to-orange-50 rounded-2xl border border-saffron-100">
                <div className="text-3xl shrink-0">{d.icon}</div>
                <div>
                  <p className="font-semibold text-gray-900">{d.label}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Founder quote pull-quote ── */}
        <div className="relative bg-gradient-to-br from-teal-900 to-teal-800 rounded-3xl p-10 lg:p-14 text-white overflow-hidden">
          <div className="absolute top-6 left-8 text-teal-600 text-9xl font-serif leading-none opacity-30 select-none">"</div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <p className="text-xl sm:text-2xl font-light leading-relaxed italic mb-6">
              Yoga is a complete science of life that originated in India many thousands of years ago.
              It is the oldest system of personal development in the world.
            </p>
            <p className="text-teal-300 font-semibold">— Rekha Nath, Founder</p>
          </div>
        </div>

        {/* ── 4 body systems ── */}
        <div>
          <div className="text-center mb-10">
            <p className="text-saffron-600 font-semibold text-sm uppercase tracking-widest mb-3">
              The Four Systems
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              What our curriculum addresses
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              Nibedita Yoga Training Centre was established to keep the body's four main systems fit,
              healthy, and strong — through the integrated practice of asana, pranayama, and kriya.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BODY_SYSTEMS.map(s => (
              <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <s.icon size={24} />
                </div>
                <p className="font-semibold text-gray-900 mb-2">{s.label}</p>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Founder / teacher bio ── */}
        <div className="bg-gradient-to-br from-teal-50 via-white to-saffron-50 rounded-3xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Teacher photo */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-teal-200 to-teal-400 flex items-center justify-center shadow-xl text-6xl">
                🧘‍♀️
              </div>
              {/* TODO: replace emoji with <img src="/rekha-nath.jpg"> once photo provided */}
              <div className="flex gap-4 text-center">
                {[
                  { icon: <Award size={18}/>, val: '15+', lbl: 'Years Teaching' },
                  { icon: <Users size={18}/>, val: '500+', lbl: 'Students' },
                  { icon: <BookOpen size={18}/>, val: '8', lbl: 'Programmes' },
                ].map(s => (
                  <div key={s.lbl} className="bg-white rounded-xl px-3 py-2 shadow-sm text-center border border-gray-100">
                    <div className="text-teal-600 flex justify-center mb-1">{s.icon}</div>
                    <p className="font-bold text-gray-900 text-lg">{s.val}</p>
                    <p className="text-xs text-gray-500">{s.lbl}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest">Lead Instructor & Founder</p>
              <h3 className="text-2xl font-bold text-gray-900">Rekha Nath</h3>
              <p className="text-gray-600 leading-relaxed">
                Nibedita Yoga Training Centre was established to develop three dimensions of health —
                mental, physical, and social well-being — while keeping the body's four main systems
                fit, healthy, and strong.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Most people come to yoga to keep their bodies fit and supple. Some come seeking help
                for a specific complaint — tension, frustration, or back pain. All these aims can be
                achieved if men, women, students, and youth practise yoga sincerely, honestly, and
                regularly, following the Yamas and Niyamas.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Whether you come seeking fitness, relief from a specific condition, or simply a
                steadier life — these goals are all achievable through sincere, regular practice.
              </p>

              {/* Placeholder callout */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 mt-4">
                {/* TODO: Update with Rekha Nath's formal qualifications and training lineage once provided */}
                <span className="font-semibold">📋 Note for admin:</span> Please provide Rekha Nath's formal qualifications, certifications, and training lineage to complete this section.
              </div>
            </div>
          </div>
        </div>

        {/* ── "Even on your own bed" accessibility callout ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              emoji: '🛏️',
              title: 'No special space needed',
              desc: 'Yoga can be practised in even the smallest space — Rekha Nath herself says: "Even on the own bed."',
            },
            {
              emoji: '👕',
              title: 'No special clothing',
              desc: 'Comfortable, loose clothing is all you need. No mat brand, no yoga pants required.',
            },
            {
              emoji: '🌱',
              title: 'All levels welcome',
              desc: 'Beginners, seniors, those with health conditions — our curriculum has a path for everyone.',
            },
          ].map(c => (
            <div key={c.title} className="text-center px-6 py-8 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="text-4xl mb-4">{c.emoji}</div>
              <h4 className="font-semibold text-gray-900 mb-2">{c.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
