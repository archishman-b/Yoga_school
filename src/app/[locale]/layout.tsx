import type { Metadata } from 'next';
import { Inter, Noto_Sans_Devanagari, Noto_Sans_Bengali, Rozha_One } from 'next/font/google';
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

const rozhaOne = Rozha_One({
  subsets: ['latin'],
  variable: '--font-rozha',
  display: 'swap',
  weight: '400',
});

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

  // fontFamily drives which Tailwind font-family class is active on the body.
  // font-sans = Inter (Latin), font-devanagari = Noto Sans Devanagari, font-bengali = Noto Sans Bengali.
  // All four font CSS variables are always loaded on <html> so mixed-script content still works.
  const bodyFont =
    locale === 'hi' ? 'font-devanagari' :
    locale === 'bn' ? 'font-bengali' :
    'font-sans';

  return (
    <html lang={locale} className={`${inter.variable} ${notoDevanagari.variable} ${notoBengali.variable} ${rozhaOne.variable}`}>
      <body className={`${bodyFont} bg-white text-gray-900 antialiased`}>
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
