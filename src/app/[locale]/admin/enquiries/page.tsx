import { createClient } from '@/lib/supabase/server';
import MarkEnquiryDone from '@/components/admin/MarkEnquiryDone';

type Props = { params: { locale: string } };

export default async function AdminEnquiriesPage({ params: { locale } }: Props) {
  const supabase = createClient();
  const { data: enquiries } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });

  const open   = (enquiries ?? []).filter((e: any) => e.status === 'new');
  const closed = (enquiries ?? []).filter((e: any) => e.status !== 'new');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
        <p className="text-gray-500 text-sm mt-1">{open.length} open · {closed.length} closed</p>
      </div>

      {open.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Open</h2>
          <div className="space-y-3">
            {open.map((enq: any) => (
              <EnquiryCard key={enq.id} enq={enq} />
            ))}
          </div>
        </section>
      )}

      {closed.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Closed</h2>
          <div className="space-y-3 opacity-60">
            {closed.map((enq: any) => (
              <EnquiryCard key={enq.id} enq={enq} closed />
            ))}
          </div>
        </section>
      )}

      {(!enquiries || enquiries.length === 0) && (
        <p className="text-sm text-gray-400 text-center py-12">No enquiries yet.</p>
      )}
    </div>
  );
}

function EnquiryCard({ enq, closed = false }: { enq: any; closed?: boolean }) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-bold shrink-0">
        {(enq.name ?? '?')[0].toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-gray-900 text-sm">{enq.name}</p>
          <span className="text-xs text-gray-400">
            {new Date(enq.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          {enq.phone} {enq.email ? `· ${enq.email}` : ''} {enq.preferred_time ? `· Pref: ${enq.preferred_time}` : ''}
        </p>
        {enq.message && <p className="text-sm text-gray-700 mt-2">{enq.message}</p>}
      </div>
      {!closed && <MarkEnquiryDone enquiryId={enq.id} />}
    </div>
  );
}
