import { createClient } from '@/lib/supabase/server';
import EventPostForm from '@/components/admin/EventPostForm';
import AdminEventRow from '@/components/admin/AdminEventRow';

type Props = { params: { locale: string } };

export default async function AdminEventsPage({ params: { locale } }: Props) {
  const supabase = createClient();
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <p className="text-gray-500 text-sm mt-1">Post announcements, workshops, and news.</p>
      </div>

      <EventPostForm locale={locale} />

      <div className="space-y-3">
        {(events ?? []).map((event: any) => (
          <AdminEventRow key={event.id} event={event} />
        ))}
        {(!events || events.length === 0) && (
          <p className="text-sm text-gray-400 text-center py-10">No events yet.</p>
        )}
      </div>
    </div>
  );
}
