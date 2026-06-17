'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MarkEnquiryDone({ enquiryId }: { enquiryId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const mark = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.from('enquiries').update({ status: 'contacted' }).eq('id', enquiryId);
    setDone(true);
    setLoading(false);
    router.refresh();
  };

  if (done) return <CheckCircle2 size={18} className="text-green-500 shrink-0" />;

  return (
    <button
      onClick={mark}
      disabled={loading}
      className="px-3 py-1.5 text-xs bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium disabled:opacity-50 whitespace-nowrap shrink-0"
    >
      {loading ? '…' : 'Mark Done'}
    </button>
  );
}
