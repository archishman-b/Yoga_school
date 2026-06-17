import { createClient } from '@/lib/supabase/server';
import EventCard from '@/components/events/EventCard';
import type { Locale } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Events & News' };

type Props = { params: { locale: string } };

export default async function EventsPage({ params: { locale } }: Props) {
  const supabase = createClient();

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });

  const pinned = (events ?? []).filter((e: any) => e.pinned);
  const rest   = (events ?? []).filter((e: any) => !e.pinned);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-gray-900">Events & News</h1>
          <p className="text-gray-500 mt-2">
            Stay up-to-date with classes, workshops, and school announcements.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Pinned */}
        {pinned.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-saffron-600 uppercase tracking-widest mb-4">
              📌 Pinned
            </h2>
            <div className="space-y-4">
              {pinned.map((event: any) => (
                <EventCard key={event.id} event={event} locale={locale as Locale} />
              ))}
            </div>
          </section>
        )}

        {/* Feed */}
        {rest.length > 0 ? (
          <section>
            {pinned.length > 0 && (
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Latest
              </h2>
            )}
            <div className="space-y-4">
              {rest.map((event: any) => (
                <EventCard key={event.id} event={event} locale={locale as Locale} />
              ))}
            </div>
          </section>
        ) : (
          events?.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">🌸</p>
              <p className="font-medium">No events yet</p>
              <p className="text-sm mt-1">Check back soon!</p>
            </div>
          )
        )}
      </div>
    </main>
  );
}
