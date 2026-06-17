import { requireAdmin } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import EnquiryActions from '@/components/admin/EnquiryActions';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin — Enquiries' };
type Props = { params: { locale: string } };

export default async function AdminEnquiriesPage({ params: { locale } }: Props) {
  await requireAdmin(locale);
  const supabase = createClient();
  const { data: enquiries } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });

  const statusMap: Record<string, { label: string; cls: string }> = {
    new:       { label: 'New',       cls: 'bg-amber-50 text-amber-700' },
    contacted: { label: 'Contacted', cls: 'bg-blue-50 text-blue-700' },
    replied:   { label: 'Replied',   cls: 'bg-green-50 text-green-700' },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
        <p className="text-gray-500 text-sm mt-1">Walk-in and website enquiry leads.</p>
      </div>

      <div className="space-y-3">
        {(enquiries ?? []).map((enq: any) => {
          const { label, cls } = statusMap[enq.status] ?? statusMap.new;
          return (
            <div key={enq.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{enq.name}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <a href={`tel:${enq.phone}`} className="hover:text-teal-600 transition-colors">{enq.phone}</a>
                    {enq.email && <a href={`mailto:${enq.email}`} className="hover:text-teal-600 transition-colors">{enq.email}</a>}
                  </div>
                  {enq.preferred_time && (
                    <p className="text-xs text-gray-400">Preferred: {enq.preferred_time}</p>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(enq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              {enq.message && (
                <p className="text-sm text-gray-600 mt-3 bg-gray-50 rounded-xl px-4 py-3 leading-relaxed">
                  "{enq.message}"
                </p>
              )}
              <div className="mt-3">
                <EnquiryActions enquiryId={enq.id} currentStatus={enq.status} phone={enq.phone} />
              </div>
            </div>
          );
        })}
        {!enquiries?.length && (
          <p className="text-gray-400 text-sm text-center py-12">No enquiries yet.</p>
        )}
      </div>
    </div>
  );
}
