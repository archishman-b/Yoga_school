import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import EventCard from '@/components/events/EventCard';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Events & Updates' };
type Props = { params: { locale: string } };

export const revalidate = 60;

export default async function EventsPage({ params: { locale } }: Props) {
  const t = await getTranslations('events');
  const supabase = createClient();
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('pinned', { ascending: false })
    .order('event_date', { ascending: false })
    .order('created_at', { ascending: false });

  const pinned = (events ?? []).filter((e: any) => e.pinned);
  const rest   = (events ?? []).filter((e: any) => !e.pinned);

  const titleKey = `title_${locale}` as 'title_en' | 'title_hi' | 'title_bn';
  const bodyKey  = `body_${locale}`  as 'body_en'  | 'body_hi'  | 'body_bn';

  return (
    <div className="py-16 px-4 max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-ink">{t('heading')}</h1>
        <p className="text-ink/55 mt-2">{t('subheading')}</p>
      </div>

      {pinned.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs text-saffron-600 font-semibold uppercase tracking-widest">{t('pinned')}</p>
          {pinned.map((event: any) => (
            <EventCard key={event.id} event={event} titleKey={titleKey} bodyKey={bodyKey} />
          ))}
        </div>
      )}

      <div className="space-y-4">
        {rest.map((event: any) => (
          <EventCard key={event.id} event={event} titleKey={titleKey} bodyKey={bodyKey} />
        ))}
        {events?.length === 0 && (
          <div className="text-center py-20 text-ink/40">
            <p className="text-4xl mb-4">🌸</p>
            <p>{t('noEvents')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
