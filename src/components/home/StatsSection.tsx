// StatsSection — dark teal gradient bar with three animated stats
// Pass 3: static numbers (JS count-up animation added in Pass 4)

function LotusIcon({ size = 22, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
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

const STATS = [
  { value: '15+', label: 'Years Teaching' },
  { value: '500+', label: 'Happy Students' },
  { value: '3', label: 'Batch Levels' },
];

export default function StatsSection() {
  return (
    <section
      id="stats"
      aria-label="School statistics"
      style={{ background: 'linear-gradient(120deg, #0D6B6E, #0A5557)' }}
    >
      <div className="max-w-[980px] mx-auto px-[clamp(18px,5vw,56px)] py-[clamp(36px,5vw,56px)]">
        <div className="flex flex-wrap items-center justify-center gap-0">
          {STATS.map((stat, idx) => (
            <div key={stat.value} className="flex items-center">
              {/* Stat item */}
              <div className="flex flex-col items-center px-[clamp(28px,5vw,64px)] py-2 text-center">
                {/* Animated number — Pass 4 will wire up count-up JS via data attrs */}
                <span
                  className="block font-rozha text-saffron-400 leading-none"
                  style={{ fontSize: 'clamp(44px, 7vw, 68px)' }}
                  data-count-to={stat.value.replace('+', '')}
                  data-count-suffix={stat.value.includes('+') ? '+' : ''}
                >
                  {stat.value}
                </span>
                <span
                  className="mt-2 uppercase tracking-[2px] font-semibold"
                  style={{ fontSize: '13px', color: 'rgba(250,247,242,.78)' }}
                >
                  {stat.label}
                </span>
              </div>

              {/* Lotus separator — shown between items, not after last */}
              {idx < STATS.length - 1 && (
                <LotusIcon
                  size={22}
                  className="shrink-0 hidden sm:block text-saffron-400/60"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
