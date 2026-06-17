'use client';

import { useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';

type Props = {
  batchId: string;
  initialPct: number;
};

function label(pct: number) {
  if (pct <= 25) return { text: 'Open', color: 'text-green-600' };
  if (pct <= 55) return { text: 'Filling Up', color: 'text-teal-600' };
  if (pct <= 80) return { text: 'Almost Full', color: 'text-amber-600' };
  return { text: 'Full', color: 'text-red-600' };
}

function trackColor(pct: number) {
  if (pct <= 25) return '#16a34a';
  if (pct <= 55) return '#0d9488';
  if (pct <= 80) return '#d97706';
  return '#dc2626';
}

export default function BatchFillSlider({ batchId, initialPct }: Props) {
  const [pct, setPct] = useState(initialPct);
  const [saved, setSaved] = useState(true);
  const [isPending, startTransition] = useTransition();

  const { text, color } = label(pct);

  const save = () => {
    startTransition(async () => {
      const supabase = createClient();
      await supabase
        .from('batches')
        .update({ display_fill_pct: pct })
        .eq('id', batchId);
      setSaved(true);
    });
  };

  return (
    <div className="flex items-center gap-3 min-w-[220px]">
      <div className="flex-1">
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={pct}
          onChange={(e) => { setPct(Number(e.target.value)); setSaved(false); }}
          onMouseUp={save}
          onTouchEnd={save}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${trackColor(pct)} ${pct}%, #e5e7eb ${pct}%)`,
          }}
        />
      </div>
      <span className={`text-xs font-semibold w-20 ${color}`}>
        {text}
        {isPending && <span className="ml-1 opacity-50">…</span>}
        {!isPending && saved && <span className="ml-1 text-gray-300">✓</span>}
      </span>
    </div>
  );
}
