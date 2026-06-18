'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

// ── Easing ────────────────────────────────────────────────────────────────────
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

// ── Count-up for a single element ─────────────────────────────────────────────
function animateCount(el: HTMLElement): void {
  const raw = el.dataset.countTo ?? '0';
  const target = parseInt(raw, 10);
  const suffix = el.dataset.countSuffix ?? '';
  if (isNaN(target)) return;

  const DURATION = 2200; // ms
  const startTime = performance.now();

  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / DURATION, 1);
    const value = Math.round(easeOutQuart(progress) * target);
    el.textContent = String(value) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ── Lotus SVG (inline — no import needed for a client component) ──────────────
function LotusIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
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

// ── Scroll rail ───────────────────────────────────────────────────────────────
const RAIL_HEIGHT = 420; // px — visual height of the rail line

function ScrollRail() {
  const [progress, setProgress] = useState(0); // 0–1

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const lotusTop = Math.round(progress * RAIL_HEIGHT); // px offset from rail top

  return (
    <div
      aria-hidden="true"
      className="fixed left-[22px] top-1/2 z-[10] hidden lg:flex flex-col items-center pointer-events-none"
      style={{ transform: 'translateY(-50%)', height: RAIL_HEIGHT }}
    >
      {/* Background rail */}
      <div
        className="absolute inset-0 w-[1.5px] mx-auto rounded-full"
        style={{
          background: 'linear-gradient(to bottom, #E8740C, #0D6B6E)',
          opacity: 0.18,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      {/* Filled progress rail */}
      <div
        className="absolute top-0 w-[1.5px] rounded-full"
        style={{
          background: 'linear-gradient(to bottom, #E8740C, #0D6B6E)',
          height: `${lotusTop}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0.7,
          transition: 'height 0.1s linear',
        }}
      />

      {/* Lotus icon riding the rail */}
      <div
        className="absolute text-saffron-500 transition-[top] duration-100 linear"
        style={{
          top: `${Math.max(0, lotusTop - 8)}px`,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <LotusIcon size={16} />
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function PageAnimations() {
  const pathname = usePathname();
  const countFiredRef = useRef(false);

  useEffect(() => {
    // Reset count-up trigger on each route so stats re-animate on revisit
    countFiredRef.current = false;

    // Skip if browser prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Small delay so the new page's DOM is committed before we query
    const timer = setTimeout(() => {
      // ── 1. Section reveal observer ──────────────────────────────────────
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).classList.add('is-revealed');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.10, rootMargin: '0px 0px -40px 0px' },
      );

      // Include any .reveal elements that don't already have is-revealed
      document.querySelectorAll('.reveal:not(.is-revealed), .reveal-image:not(.is-revealed)').forEach((el) => {
        revealObserver.observe(el);
      });

      // ── 2. Stats count-up observer ──────────────────────────────────────
      const statsEl = document.getElementById('stats');
      let countObserver: IntersectionObserver | null = null;

      if (statsEl) {
        countObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !countFiredRef.current) {
                countFiredRef.current = true;
                entry.target
                  .querySelectorAll<HTMLElement>('[data-count-to]')
                  .forEach(animateCount);
                countObserver?.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.5 },
        );
        countObserver.observe(statsEl);
      }

      return () => {
        revealObserver.disconnect();
        countObserver?.disconnect();
      };
    }, 50); // 50ms: one paint after route commit

    return () => clearTimeout(timer);
  }, [pathname]); // re-run on every route change

  return <ScrollRail />;
}
