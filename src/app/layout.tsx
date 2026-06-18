// Root layout — required by Next.js App Router.
// All real routes live under [locale]/layout.tsx which handles locale-specific
// lang attribute and font-family via a LocaleWrapper client component.
// suppressHydrationWarning is needed because [locale]/layout.tsx sets
// lang and className on these elements after hydration.

import { DM_Sans, Noto_Serif_Bengali, Noto_Sans_Devanagari, Rozha_One, Yatra_One } from 'next/font/google';
import './globals.css';

// Primary UI/body font — matches design prototype (replaces Inter)
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-noto-devanagari',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

// Bengali script — Serif variant matches design prototype
const notoBengali = Noto_Serif_Bengali({
  subsets: ['bengali'],
  variable: '--font-noto-bengali',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const yatraOne = Yatra_One({
  subsets: ['latin'],
  variable: '--font-yatra',
  display: 'swap',
  weight: '400',
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
      className={`${dmSans.variable} ${notoDevanagari.variable} ${notoBengali.variable} ${rozhaOne.variable} ${yatraOne.variable}`}
    >
      <body
        suppressHydrationWarning
        className="bg-cream text-ink antialiased"
      >
        {children}
      </body>
    </html>
  );
}
