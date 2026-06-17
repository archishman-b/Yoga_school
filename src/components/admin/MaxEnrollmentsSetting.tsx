'use client';

import { useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Settings2 } from 'lucide-react';

export default function MaxEnrollmentsSetting({ current }: { current: number }) {
  const [value, setValue] = useState(current);
  const [saved, setSaved] = useState(true);
  const [isPending, startTransition] = useTransition();

  const save = () => {
    startTransition(async () => {
      const supabase = createClient();
      await supabase
        .from('school_settings')
        .update({ max_enrollments_per_member: value })
        .eq('id', 1);
      setSaved(true);
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm shrink-0">
      <div className="w-9 h-9 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center">
        <Settings2 size={18} />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">Max enrollments per member</p>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="number"
            min={1}
            max={10}
            value={value}
            onChange={(e) => { setValue(Number(e.target.value)); setSaved(false); }}
            className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm font-semibold text-gray-800 text-center focus:outline-none focus:border-teal-400"
          />
          <button
            onClick={save}
            disabled={isPending || saved}
            className="text-xs px-3 py-1.5 bg-teal-600 text-white rounded-lg font-semibold disabled:opacity-40 hover:bg-teal-700 transition-colors"
          >
            {isPending ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
