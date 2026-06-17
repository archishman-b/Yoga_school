import { createClient } from '@/lib/supabase/server';
import BatchForm from '@/components/admin/BatchForm';
import DeleteBatch from '@/components/admin/DeleteBatch';
import { CalendarDays, Users } from 'lucide-react';

type Props = { params: { locale: string } };

export default async function AdminBatchesPage({ params: { locale } }: Props) {
  const supabase = createClient();
  const { data: batches } = await supabase
    .from('batches')
    .select('*')
    .order('level')
    .order('timing');

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batches</h1>
          <p className="text-gray-500 text-sm mt-1">Manage class schedules and capacity.</p>
        </div>
      </div>

      {/* Add batch form */}
      <BatchForm locale={locale} />

      {/* Existing batches */}
      <div className="space-y-3">
        {(batches ?? []).map((batch: any) => (
          <div key={batch.id} className="card p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
              <CalendarDays size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900 text-sm">{batch.name_en}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  batch.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {batch.status}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                  {batch.level}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{batch.timing} · {batch.days}</p>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
                <Users size={12} />
                {batch.enrolled ?? 0}/{batch.capacity} enrolled
              </div>
            </div>
            <DeleteBatch batchId={batch.id} />
          </div>
        ))}
        {(!batches || batches.length === 0) && (
          <p className="text-sm text-gray-400 text-center py-8">No batches yet. Add one above.</p>
        )}
      </div>
    </div>
  );
}
