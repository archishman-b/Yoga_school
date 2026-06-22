'use client';

import { useRef, useState } from 'react';
import { Download, Loader2, Image as ImageIcon } from 'lucide-react';
import ProfileCard from './ProfileCard';
import type { Profile } from '@/lib/supabase/types';

declare global {
  interface Window {
    // html2canvas loaded dynamically from CDN
    html2canvas?: (el: HTMLElement, opts?: Record<string, unknown>) => Promise<HTMLCanvasElement>;
  }
}

// Load html2canvas from CDN once, cache on window
async function loadHtml2Canvas(): Promise<typeof window.html2canvas> {
  if (typeof window === 'undefined') return undefined;
  if (window.html2canvas) return window.html2canvas;

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-html2canvas]');
    if (existing) {
      // Script already appended, wait for it
      existing.addEventListener('load', () => resolve(window.html2canvas));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.setAttribute('data-html2canvas', '1');
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve(window.html2canvas);
    script.onerror = () => reject(new Error('Failed to load html2canvas'));
    document.head.appendChild(script);
  });
}

type Props = { profile: Profile };

export default function DownloadProfileCard({ profile }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [show,   setShow]   = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setStatus('loading');
    try {
      const h2c = await loadHtml2Canvas();
      if (!h2c) throw new Error('html2canvas unavailable');

      const canvas = await h2c(cardRef.current, {
        scale:           2,          // 2× for retina / WhatsApp quality
        useCORS:         true,
        allowTaint:      false,
        backgroundColor: '#FFFBF0',
        logging:         false,
        imageTimeout:    8000,
      });

      const link = document.createElement('a');
      const name  = (profile.full_name ?? 'member').replace(/\s+/g, '-').toLowerCase();
      const id    = profile.member_id ? `-${profile.member_id}` : '';
      link.download = `NYT-profile${id}-${name}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setStatus('done');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div>
      {/* ── Toggle to preview the card ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors">
          <ImageIcon size={15} />
          {show ? 'Hide Preview' : 'Preview Admission Card'}
        </button>

        <button
          type="button"
          onClick={handleDownload}
          disabled={status === 'loading'}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-60 rounded-xl transition-colors">
          {status === 'loading'
            ? <><Loader2 size={15} className="animate-spin" /> Generating…</>
            : status === 'done'
              ? '✓ Downloaded!'
              : status === 'error'
                ? '⚠ Try again'
                : <><Download size={15} /> Download as Image</>}
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-1.5">
        Downloads a high-quality PNG image — easy to share on WhatsApp. Contains all your profile and health details.
      </p>

      {/* ── Card preview (shown when toggled) ── */}
      {show && (
        <div className="mt-4 overflow-x-auto">
          <div className="inline-block border border-gray-200 rounded-xl overflow-hidden shadow-lg">
            <ProfileCard profile={profile} cardRef={cardRef} />
          </div>
        </div>
      )}

      {/* ── Hidden capture target (always in DOM for html2canvas) ── */}
      {!show && (
        <div style={{ position: 'absolute', left: '-9999px', top: 0, pointerEvents: 'none' }} aria-hidden="true">
          <ProfileCard profile={profile} cardRef={cardRef} />
        </div>
      )}
    </div>
  );
}
