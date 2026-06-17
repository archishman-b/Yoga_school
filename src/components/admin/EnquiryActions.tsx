'use client';

import { useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MessageCircle } from 'lucide-react';

type Props = { enquiryId: string; currentStatus: string; phone: string };

export default function EnquiryActions({ enquiryId, currentStatus, phone }: Props) {
  const [isPending, startTransition] = useTransition();

  const setStatus = (status: string) => {
    startTransition(async () => {
      const supabase = createClient();
      await supabase.from('enquiries').update({ status }).eq('id', enquiryId);
      window.location.reload();
    });
  };

  const waLink = `https://wa.me/91${phone.replace(/\D/g, '')}?text=${encodeURIComponent("Namaste! 🙏 Thank you for your interest in Nibedita Yoga Training Centre. We'd love to help you get started on your yoga journey.")}`;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <a href={waLink} target="_blank" rel="noopener noreferrer"
        onClick={() => currentStatus === 'new' && setStatus('contacted')}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors">
        <MessageCircle size={13} /> WhatsApp
      </a>
      {currentStatus !== 'replied' && (
        <button onClick={() => setStatus('replied')} disabled={isPending}
          className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-xs font-semibold hover:bg-teal-100 disabled:opacity-40 transition-colors">
          Mark Replied
        </button>
      )}
      {currentStatus === 'new' && (
        <button onClick={() => setStatus('contacted')} disabled={isPending}
          className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 disabled:opacity-40 transition-colors">
          Mark Contacted
        </button>
      )}
    </div>
  );
}
