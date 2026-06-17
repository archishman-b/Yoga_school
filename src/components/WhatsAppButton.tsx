'use client';

import { MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

// Replace with the school's actual WhatsApp number (country code + number, no +, no spaces)
const WHATSAPP_NUMBER = '918017112877';

export default function WhatsAppButton() {
  const t = useTranslations('whatsapp');

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('tooltip')}
      title={t('tooltip')}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#1ebe57] transition-colors active:scale-95"
    >
      <MessageCircle size={28} fill="white" />
    </a>
  );
}
