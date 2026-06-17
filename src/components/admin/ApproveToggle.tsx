'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type Props = { memberId: string; currentStatus: string };

export default function ApproveToggle({ memberId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggle = async () => {
    const next = status === 'active' ? 'suspended' : 'active';
    setLoading(true);
    const supabase = createClient();
    await supabase.from('profiles').update({ status: next }).eq('id', memberId);
    setStatus(next);
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${
        status === 'active' ? 'bg-teal-500' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transform transition-transform ${
          status === 'active' ? 'translate-x-[18px]' : 'translate-x-[2px]'
        }`}
      />
    </button>
  );
}
