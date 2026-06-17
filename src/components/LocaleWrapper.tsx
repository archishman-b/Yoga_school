'use client';

import { useEffect } from 'react';

type Props = {
  locale: string;
  children: React.ReactNode;
};

// Sets locale-specific attributes on <html> and <body> (which live in the
// root layout) after hydration. suppressHydrationWarning on those elements
// prevents console warnings for the one-frame difference.
export default function LocaleWrapper({ locale, children }: Props) {
  useEffect(() => {
    // Set the lang attribute for accessibility and SEO
    document.documentElement.lang = locale;

    // Apply locale-appropriate body font
    const fontClass =
      locale === 'hi' ? 'font-devanagari' :
      locale === 'bn' ? 'font-bengali' :
      'font-sans';

    // Remove previous locale font classes before adding the new one
    document.body.classList.remove('font-sans', 'font-devanagari', 'font-bengali');
    document.body.classList.add(fontClass);
  }, [locale]);

  return <>{children}</>;
}
