import { requireAdmin } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import EventEditor from '@/components/admin/EventEditor';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin — Events' };
type Props = { params: { locale: string } };

export default async function AdminEventsPage({ params: { locale } }: Props) {
  await requireAdmin(locale);
  const supabase = createClient();
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500 text-sm mt-1">Create posts, workshops, and announcements.</p>
        </div>
      </div>
      <EventEditor events={events ?? []} />
    </div>
  );
}
