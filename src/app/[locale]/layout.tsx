import type { Metadata } from 'next';
import { Inter, Noto_Sans_Devanagari, Noto_Sans_Bengali } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-noto-devanagari',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const notoBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  variable: '--font-noto-bengali',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Ananda Yoga Kendra',
    default: 'Ananda Yoga Kendra — Authentic Yoga in [Your City]',
  },
  description:
    'Expert instruction in Hatha, Vinyasa & Pranayama. Batches for all levels, all ages. Book a free trial class today.',
  openGraph: {
    title: 'Ananda Yoga Kendra',
    description: 'Transform your life through the ancient science of yoga.',
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

  const fontClass =
    locale === 'hi'
      ? notoDevanagari.variable
      : locale === 'bn'
      ? notoBengali.variable
      : inter.variable;

  return (
    <html lang={locale} className={`${inter.variable} ${notoDevanagari.variable} ${notoBengali.variable}`}>
      <body className={`${fontClass} font-sans bg-white text-gray-900 antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
