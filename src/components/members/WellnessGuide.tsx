// Wellness guidelines from the school's official prospectus.
// Water Drinking Protocol, Food Timing, Practice Rules, and Yogic Diet.

const WATER_SCHEDULE = [
  { time: 'Before leaving bed',         amount: '1 glass',  icon: '🌅' },
  { time: 'One hour before breakfast',  amount: '1 glass',  icon: '☀️' },
  { time: 'One hour after breakfast',   amount: '1 glass',  icon: '🥣' },
  { time: 'One hour before lunch',      amount: '1 glass',  icon: '🌞' },
  { time: 'One hour after lunch',       amount: '1 glass',  icon: '🍱' },
  { time: 'One hour before dinner',     amount: '1 glass',  icon: '🌆' },
  { time: 'One hour after dinner',      amount: '1 glass',  icon: '🌙' },
];

const FOOD_TIMING = [
  { meal: 'Breakfast',          time: '6:00 AM – 8:00 AM',   icon: '🥣' },
  { meal: 'Lunch',              time: '12:00 noon – 1:00 PM', icon: '🍱' },
  { meal: 'Light Refreshment',  time: '5:00 PM – 6:00 PM',   icon: '🫖' },
  { meal: 'Dinner',             time: '8:00 PM – 9:00 PM',   icon: '🍽️' },
];

const PRACTICE_RULES = [
  'Practise selected exercises under expert guidance for at least 3–5 days before independent practice.',
  'Duration depends on individual capacity — never force or rush your practice.',
  'If you can hold a posture comfortably for more than two minutes, a single round is sufficient.',
  'Practise on a clean, flat, comfortable surface.',
  'Never practise in a hurried or distracted state.',
  'Your practice space should be free from dust, smoke, and disturbance.',
  'All asanas and yogic exercises must be done on an empty stomach.',
  'Asanas may be performed 4 hours after a meal.',
  'We never force progress — each body finds its own pace.',
  'Women are advised to rest from physical practice during menstruation.',
  'Cross-ventilation is important during asana practice.',
  'The Yamas and Niyamas — yoga\'s ethical foundation — are observed as part of your practice.',
  'Avoid smoking, alcohol, and mental tension.',
  'A vegetarian diet supports faster and deeper results.',
  'Your results are a reflection of your sincerity and devotion to practice.',
];

const FOOD_TYPES = [
  {
    type: 'Sattvic Foods',
    subtitle: 'Pure, fresh, and life-giving',
    desc: 'The ideal diet for yoga students. Light, fresh, and nourishing.',
    examples: 'Whole grains, fresh fruits and vegetables, pure fruit juices, milk, butter, cheese, nuts, seeds, sprouted seeds, honey',
    colour: 'bg-green-50 border-green-200',
    badge: 'bg-green-100 text-green-800',
    icon: '🌿',
    ratio: '2/3 fruits & vegetables + 1/3 cereals (rice & roti)',
  },
  {
    type: 'Rajasic Foods',
    subtitle: 'Stimulating and overpowering to the senses',
    desc: 'To be minimised. Stimulates the mind but disturbs the inner calm needed for practice.',
    examples: 'Spicy foods, strong condiments, caffeinated drinks, excessive salt and sugar',
    colour: 'bg-amber-50 border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
    icon: '🌶️',
    ratio: 'Minimise',
  },
  {
    type: 'Tamasic Foods',
    subtitle: 'Heavy, processed, and energy-depleting',
    desc: 'To be avoided. Creates heaviness, lethargy, and a dull mind — incompatible with yoga.',
    examples: 'Stale or reheated food, processed and packaged foods, alcohol, excessive meat',
    colour: 'bg-red-50 border-red-200',
    badge: 'bg-red-100 text-red-800',
    icon: '⚠️',
    ratio: 'Avoid',
  },
];

