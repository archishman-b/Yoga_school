import { createClient } from '@/lib/supabase/server';
import ProgrammeMappingEditor from '@/components/admin/ProgrammeMappingEditor';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Programme Mappings — Admin',
};

// The 8 programmes — mirrors courses/page.tsx PROGRAMMES array
const PROGRAMMES = [
  { id: 'naval-correction',   name: 'Naval Correction Programme',     colour: 'bg-amber-50 border-amber-200' },
  { id: 'growth-development', name: 'Growth & Development Programme', colour: 'bg-green-50 border-green-200' },
  { id: 'height-enhancement', name: 'Height Enhancement Programme',   colour: 'bg-blue-50 border-blue-200' },
  { id: 'anti-ageing',        name: 'Anti-Ageing & Vitality',         colour: 'bg-purple-50 border-purple-200' },
  { id: 'weight-management',  name: 'Weight Management Programme',    colour: 'bg-orange-50 border-orange-200' },
  { id: 'healthy-ageing',     name: 'Healthy Ageing Programme',       colour: 'bg-rose-50 border-rose-200' },
  { id: 'busy-lifestyle',     name: 'Yoga for Busy Lifestyles',       colour: 'bg-sky-50 border-sky-200' },
  { id: 'digestive-health',   name: 'Digestive Health Programme',     colour: 'bg-teal-50 border-teal-200' },
];

export default async function AdminProgrammesPage() {
  const supabase = createClient();

  // Fetch all current mappings
  const { data: mappings } = await supabase
    .from('programme_practice_mappings')
    .select('programme_id, practice_id');

  // Group by programme
  const mappingsByProgramme: Record<string, string[]> = {};
  for (const row of mappings ?? []) {
    if (!mappingsByProgramme[row.programme_id]) mappingsByProgramme[row.programme_id] = [];
    mappingsByProgramme[row.programme_id].push(row.practice_id);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Programme Practice Mappings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Choose which practices are shown as "Illustrative Practices" on each programme's Learn More panel.
          Changes are saved immediately to Supabase.
        </p>
      </div>

      <div className="space-y-4">
        {PROGRAMMES.map((prog) => (
          <ProgrammeMappingEditor
            key={prog.id}
            programme={prog}
            initialMappedIds={mappingsByProgramme[prog.id] ?? []}
          />
        ))}
      </div>
    </div>
  );
}
