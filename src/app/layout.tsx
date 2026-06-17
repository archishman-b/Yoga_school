// Root layout — required by Next.js App Router.
// All real routes live under [locale]/layout.tsx which handles locale-specific
// lang attribute and font-family via a LocaleWrapper client component.
// suppressHydrationWarning is needed because [locale]/layout.tsx sets
// lang and className on these elements after hydration.

import { Inter, Noto_Sans_Devanagari, Noto_Sans_Bengali, Rozha_One } from 'next/font/google';
import './globals.css';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      className={`${inter.variable} ${notoDevanagari.variable} ${notoBengali.variable} ${rozhaOne.variable}`}
    >
      <body suppressHydrationWarning className="bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
