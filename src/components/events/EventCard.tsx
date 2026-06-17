'use client';

import { Share2, Calendar } from 'lucide-react';

type Event = {
  id: string;
  title_en: string; title_hi: string | null; title_bn: string | null;
  body_en: string | null; body_hi: string | null; body_bn: string | null;
  media_url: string | null;
  media_type: 'youtube' | 'image' | 'drive' | null;
  tags: string[] | null;
  event_date: string | null;
  pinned: boolean;
  created_at: string;
};

type Props = {
  event: Event;
  titleKey: 'title_en' | 'title_hi' | 'title_bn';
  bodyKey:  'body_en'  | 'body_hi'  | 'body_bn';
};

function YoutubeEmbed({ url }: { url: string }) {
  // Accept full URLs or short youtu.be
  let videoId = '';
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      videoId = u.pathname.slice(1);
    } else {
      videoId = u.searchParams.get('v') ?? '';
    }
  } catch {}
  if (!videoId) return null;
  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video"
      />
    </div>
  );
}

function DriveEmbed({ url }: { url: string }) {
  // Convert Google Drive share URL to embed URL
  let embedUrl = url;
  const match = url.match(/\/d\/([^/]+)/);
  if (match) embedUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-100">
      <iframe src={embedUrl} className="w-full h-full" allow="autoplay" title="Google Drive media" />
    </div>
  );
}

export default function EventCard({ event, titleKey, bodyKey }: Props) {
  const title = event[titleKey] || event.title_en;
  const body  = event[bodyKey]  || event.body_en;

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title, text: body ?? '', url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    }
  };

  const dateStr = event.event_date
    ? new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date(event.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <article className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${event.pinned ? 'border-saffron-200' : 'border-gray-100'}`}>
      {/* Media */}
      {event.media_url && event.media_type === 'youtube' && (
        <div className="p-4 pb-0"><YoutubeEmbed url={event.media_url} /></div>
      )}
      {event.media_url && event.media_type === 'drive' && (
        <div className="p-4 pb-0"><DriveEmbed url={event.media_url} /></div>
      )}
      {event.media_url && event.media_type === 'image' && (
        <img src={event.media_url} alt={title} className="w-full max-h-80 object-cover" />
      )}

      <div className="p-5 space-y-3">
        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {event.tags.map((tag: string) => (
              <span key={tag} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h2 className="text-lg font-bold text-gray-900">{title}</h2>

        {body && (
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{body}</p>
        )}

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar size={13} />
            <span>{dateStr}</span>
          </div>
          <button
            onClick={share}
            className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
          >
            <Share2 size={13} /> Share
          </button>
        </div>
      </div>
    </article>
  );
}