export default function WellnessGuide() {
  return (
    <div className="space-y-10">

      {/* ── Section intro ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Wellness Guidelines</h1>
        <p className="text-gray-500 text-sm mt-1">
          Official guidelines from the school's prospectus — your complete guide to supporting
          your practice with the right habits.
        </p>
      </div>

      {/* ── Siva Samhita quote ── */}
      <div className="relative bg-gradient-to-br from-teal-900 to-teal-800 rounded-2xl p-8 text-white text-center overflow-hidden">
        <div className="absolute top-4 left-6 text-teal-600 text-8xl font-serif leading-none opacity-30 select-none">"</div>
        <div className="relative z-10">
          <p className="text-xl sm:text-2xl font-light italic leading-relaxed mb-4">
            Let the yogic eat moderately and abstemiously, otherwise, however clever, he cannot gain
            success.
          </p>
          <p className="text-teal-300 font-semibold text-sm">— Siva Samhita</p>
        </div>
      </div>

      {/* ── Water Drinking Protocol ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-blue-50">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="text-xl">💧</span>
            Daily Water Drinking Protocol
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            7 glasses per day at specific intervals — a cornerstone of the school's wellness approach
          </p>
        </div>
        <div className="p-6">
          {/* Visual timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
            {WATER_SCHEDULE.map((w, i) => (
              <div key={i} className="relative">
                {i < WATER_SCHEDULE.length - 1 && (
                  <div className="hidden sm:block absolute right-0 top-6 w-full border-t-2 border-dashed border-blue-200 z-0" />
                )}
                <div className="relative z-10 flex flex-col items-center text-center bg-white">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl mb-2">
                    {w.icon}
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 rounded-full px-2 py-0.5 mb-1.5">
                    {w.amount}
                  </span>
                  <p className="text-xs text-gray-500 leading-tight">{w.time}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-blue-600 font-semibold mt-6">
            Total: 7 glasses per day — at specific, timed intervals
          </p>
          <p className="text-center text-xs text-gray-400 mt-1">
            This is not just "drink more water" — the timing is precise and intentional.
          </p>
        </div>
      </div>

      {/* ── Food Timing ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-orange-50">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="text-xl">🕐</span>
            Recommended Meal Timing
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Aligned with the school's yoga schedule for maximum benefit
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100">
          {FOOD_TIMING.map(f => (
            <div key={f.meal} className="px-5 py-6 text-center">
              <div className="text-3xl mb-2">{f.icon}</div>
              <p className="font-semibold text-gray-900 text-sm">{f.meal}</p>
              <p className="text-xs text-saffron-600 font-medium mt-1">{f.time}</p>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            <strong>Remember:</strong> Asanas must be practised on an empty stomach. Allow at least
            4 hours after a meal before practice.
          </p>
        </div>
      </div>

      {/* ── Yogic Diet — 3 food types ── */}
      <div>
        <h2 className="font-semibold text-gray-900 text-lg mb-1">Yogic Diet Philosophy</h2>
        <p className="text-sm text-gray-500 mb-5">
          Yogic science classifies all food into three categories. What we eat nourishes the body —
          but the essence of food also forms the mind.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {FOOD_TYPES.map(f => (
            <div key={f.type} className={`border-2 rounded-2xl p-5 space-y-3 ${f.colour}`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{f.icon}</span>
                <div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${f.badge}`}>{f.ratio}</span>
                  <h3 className="font-bold text-gray-900 mt-1">{f.type}</h3>
                  <p className="text-xs text-gray-600">{f.subtitle}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{f.desc}</p>
              <div className="bg-white/60 rounded-xl px-3 py-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Examples</p>
                <p className="text-xs text-gray-600 leading-relaxed">{f.examples}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
          <strong>Recommended ratio:</strong> 1/3 cereals (rice and roti) + 2/3 fruits and vegetables
          — full of prana, a pure and moderated diet is the surest guarantee of physical and mental harmony.
        </div>
      </div>

      {/* ── Practice Rules ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="text-xl">📋</span>
            Practice Guidelines
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Official guidelines from the school's prospectus — please read carefully
          </p>
        </div>
        <ul className="divide-y divide-gray-50">
          {PRACTICE_RULES.map((rule, i) => (
            <li key={i} className="px-6 py-4 flex items-start gap-4">
              <span className="shrink-0 w-6 h-6 bg-teal-100 text-teal-700 text-xs font-bold rounded-full flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">{rule}</p>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
