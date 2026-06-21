'use client';

import { useEffect, useRef } from 'react';

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
  { value: 26, suffix: '+', label: 'Years Teaching' },
  { value: 10000, suffix: '+', label: 'Happy Students' },
  { value: 3, suffix: '', label: 'Batch Levels' },
];

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !firedRef.current) {
          firedRef.current = true;
          observer.disconnect();

          const spans = section.querySelectorAll<HTMLElement>('[data-count-to]');
          spans.forEach((el) => {
            const target = parseInt(el.dataset.countTo ?? '0', 10);
            const suffix = el.dataset.countSuffix ?? '';
            const DURATION = 2200;
            const startTime = performance.now();

            const step = (now: number) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / DURATION, 1);
              el.textContent = String(Math.round(easeOutQuart(progress) * target)) + suffix;
              if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          });
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="stats"
      ref={sectionRef}
      aria-label="School statistics"
      style={{ background: 'linear-gradient(120deg, #0D6B6E, #0A5557)' }}
    >
      <div className="max-w-[980px] mx-auto px-[clamp(18px,5vw,56px)] py-[clamp(36px,5vw,56px)]">
        <div className="flex flex-wrap items-center justify-center gap-0">
          {STATS.map((stat, idx) => (
            <div key={stat.label} className="flex items-center">
              <div className="flex flex-col items-center px-[clamp(28px,5vw,64px)] py-2 text-center">
                <span
                  className="block font-rozha text-saffron-400 leading-none"
                  style={{ fontSize: 'clamp(44px, 7vw, 68px)' }}
                  data-count-to={String(stat.value)}
                  data-count-suffix={stat.suffix}
                >
                  {stat.value}{stat.suffix}
                </span>
                <span
                  className="mt-2 uppercase tracking-[2px] font-semibold"
                  style={{ fontSize: '13px', color: 'rgba(250,247,242,.78)' }}
                >
                  {stat.label}
                </span>
              </div>

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
