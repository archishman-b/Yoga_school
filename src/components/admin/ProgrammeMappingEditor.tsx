'use client';

import { useState, useTransition } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { practices, practiceTypeLabels, type Practice, type PracticeType } from '@/lib/data/practices';
import { createClient } from '@/lib/supabase/client';

type Props = {
  programme: { id: string; name: string; colour: string };
  initialMappedIds: string[];
};

const ALL_TYPES: PracticeType[] = ['pranayama', 'exercise', 'asana', 'kriya'];

export default function ProgrammeMappingEditor({ programme, initialMappedIds }: Props) {
  const [open, setOpen] = useState(false);
  const [mappedIds, setMappedIds] = useState<Set<string>>(new Set(initialMappedIds));
  const [isPending, startTransition] = useTransition();
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggle = async (practiceId: string) => {
    const newSet = new Set(mappedIds);
    const wasAdded = !newSet.has(practiceId);
    if (wasAdded) newSet.add(practiceId); else newSet.delete(practiceId);
    setMappedIds(newSet);

    startTransition(async () => {
      const supabase = createClient();
      setError(null);
      if (wasAdded) {
        const { error: e } = await supabase
          .from('programme_practice_mappings')
          .insert({ programme_id: programme.id, practice_id: practiceId });
        if (e) { setError(e.message); setMappedIds(mappedIds); return; }
      } else {
        const { error: e } = await supabase
          .from('programme_practice_mappings')
          .delete()
          .eq('programme_id', programme.id)
          .eq('practice_id', practiceId);
        if (e) { setError(e.message); setMappedIds(mappedIds); return; }
      }
      setLastSaved(new Date().toLocaleTimeString());
    });
  };

  const grouped: Record<PracticeType, Practice[]> = {
    pranayama: practices.filter((p) => p.type === 'pranayama'),
    exercise:  practices.filter((p) => p.type === 'exercise'),
    asana:     practices.filter((p) => p.type === 'asana'),
    kriya:     practices.filter((p) => p.type === 'kriya'),
  };

  return (
    <div className={`rounded-2xl border ${programme.colour} overflow-hidden`}>
      {/* Header row */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-black/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-900">{programme.name}</span>
          <span className="px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-medium">
            {mappedIds.size} practice{mappedIds.size !== 1 ? 's' : ''}
          </span>
        </div>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-gray-200 bg-white px-5 py-5 space-y-5">
          {error && (
            <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
          {lastSaved && (
            <p className="text-green-600 text-xs">✓ Saved at {lastSaved}</p>
          )}

          {ALL_TYPES.map((type) => (
            <div key={type}>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                {practiceTypeLabels[type]}s ({grouped[type].filter((p) => mappedIds.has(p.slug)).length} selected)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {grouped[type].map((p) => {
                  const checked = mappedIds.has(p.slug);
                  return (
                    <label
                      key={p.slug}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                        checked
                          ? 'bg-teal-50 border-teal-300'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(p.slug)}
                        disabled={isPending}
                        className="accent-teal-600 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{p.name_en}</p>
                        {p.name_hi && (
                          <p className="text-xs text-gray-400 truncate">{p.name_hi}</p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
