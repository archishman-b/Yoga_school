'use client';

import { useState } from 'react';
import { Pin, Share2, MessageCircle, Facebook, Link2, CheckCircle2 } from 'lucide-react';
import { localised, type Locale } from '@/lib/utils';

// ─── helpers ────────────────────────────────────────────────────
function getYouTubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m?.[1] ?? null;
}

function getGDriveEmbedUrl(url: string) {
  const m = url.match(/\/d\/([^/]+)/);
  return m ? `https://drive.google.com/file/d/${m[1]}/preview` : null;
}

function EmbedBlock({ url }: { url: string }) {
  const yt = getYouTubeId(url);
  if (yt) {
    return (
      <div className="relative rounded-xl overflow-hidden aspect-video bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${yt}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  const drive = getGDriveEmbedUrl(url);
  if (drive) {
    return (
      <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-100">
        <iframe
          src={drive}
          title="Google Drive media"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  // Fallback: treat as an image URL
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="Event media" className="w-full rounded-xl max-h-80 object-cover" />
  );
}

// ─── share helpers ───────────────────────────────────────────────
const WHATSAPP_NUMBER = '918017112877';

function shareWhatsApp(text: string, url: string) {
  const msg = encodeURIComponent(`${text}\n${url}`);
  window.open(`https://wa.me/?text=${msg}`, '_blank');
}

function shareFacebook(url: string) {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}

type Event = {
  id: string;
  title_en?: string; title_hi?: string; title_bn?: string;
  body_en?: string;  body_hi?: string;  body_bn?: string;
  media_url?: string;
  event_date?: string;
  pinned: boolean;
  created_at: string;
};

type Props = { event: Event; locale: Locale };

export default function EventCard({ event, locale }: Props) {
  const [copied, setCopied] = useState(false);
  const title = localised(event, 'title', locale) || 'Announcement';
  const body  = localised(event, 'body',  locale) || '';

  const pageUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${locale}/events`
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* header */}
      <div className="px-5 pt-5 pb-3 flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-saffron-100 to-saffron-200 flex items-center justify-center text-base shrink-0">
          🧘
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 text-sm truncate">Nibedita Yoga Training Centre</span>
            {event.pinned && (
              <span className="flex items-center gap-1 text-xs text-saffron-600 font-medium">
                <Pin size={11} /> Pinned
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {event.event_date
              ? new Date(event.event_date).toLocaleDateString('en-IN', {
                  weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
                })
              : new Date(event.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
          </p>
        </div>
      </div>

      {/* title */}
      <div className="px-5 pb-3">
        <h2 className="font-bold text-gray-900 text-base leading-snug">{title}</h2>
      </div>

      {/* media embed */}
      {event.media_url && (
        <div className="px-5 pb-4">
          <EmbedBlock url={event.media_url} />
        </div>
      )}

      {/* body */}
      {body && (
        <div className="px-5 pb-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {body}
        </div>
      )}

      {/* share bar */}
      <div className="border-t border-gray-50 px-5 py-3 flex items-center gap-1">
        <span className="text-xs text-gray-400 mr-2 flex items-center gap-1">
          <Share2 size={12} /> Share
        </span>

        <button
          onClick={() => shareWhatsApp(title, pageUrl)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#25D366] hover:bg-green-50 transition-colors"
        >
          <MessageCircle size={14} /> WhatsApp
        </button>

        <button
          onClick={() => shareFacebook(pageUrl)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#1877F2] hover:bg-blue-50 transition-colors"
        >
          <Facebook size={14} /> Facebook
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors ml-auto"
        >
          {copied ? (
            <><CheckCircle2 size={14} className="text-green-500" /> Copied</>
          ) : (
            <><Link2 size={14} /> Copy Link</>
          )}
        </button>
      </div>
    </article>
  );
}
