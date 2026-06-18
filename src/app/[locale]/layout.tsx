import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import LocaleWrapper from '@/components/LocaleWrapper';
import PageAnimations from '@/components/PageAnimations';

export const metadata: Metadata = {
  title: {
    template: '%s | Nibedita Yoga Training Centre',
    default: 'Nibedita Yoga Training Centre — Authentic Yoga in Hindmotor, Hooghly',
  },
  description:
    'Expert instruction in Hatha, Vinyasa & Pranayama at Nibedita Yoga Training Centre, Hindmotor, Hooghly. Batches for all levels, all ages. Book a free trial class today.',
  openGraph: {
    title: 'Nibedita Yoga Training Centre',
    description: 'Transform your life through the ancient science of yoga. Classes in Hindmotor, Hooghly.',
    type: 'website',
  },
};

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  // <html> and <body> live in the root layout (src/app/layout.tsx).
  // LocaleWrapper (client component) sets html[lang] and the correct
  // body font-family class after hydration. suppressHydrationWarning on
  // both elements (in root layout) suppresses the one-frame mismatch.
  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleWrapper locale={locale}>
        <Navbar />
        <main className="pt-[72px]">{children}</main>
        <Footer />
        <WhatsAppButton />
        <PageAnimations />
      </LocaleWrapper>
    </NextIntlClientProvider>
  );
}
