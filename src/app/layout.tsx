// This root layout is required by Next.js but navigation is handled
// by the [locale] layout and the next-intl middleware (src/middleware.ts).
// The middleware redirects / → /en/ automatically.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
